import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { DashboardMetrics, DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  let service: DashboardService;
  let httpMock: HttpTestingController;

  const mockMetrics: DashboardMetrics = {
    testCoverage: { value: 95, trend: 'up', lastUpdated: '2024-01-01' },
    lighthouse: { performance: 100, accessibility: 100, bestPractices: 100, seo: 100 },
    buildStatus: 'passing',
    deployStatus: 'success',
    systemStatus: 'operational',
    activeModules: 5,
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

  describe('getRealTimeVisitors', () => {
    it('should emit a random visitor count', async () => {
      // Since it uses a timer, we might just check the first emission
      const count = await firstValueFrom(service.getRealTimeVisitors());
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(20);
      expect(count).toBeLessThanOrEqual(100);
    });
  });
});
