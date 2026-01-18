import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DashboardMetrics, DashboardService, ExtendedMetrics } from './dashboard.service';

describe('DashboardService', () => {
  let service: DashboardService;
  let httpMock: HttpTestingController;

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), DashboardService],
    });
    service = TestBed.inject(DashboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getMetrics', () => {
    it('should fetch metrics from assets/data/metrics.json', () => {
      service.getMetrics().subscribe((metrics) => {
        expect(metrics).toEqual(mockMetrics);
      });

      const req = httpMock.expectOne('assets/data/metrics.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockMetrics);
    });
  });

  describe('getExtendedMetrics', () => {
    it('should extract extended metrics from unified metrics.json', () => {
      service.getExtendedMetrics().subscribe((metrics) => {
        expect(metrics).toEqual(mockExtendedMetrics);
      });

      const req = httpMock.expectOne('assets/data/metrics.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockMetrics);
    });
  });
});
