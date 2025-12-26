import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { DashboardMetrics, DashboardService } from '../services/dashboard.service';
import { DashboardStore } from './dashboard.store';

describe('DashboardStore', () => {
  let store: InstanceType<typeof DashboardStore>;

  const mockMetrics: DashboardMetrics = {
    testCoverage: { value: 95, trend: 'up', lastUpdated: '2024-01-01' },
    lighthouse: { performance: 100, accessibility: 100, bestPractices: 100, seo: 100 },
    buildStatus: 'passing',
    deployStatus: 'success',
    systemStatus: 'operational',
    activeModules: 5,
  };

  const mockService = {
    getMetrics: vi.fn(),
    getRealTimeVisitors: vi.fn(),
  };

  beforeEach(() => {
    mockService.getMetrics.mockReturnValue(of(mockMetrics));
    mockService.getRealTimeVisitors.mockReturnValue(of(42));

    TestBed.configureTestingModule({
      providers: [DashboardStore, { provide: DashboardService, useValue: mockService }],
    });

    store = TestBed.inject(DashboardStore);
  });

  it('should initialize with default state', () => {
    expect(store.metrics()).toBeNull();
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBeNull();
    expect(store.activeVisitors()).toBe(0);
  });

  describe('loadMetrics', () => {
    it('should set isLoading to true then load metrics on success', () => {
      // Create a subject or slightly delayed observable if we want to test intermediate state
      // But for rxMethod with immediate observable, it updates synchronously in tests often

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

  describe('loadVisitors', () => {
    it('should update activeVisitors', () => {
      store.loadVisitors();

      expect(mockService.getRealTimeVisitors).toHaveBeenCalled();
      expect(store.activeVisitors()).toBe(42);
    });
  });
});
