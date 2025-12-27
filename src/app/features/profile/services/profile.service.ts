import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { ENVIRONMENT } from '../../../core/config/environment.token';
import { GitHubStats } from '../models/github-stats.interface';

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
      pullRequests(first: 100, states: MERGED) {
        totalCount
        nodes {
          additions
          deletions
        }
      }
      contributionsCollection {
        totalCommitContributions
        restrictedContributionsCount
      }
    }
  }
`;

/**
 * Raw GraphQL response shape.
 */
interface GraphQLResponse {
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
        nodes: Array<{
          additions: number;
          deletions: number;
        }>;
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
      console.warn('GitHub username not configured in environment');
      return of(null);
    }

    if (pat === undefined || pat === '') {
      console.warn('GitHub PAT not configured - detailed stats unavailable');
      return of(null);
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${pat}`,
      'Content-Type': 'application/json',
    });

    const body = {
      query: GITHUB_USER_QUERY,
      variables: { login: username },
    };

    return this._http.post<GraphQLResponse>(this._graphqlUrl, body, { headers }).pipe(
      map((response) => {
        if (response.errors !== undefined && response.errors.length > 0) {
          throw new Error(response.errors[0].message);
        }
        return this._mapToGitHubStats(response.data.user);
      }),
      catchError((error: unknown) => {
        console.error('Failed to fetch GitHub stats:', error);
        throw this._mapError(error as { status?: number; message?: string });
      }),
    );
  }

  /**
   * Maps GraphQL response to GitHubStats interface.
   */
  private _mapToGitHubStats(user: GraphQLResponse['data']['user']): GitHubStats {
    const contributions = user.contributionsCollection;
    const totalCommits =
      contributions.totalCommitContributions + contributions.restrictedContributionsCount;

    // Calculate lines added/removed from PRs
    let totalLinesAdded = 0;
    let totalLinesRemoved = 0;

    user.pullRequests.nodes.forEach((pr) => {
      totalLinesAdded += pr.additions;
      totalLinesRemoved += pr.deletions;
    });

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
      totalLinesAdded,
      totalLinesRemoved,
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
