import { TestBed } from '@angular/core/testing';
import {
  DashboardMetrics,
  DashboardService,
  ExtendedMetrics,
} from '@features/home/services/dashboard.service';
import { of, throwError } from 'rxjs';
import { DashboardStore } from './dashboard.store';

describe('DashboardStore', () => {
  let store: InstanceType<typeof DashboardStore>;

  const mockExtendedMetrics: ExtendedMetrics = {
    testCoverage: { available: true, value: 95 },
    documentation: { available: true, percentage: 80 },
    git: { available: true, commits: 100 },
    linting: { available: true, errors: 0, warnings: 0 },
    dependencies: { available: true, total: 50, outdated: 5 },
    bundleSize: { available: false, message: 'Not built' },
    lighthouse: { available: true, performance: 90 },
  };

  const mockMetrics: DashboardMetrics = {
    generatedAt: '2024-01-01T00:00:00.000Z',
    testCoverage: { value: 95, trend: 'up', lastUpdated: '2024-01-01' },
    lighthouse: { performance: 100, accessibility: 100, bestPractices: 100, seo: 100 },
    buildStatus: 'passing',
    deployStatus: 'success',
    systemStatus: 'operational',
    activeModules: 5,
    extended: mockExtendedMetrics,
  };

  const mockService = {
    getMetrics: vi.fn(),
    getExtendedMetrics: vi.fn(),
  };

  beforeEach(() => {
    mockService.getMetrics.mockReturnValue(of(mockMetrics));
    mockService.getExtendedMetrics.mockReturnValue(of(mockExtendedMetrics));

    TestBed.configureTestingModule({
      providers: [DashboardStore, { provide: DashboardService, useValue: mockService }],
    });

    store = TestBed.inject(DashboardStore);
  });

  it('should initialize with default state', () => {
    expect(store.metrics()).toBeNull();
    expect(store.extendedMetrics()).toBeNull();
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  describe('loadMetrics', () => {
    it('should set isLoading to true then load metrics on success', () => {
      store.loadMetrics();

      expect(mockService.getMetrics).toHaveBeenCalled();
      expect(store.metrics()).toEqual(mockMetrics);
      expect(store.isLoading()).toBe(false);
      expect(store.error()).toBeNull();
    });

    it('should set error state on failure', () => {
      const errorMsg = 'Network error';
      mockService.getMetrics.mockReturnValue(throwError(() => new Error(errorMsg)));

      store.loadMetrics();

      expect(store.metrics()).toBeNull();
      expect(store.isLoading()).toBe(false);
      expect(store.error()).toBe(errorMsg);
    });

    it('should use default error message when error has no message', () => {
      mockService.getMetrics.mockReturnValue(throwError(() => new Error('')));

      store.loadMetrics();

      expect(store.isLoading()).toBe(false);
      expect(store.error()).toBe('Failed to load dashboard metrics');
    });
  });

  describe('loadExtendedMetrics', () => {
    it('should load extended metrics on success', () => {
      store.loadExtendedMetrics();

      expect(mockService.getExtendedMetrics).toHaveBeenCalled();
      expect(store.extendedMetrics()).toEqual(mockExtendedMetrics);
    });

    it('should silently fail without setting error state', () => {
      mockService.getExtendedMetrics.mockReturnValue(throwError(() => new Error('Failed')));

      store.loadExtendedMetrics();

      expect(store.extendedMetrics()).toBeNull();
      expect(store.error()).toBeNull(); // Should not set error
    });
  });
});
