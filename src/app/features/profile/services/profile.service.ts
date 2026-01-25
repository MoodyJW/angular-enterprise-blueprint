import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ENVIRONMENT } from '@core/config';
import { LoggerService } from '@core/services/logger';
import { GitHubStats } from '@features/profile/models/github-stats.interface';
import {
  EMPTY,
  Observable,
  catchError,
  expand,
  forkJoin,
  map,
  mergeMap,
  of,
  reduce,
  throwError,
} from 'rxjs';

/**
 * GraphQL query for fetching user profile and contribution stats.
 */
const GITHUB_USER_QUERY = `
  query($login: String!) {
    user(login: $login) {
      login
      name
      avatarUrl
      bio
      location
      company
      email
      websiteUrl
      url
      createdAt
      repositories(ownerAffiliations: OWNER) {
        totalCount
      }
      publicRepositories: repositories(privacy: PUBLIC, ownerAffiliations: OWNER) {
        totalCount
      }
      privateRepositories: repositories(privacy: PRIVATE, ownerAffiliations: OWNER) {
        totalCount
      }
      pullRequests(states: MERGED) {
        totalCount
      }
      contributionsCollection {
        totalCommitContributions
        restrictedContributionsCount
      }
    }
  }
`;

/**
 * GraphQL query for searching PRs in a specific date range.
 */
const GITHUB_PR_SEARCH_QUERY = `
  query($query: String!, $cursor: String) {
    search(query: $query, type: ISSUE, first: 100, after: $cursor) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ... on PullRequest {
          additions
          deletions
        }
      }
    }
  }
`;

/**
 * Raw GraphQL response shape for User query.
 */
interface UserGraphQLResponse {
  data: {
    user: {
      login: string;
      name: string | null;
      avatarUrl: string;
      bio: string | null;
      location: string | null;
      company: string | null;
      email: string | null;
      websiteUrl: string | null;
      url: string;
      createdAt: string;
      repositories: { totalCount: number };
      publicRepositories: { totalCount: number };
      privateRepositories: { totalCount: number };
      pullRequests: {
        totalCount: number;
      };
      contributionsCollection: {
        totalCommitContributions: number;
        restrictedContributionsCount: number;
      };
    };
  };
  errors?: Array<{ message: string }>;
}

/**
 * Response for Search query.
 */
interface SearchGraphQLResponse {
  data: {
    search: {
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
      nodes: Array<{
        additions: number;
        deletions: number;
      }>;
    };
  };
  errors?: Array<{ message: string }>;
}

interface PrStats {
  additions: number;
  deletions: number;
}

/**
 * Service for fetching GitHub statistics.
 *
 * Uses the GitHub GraphQL API to retrieve detailed user profile data
 * including contribution statistics for the Profile/About page.
 *
 * @remarks
 * - Requires a Personal Access Token (PAT) for authentication
 * - Rate limit: 5000 requests/hour with PAT
 */
@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly _http = inject(HttpClient);
  private readonly _logger = inject(LoggerService);
  private readonly _env = inject(ENVIRONMENT);
  private readonly _graphqlUrl = 'https://api.github.com/graphql';

  /**
   * Fetches GitHub statistics for the configured user.
   *
   * @returns Observable of GitHubStats or null if user not configured
   */
  getGitHubStats(): Observable<GitHubStats | null> {
    const username = this._env.github?.username;
    const pat = this._env.github?.pat;

    if (username === undefined || username === '') {
      this._logger.warn('GitHub username not configured in environment', {
        context: 'ProfileService',
      });
      return of(null);
    }

    if (pat === undefined || pat === '') {
      this._logger.warn('GitHub PAT not configured - detailed stats unavailable', {
        context: 'ProfileService',
      });
      return of(null);
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${pat}`,
      'Content-Type': 'application/json',
    });

    const userBody = {
      query: GITHUB_USER_QUERY,
      variables: { login: username },
    };

    // Step 1: Fetch User Data (Profile + CreatedAt)
    return this._http.post<UserGraphQLResponse>(this._graphqlUrl, userBody, { headers }).pipe(
      map((response) => {
        if (response.errors !== undefined && response.errors.length > 0) {
          throw new Error(response.errors[0].message);
        }
        return response.data.user;
      }),
      mergeMap((user) => {
        // Step 2: Calculate date ranges for parallel fetching
        const dateRanges = this._calculateDateRanges(user.createdAt);

        // Step 3: Fetch PR stats for each year in parallel
        const requests = dateRanges.map((range) =>
          this._fetchPrStatsForRange(username, range, headers),
        );

        return forkJoin(requests).pipe(
          map((prStatsList) => {
            // Step 4: Aggregate results
            const totalStats = prStatsList.reduce(
              (acc, curr) => ({
                additions: acc.additions + curr.additions,
                deletions: acc.deletions + curr.deletions,
              }),
              { additions: 0, deletions: 0 },
            );

            return this._mapToGitHubStats(user, totalStats);
          }),
        );
      }),
      catchError((error: unknown) => {
        this._logger.error('Failed to fetch GitHub stats', {
          context: 'ProfileService',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        return throwError(() => this._mapError(error as { status?: number; message?: string }));
      }),
    );
  }

  /**
   * Calculates yearly date ranges from createdAt to now.
   */
  private _calculateDateRanges(createdAt: string): string[] {
    const startYear = new Date(createdAt).getFullYear();
    const currentYear = new Date().getFullYear();
    const ranges: string[] = [];

    for (let year = startYear; year <= currentYear; year++) {
      ranges.push(`${String(year)}-01-01..${String(year)}-12-31`);
    }

    return ranges;
  }

  /**
   * Fetches PR stats for a specific date range, handling pagination if needed.
   */
  private _fetchPrStatsForRange(
    username: string,
    range: string,
    headers: HttpHeaders,
  ): Observable<PrStats> {
    const initialQuery = `author:${username} is:pr is:merged created:${range}`;

    return this._fetchPage(initialQuery, null, headers).pipe(
      expand((data) => {
        if (data.search.pageInfo.hasNextPage && data.search.pageInfo.endCursor !== null) {
          return this._fetchPage(initialQuery, data.search.pageInfo.endCursor, headers);
        }
        return EMPTY;
      }),
      reduce(
        (acc: PrStats, data) => {
          const pageStats = data.search.nodes.reduce(
            (pageAcc, node) => ({
              additions: pageAcc.additions + node.additions,
              deletions: pageAcc.deletions + node.deletions,
            }),
            { additions: 0, deletions: 0 },
          );

          return {
            additions: acc.additions + pageStats.additions,
            deletions: acc.deletions + pageStats.deletions,
          };
        },
        { additions: 0, deletions: 0 },
      ),
    );
  }

  private _fetchPage(
    query: string,
    cursor: string | null,
    headers: HttpHeaders,
  ): Observable<SearchGraphQLResponse['data']> {
    const body = {
      query: GITHUB_PR_SEARCH_QUERY,
      variables: { query, cursor },
    };

    return this._http.post<SearchGraphQLResponse>(this._graphqlUrl, body, { headers }).pipe(
      map((response) => {
        if (response.errors !== undefined && response.errors.length > 0) {
          // If search fails specifically, maybe return empty stats?
          // For now, throw to trigger global error handler.
          throw new Error(response.errors[0].message);
        }
        return response.data;
      }),
    );
  }

  /**
   * Maps GraphQL response to GitHubStats interface.
   */
  private _mapToGitHubStats(
    user: UserGraphQLResponse['data']['user'],
    prStats: PrStats,
  ): GitHubStats {
    const contributions = user.contributionsCollection;
    const totalCommits =
      contributions.totalCommitContributions + contributions.restrictedContributionsCount;

    return {
      login: user.login,
      name: user.name,
      avatarUrl: user.avatarUrl,
      location: user.location,
      company: user.company,
      email: user.email,
      htmlUrl: user.url,
      createdAt: user.createdAt,
      totalRepos: user.repositories.totalCount,
      pullRequests: user.pullRequests.totalCount,
      totalCommits,
      totalLinesAdded: prStats.additions,
      totalLinesRemoved: prStats.deletions,
    };
  }

  /**
   * Maps HTTP errors to user-friendly error messages.
   */
  private _mapError(error: { status?: number; message?: string }): Error {
    // First check HTTP status codes for specific error types
    if (error.status !== undefined) {
      switch (error.status) {
        case 403:
          return new Error('GitHub API rate limit exceeded. Please try again later.');
        case 401:
          return new Error('GitHub authentication failed. Check your PAT configuration.');
      }
    }

    // Check if this is a GraphQL error with a custom message
    // (GraphQL errors don't have HTTP status codes)
    if (
      error.message !== undefined &&
      error.message !== '' &&
      !error.message.startsWith('Http failure')
    ) {
      return new Error(error.message);
    }

    return new Error('Failed to fetch GitHub data. Please check your connection.');
  }
}
