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
    it('should fetch GitHub stats via GraphQL successfully', () => {
      service.getGitHubStats().subscribe((stats) => {
        expect(stats).not.toBeNull();
        expect(stats?.login).toBe('testuser');
        expect(stats?.name).toBe('Test User');
        expect(stats?.avatarUrl).toBe('https://avatars.githubusercontent.com/u/12345');
        expect(stats?.htmlUrl).toBe('https://github.com/testuser');
        expect(stats?.createdAt).toBe('2019-01-15T00:00:00Z');
        expect(stats?.totalRepos).toBe(52);
        expect(stats?.pullRequests).toBe(85);
        expect(stats?.totalCommits).toBe(1250); // 1000 + 250
        expect(stats?.company).toBe('@TestOrg');
      });

      const req = httpMock.expectOne('https://api.github.com/graphql');
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe('Bearer ghp_test_token_12345');
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush(mockGraphQLResponse);
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
