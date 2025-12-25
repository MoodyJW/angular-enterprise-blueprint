import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';

export interface DashboardMetrics {
  testCoverage: {
    value: number;
    trend: 'up' | 'down' | 'stable';
    lastUpdated: string;
  };
  lighthouse: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  buildStatus: 'passing' | 'failing' | 'building';
  deployStatus: 'success' | 'failed' | 'deploying';
  systemStatus: 'operational' | 'degraded' | 'outage';
  activeModules: number;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly _http = inject(HttpClient);

  getMetrics(): Observable<DashboardMetrics> {
    return this._http.get<DashboardMetrics>('assets/data/metrics.json');
  }

  /**
   * Simulates real-time visitor counts.
   * In a real app, this would use WebSockets or server-sent events.
   */
  getRealTimeVisitors(): Observable<number> {
    // Start with 42, update every 5 seconds
    return timer(0, 5000).pipe(map(() => Math.floor(Math.random() * (100 - 20 + 1)) + 20));
  }
}
