// @vitest-environment jsdom
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ENVIRONMENT } from '@core/config';
import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  let service: ProfileService;
  let httpMock: HttpTestingController;

  const mockGraphQLResponse = {
    data: {
      user: {
        login: 'testuser',
        name: 'Test User',
        avatarUrl: 'https://avatars.githubusercontent.com/u/12345',
        bio: 'A passionate developer',
        location: 'San Francisco, CA',
        company: '@TestOrg',
        email: 'test@example.com',
        websiteUrl: 'https://testuser.dev',
        url: 'https://github.com/testuser',
        createdAt: '2019-01-15T00:00:00Z',
        repositories: { totalCount: 52 },
        publicRepositories: { totalCount: 42 },
        privateRepositories: { totalCount: 10 },
        pullRequests: {
          totalCount: 85,
          pageInfo: {
            hasNextPage: false,
            endCursor: null,
          },
          nodes: [
            { additions: 100, deletions: 50 },
            { additions: 200, deletions: 100 },
          ],
        },
        contributionsCollection: {
          totalCommitContributions: 1000,
          restrictedContributionsCount: 250,
        },
      },
    },
  };

  const mockEnvironment = {
    appName: 'Test App',
    production: false,
    apiUrl: '/api',
    features: { mockAuth: true },
    analytics: { enabled: false, provider: 'console' as const },
    version: '1.0.0',
    github: {
      username: 'testuser',
      pat: 'ghp_test_token_12345',
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ProfileService,
        { provide: ENVIRONMENT, useValue: mockEnvironment },
      ],
    });

    service = TestBed.inject(ProfileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getGitHubStats', () => {
    it('should fetch GitHub stats and aggregate parallel search results', () => {
      // Mock User Response
      const mockUserResponse = {
        data: {
          user: {
            login: 'testuser',
            name: 'Test User',
            avatarUrl: 'https://avatars.githubusercontent.com/u/12345',
            bio: 'A passionate developer',
            location: 'San Francisco, CA',
            company: '@TestOrg',
            email: 'test@example.com',
            websiteUrl: 'https://testuser.dev',
            url: 'https://github.com/testuser',
            createdAt: new Date(new Date().getFullYear() - 1, 0, 1).toISOString(), // Created last year
            repositories: { totalCount: 52 },
            publicRepositories: { totalCount: 42 },
            privateRepositories: { totalCount: 10 },
            pullRequests: { totalCount: 85 },
            contributionsCollection: {
              totalCommitContributions: 1000,
              restrictedContributionsCount: 250,
            },
          },
        },
      };

      // Mock Search Responses for 2 years (Last Year and Current Year)
      const mockSearchResponseYear1 = {
        data: {
          search: {
            pageInfo: { hasNextPage: false, endCursor: null },
            nodes: [{ additions: 100, deletions: 50 }],
          },
        },
      };

      const mockSearchResponseYear2 = {
        data: {
          search: {
            pageInfo: { hasNextPage: false, endCursor: null },
            nodes: [{ additions: 200, deletions: 100 }],
          },
        },
      };

      service.getGitHubStats().subscribe((stats) => {
        expect(stats).not.toBeNull();
        expect(stats?.login).toBe('testuser');
        expect(stats?.pullRequests).toBe(85);
        expect(stats?.totalLinesAdded).toBe(300); // 100 + 200
        expect(stats?.totalLinesRemoved).toBe(150); // 50 + 100
      });

      // Expect User Query
      const reqUser = httpMock.expectOne('https://api.github.com/graphql');
      expect((reqUser.request.body as { query: string }).query).toContain('user(login: $login)');
      reqUser.flush(mockUserResponse);

      // Expect 2 Parallel Search Queries
      const reqs = httpMock.match((req) => {
        const body = req.body as { query: string } | undefined;
        return body?.query.includes('search(query: $query') === true;
      });
      expect(reqs.length).toBe(2);

      // We can't guarantee order of parallel requests, so we flush based on variables if needed,
      // or just flush generic responses if we don't strictly care which is which for this simple test.
      // But let's be precise.
      const year1 = new Date().getFullYear() - 1;
      const year2 = new Date().getFullYear();

      const reqYear1 = reqs.find((req) => {
        const body = req.request.body as { variables: { query: string } };
        return body.variables.query.includes(
          `created:${String(year1)}-01-01..${String(year1)}-12-31`,
        );
      });
      const reqYear2 = reqs.find((req) => {
        const body = req.request.body as { variables: { query: string } };
        return body.variables.query.includes(
          `created:${String(year2)}-01-01..${String(year2)}-12-31`,
        );
      });

      expect(reqYear1).toBeDefined();
      expect(reqYear2).toBeDefined();

      if (reqYear1) reqYear1.flush(mockSearchResponseYear1);
      if (reqYear2) reqYear2.flush(mockSearchResponseYear2);
    });

    it('should handle pagination within a year', () => {
      const mockUserResponse = {
        data: {
          user: {
            ...mockGraphQLResponse.data.user,
            createdAt: new Date().toISOString(), // Created this year, so only 1 range
          },
        },
      };

      const page1Response = {
        data: {
          search: {
            pageInfo: { hasNextPage: true, endCursor: 'cursor1' },
            nodes: [{ additions: 10, deletions: 5 }],
          },
        },
      };

      const page2Response = {
        data: {
          search: {
            pageInfo: { hasNextPage: false, endCursor: null },
            nodes: [{ additions: 20, deletions: 10 }],
          },
        },
      };

      service.getGitHubStats().subscribe((stats) => {
        expect(stats?.totalLinesAdded).toBe(30);
        expect(stats?.totalLinesRemoved).toBe(15);
      });

      const reqUser = httpMock.expectOne('https://api.github.com/graphql');
      reqUser.flush(mockUserResponse);

      // First page search request
      const reqSearch1 = httpMock.expectOne((req) => {
        const body = req.body as { query: string } | undefined;
        return body?.query.includes('search(') === true;
      });
      reqSearch1.flush(page1Response);

      // Second page search request (triggered by expand)
      const reqSearch2 = httpMock.expectOne((req) => {
        const body = req.body as { query: string; variables: { cursor: string } } | undefined;
        return body?.query.includes('search(') === true && body.variables.cursor === 'cursor1';
      });
      reqSearch2.flush(page2Response);
    });

    it('should handle GraphQL errors', () => {
      const errorResponse = {
        errors: [{ message: 'Could not resolve to a User' }],
      };

      service.getGitHubStats().subscribe({
        error: (error: Error) => {
          expect(error.message).toBe('Could not resolve to a User');
        },
      });

      const req = httpMock.expectOne('https://api.github.com/graphql');
      req.flush(errorResponse);
    });

    it('should handle rate limit error (403)', () => {
      service.getGitHubStats().subscribe({
        error: (error: Error) => {
          expect(error.message).toBe('GitHub API rate limit exceeded. Please try again later.');
        },
      });

      const req = httpMock.expectOne('https://api.github.com/graphql');
      req.flush({ message: 'Rate limit exceeded' }, { status: 403, statusText: 'Forbidden' });
    });

    it('should handle authentication error (401)', () => {
      service.getGitHubStats().subscribe({
        error: (error: Error) => {
          expect(error.message).toBe('GitHub authentication failed. Check your PAT configuration.');
        },
      });

      const req = httpMock.expectOne('https://api.github.com/graphql');
      req.flush({ message: 'Bad credentials' }, { status: 401, statusText: 'Unauthorized' });
    });

    it('should handle generic network errors', () => {
      service.getGitHubStats().subscribe({
        error: (error: Error) => {
          expect(error.message).toBe('Failed to fetch GitHub data. Please check your connection.');
        },
      });

      const req = httpMock.expectOne('https://api.github.com/graphql');
      req.flush(null, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('when username not configured', () => {
    beforeEach(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          ProfileService,
          {
            provide: ENVIRONMENT,
            useValue: {
              ...mockEnvironment,
              github: undefined,
            },
          },
        ],
      });

      service = TestBed.inject(ProfileService);
      httpMock = TestBed.inject(HttpTestingController);
    });

    it('should return null when username not configured', () => {
      service.getGitHubStats().subscribe((stats) => {
        expect(stats).toBeNull();
      });

      httpMock.expectNone('https://api.github.com/graphql');
    });
  });

  describe('when PAT not configured', () => {
    beforeEach(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          ProfileService,
          {
            provide: ENVIRONMENT,
            useValue: {
              ...mockEnvironment,
              github: {
                username: 'testuser',
                // No PAT
              },
            },
          },
        ],
      });

      service = TestBed.inject(ProfileService);
      httpMock = TestBed.inject(HttpTestingController);
    });

    it('should return null when PAT not configured', () => {
      service.getGitHubStats().subscribe((stats) => {
        expect(stats).toBeNull();
      });

      httpMock.expectNone('https://api.github.com/graphql');
    });
  });
});
