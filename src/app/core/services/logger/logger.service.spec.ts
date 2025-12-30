/* eslint-disable no-console -- Testing console behavior for LoggerService */
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ENVIRONMENT } from '@core/config';
import type { AppEnvironment } from '@environments/environment.type';
import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let service: LoggerService;

  const createService = (env: Partial<AppEnvironment>): LoggerService => {
    const mockEnv: AppEnvironment = {
      appName: 'Test App',
      production: false,
      apiUrl: '/api',
      features: { mockAuth: true },
      analytics: { enabled: false, provider: 'console' },
      version: '1.0.0',
      ...env,
    };

    TestBed.configureTestingModule({
      providers: [{ provide: ENVIRONMENT, useValue: mockEnv }],
    });

    return TestBed.inject(LoggerService);
  };

  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
    vi.spyOn(console, 'info').mockImplementation(() => undefined);
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    TestBed.resetTestingModule();
  });

  describe('in development mode', () => {
    beforeEach(() => {
      service = createService({ production: false });
    });

    it('should call console.log when log() is called', () => {
      service.log('test message');

      expect(console.log).toHaveBeenCalledWith('test message');
    });

    it('should call console.log with additional parameters', () => {
      const data = { id: 1, name: 'test' };
      service.log('test message', data);

      expect(console.log).toHaveBeenCalledWith('test message', data);
    });

    it('should call console.info when info() is called', () => {
      service.info('info message');

      expect(console.info).toHaveBeenCalledWith('info message');
    });

    it('should call console.info with additional parameters', () => {
      service.info('info message', 'extra', 123);

      expect(console.info).toHaveBeenCalledWith('info message', 'extra', 123);
    });

    it('should call console.warn when warn() is called', () => {
      service.warn('warning message');

      expect(console.warn).toHaveBeenCalledWith('warning message');
    });

    it('should call console.warn with additional parameters', () => {
      const error = new Error('test');
      service.warn('warning message', error);

      expect(console.warn).toHaveBeenCalledWith('warning message', error);
    });

    it('should call console.error when error() is called', () => {
      service.error('error message');

      expect(console.error).toHaveBeenCalledWith('error message');
    });

    it('should call console.error with additional parameters', () => {
      const error = new Error('Something went wrong');
      service.error('error message', error, { context: 'test' });

      expect(console.error).toHaveBeenCalledWith('error message', error, { context: 'test' });
    });
  });

  describe('in production mode', () => {
    beforeEach(() => {
      service = createService({ production: true });
    });

    it('should NOT call console.log when log() is called', () => {
      service.log('test message');

      expect(console.log).not.toHaveBeenCalled();
    });

    it('should NOT call console.info when info() is called', () => {
      service.info('info message');

      expect(console.info).not.toHaveBeenCalled();
    });

    it('should still call console.warn when warn() is called', () => {
      service.warn('warning message');

      expect(console.warn).toHaveBeenCalledWith('warning message');
    });

    it('should still call console.error when error() is called', () => {
      service.error('error message');

      expect(console.error).toHaveBeenCalledWith('error message');
    });

    it('should still pass additional parameters to warn()', () => {
      service.warn('warning', { detail: 'important' });

      expect(console.warn).toHaveBeenCalledWith('warning', { detail: 'important' });
    });

    it('should still pass additional parameters to error()', () => {
      const err = new Error('Critical');
      service.error('error', err);

      expect(console.error).toHaveBeenCalledWith('error', err);
    });
  });

  describe('service instantiation', () => {
    it('should be provided in root', () => {
      service = createService({});

      expect(service).toBeTruthy();
    });
  });
});
