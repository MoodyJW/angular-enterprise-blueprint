import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Core dashboard metrics displayed at a glance.
 */
export interface DashboardMetrics {
  generatedAt: string;
  testCoverage: {
    value: number;
    trend: 'up' | 'down' | 'stable';
    lastUpdated: string;
    details?: {
      statements: { pct: number; covered: number; total: number };
      branches: { pct: number; covered: number; total: number };
      functions: { pct: number; covered: number; total: number };
      lines: { pct: number; covered: number; total: number };
    };
  };
  lighthouse: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  buildStatus: 'passing' | 'failing' | 'building';
  deployStatus: 'success' | 'failed' | 'deploying' | 'pending';
  systemStatus: 'operational' | 'degraded' | 'outage';
  activeModules: number;
  extended: ExtendedMetrics;
}

/**
 * Extended metrics for detailed dashboard display.
 */
export interface ExtendedMetrics {
  testCoverage: {
    available: boolean;
    message?: string;
    value?: number;
    trend?: string;
    lastUpdated?: string;
    details?: {
      statements: { pct: number; covered: number; total: number };
      branches: { pct: number; covered: number; total: number };
      functions: { pct: number; covered: number; total: number };
      lines: { pct: number; covered: number; total: number };
    };
  };
  documentation: {
    available: boolean;
    message?: string;
    percentage?: number;
    components?: { documented: number; total: number };
    services?: { documented: number; total: number };
    directives?: { documented: number; total: number };
    pipes?: { documented: number; total: number };
  };
  git: {
    available: boolean;
    message?: string;
    commits?: number;
    lastCommit?: string;
    branches?: number;
    contributors?: number;
  };
  linting: {
    available: boolean;
    message?: string;
    errors?: number;
    warnings?: number;
  };
  dependencies: {
    available: boolean;
    message?: string;
    production?: number;
    development?: number;
    total?: number;
    outdated?: number;
    vulnerabilities?: {
      info?: number;
      low?: number;
      moderate?: number;
      high?: number;
      critical?: number;
      total?: number;
    };
  };
  bundleSize: {
    available: boolean;
    message?: string;
    main?: { raw: number; formatted: string };
    total?: { raw: number; formatted: string };
  };
  lighthouse?: {
    available: boolean;
    message?: string;
    performance?: number;
    accessibility?: number;
    bestPractices?: number;
    seo?: number;
  };
}

/**
 * Service to manage dashboard state and metrics.
 * Fetches data for project health, including test coverage and build status.
 */
@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly _http = inject(HttpClient);

  /**
   * Fetches unified metrics from the single metrics.json file.
   */
  getMetrics(): Observable<DashboardMetrics> {
    return this._http.get<DashboardMetrics>('assets/data/metrics.json');
  }

  /**
   * Fetches just the extended metrics portion.
   */
  getExtendedMetrics(): Observable<ExtendedMetrics> {
    return this._http
      .get<DashboardMetrics>('assets/data/metrics.json')
      .pipe(map((metrics) => metrics.extended));
  }
}
