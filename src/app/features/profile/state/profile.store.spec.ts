// @vitest-environment jsdom
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ENVIRONMENT } from '../../../core/config/environment.token';
import { GitHubStats } from '../models/github-stats.interface';
import { ProfileService } from '../services/profile.service';
import { ProfileStore } from './profile.store';

describe('ProfileStore', () => {
  let store: InstanceType<typeof ProfileStore>;
  let profileService: ProfileService;

  const mockStats: GitHubStats = {
    login: 'testuser',
    name: 'Test User',
    avatarUrl: 'https://avatars.githubusercontent.com/u/12345',
    location: 'San Francisco, CA',
    company: '@TestOrg',
    email: 'test@example.com',
    htmlUrl: 'https://github.com/testuser',
    createdAt: '2019-01-15T00:00:00Z',
    totalRepos: 52,
    totalCommits: 1250,
    pullRequests: 85,
    totalLinesAdded: 5000,
    totalLinesRemoved: 2000,
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
      pat: 'test-pat-token',
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ProfileStore,
        ProfileService,
        { provide: ENVIRONMENT, useValue: mockEnvironment },
      ],
    });

    store = TestBed.inject(ProfileStore);
    profileService = TestBed.inject(ProfileService);
  });

  describe('initial state', () => {
    it('should have null stats', () => {
      expect(store.stats()).toBeNull();
    });

    it('should not be loading', () => {
      expect(store.isLoading()).toBe(false);
    });

    it('should have no error', () => {
      expect(store.error()).toBeNull();
    });

    it('should have null lastFetched', () => {
      expect(store.lastFetched()).toBeNull();
    });

    it('should indicate refresh is needed', () => {
      expect(store.shouldRefresh()).toBe(true);
    });

    it('should not have stats', () => {
      expect(store.hasStats()).toBe(false);
    });
  });

  describe('loadGitHubStats', () => {
    it('should load stats successfully', () => {
      vi.spyOn(profileService, 'getGitHubStats').mockReturnValue(of(mockStats));

      store.loadGitHubStats();

      expect(store.stats()).toEqual(mockStats);
      expect(store.isLoading()).toBe(false);
      expect(store.error()).toBeNull();
      expect(store.lastFetched()).not.toBeNull();
      expect(store.hasStats()).toBe(true);
    });

    it('should handle errors', () => {
      const errorMessage = 'GitHub API rate limit exceeded';
      vi.spyOn(profileService, 'getGitHubStats').mockReturnValue(
        throwError(() => new Error(errorMessage)),
      );

      store.loadGitHubStats();

      expect(store.stats()).toBeNull();
      expect(store.isLoading()).toBe(false);
      expect(store.error()).toBe(errorMessage);
    });

    it('should use cache when data is fresh', () => {
      const spy = vi.spyOn(profileService, 'getGitHubStats').mockReturnValue(of(mockStats));

      // First load
      store.loadGitHubStats();
      expect(spy).toHaveBeenCalledTimes(1);

      // Second load should use cache
      store.loadGitHubStats();
      expect(spy).toHaveBeenCalledTimes(1); // Still just once
    });
  });

  describe('refreshStats', () => {
    it('should refresh stats from API', () => {
      const spy = vi.spyOn(profileService, 'getGitHubStats').mockReturnValue(of(mockStats));

      store.refreshStats();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(store.stats()).toEqual(mockStats);
    });

    it('should bypass cache when refreshing', () => {
      const spy = vi.spyOn(profileService, 'getGitHubStats').mockReturnValue(of(mockStats));

      // First load
      store.loadGitHubStats();
      expect(spy).toHaveBeenCalledTimes(1);

      // Refresh should call API again
      store.refreshStats();
      expect(spy).toHaveBeenCalledTimes(2);
    });

    it('should handle errors on refresh', () => {
      // First load successfully
      vi.spyOn(profileService, 'getGitHubStats').mockReturnValue(of(mockStats));
      store.loadGitHubStats();
      expect(store.hasStats()).toBe(true);

      // Then fail on refresh
      const errorMessage = 'Network error';
      vi.spyOn(profileService, 'getGitHubStats').mockReturnValue(
        throwError(() => new Error(errorMessage)),
      );

      store.refreshStats();

      // Original stats should still be there, but error should be set
      expect(store.error()).toBe(errorMessage);
      expect(store.isLoading()).toBe(false);
    });
  });

  describe('clearCache', () => {
    it('should reset to initial state', () => {
      vi.spyOn(profileService, 'getGitHubStats').mockReturnValue(of(mockStats));

      store.loadGitHubStats();
      expect(store.hasStats()).toBe(true);

      store.clearCache();

      expect(store.stats()).toBeNull();
      expect(store.lastFetched()).toBeNull();
      expect(store.error()).toBeNull();
      expect(store.isLoading()).toBe(false);
    });
  });

  describe('shouldRefresh computed', () => {
    it('should return true when never fetched', () => {
      expect(store.shouldRefresh()).toBe(true);
    });

    it('should return false immediately after fetching', () => {
      vi.spyOn(profileService, 'getGitHubStats').mockReturnValue(of(mockStats));

      store.loadGitHubStats();

      expect(store.shouldRefresh()).toBe(false);
    });
  });
});
