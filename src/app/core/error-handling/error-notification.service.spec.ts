import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { AppEnvironment } from '@environments/environment.type';
import { ENVIRONMENT } from '../config';
import { LoggerService } from '../services/logger';
import { ErrorNotificationService } from './error-notification.service';

describe('ErrorNotificationService', () => {
  let service: ErrorNotificationService;
  let loggerService: LoggerService;

  const mockEnv: AppEnvironment = {
    appName: 'Test App',
    production: false,
    apiUrl: '/api',
    features: { mockAuth: true },
    analytics: { enabled: false, provider: 'console' },
    version: '1.0.0',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ErrorNotificationService,
        LoggerService,
        { provide: ENVIRONMENT, useValue: mockEnv },
      ],
    });

    service = TestBed.inject(ErrorNotificationService);
    loggerService = TestBed.inject(LoggerService);
  });

  describe('notifyError', () => {
    it('should log error message via LoggerService', () => {
      const errorSpy = vi.spyOn(loggerService, 'error');

      service.notifyError('Something went wrong');

      expect(errorSpy).toHaveBeenCalledWith('[User Notification] Something went wrong');
    });

    it('should include details in error message when provided', () => {
      const errorSpy = vi.spyOn(loggerService, 'error');

      service.notifyError('Operation failed', 'ERR_001');

      expect(errorSpy).toHaveBeenCalledWith('[User Notification] Operation failed (ERR_001)');
    });
  });

  describe('notifyWarning', () => {
    it('should log warning message via LoggerService', () => {
      const warnSpy = vi.spyOn(loggerService, 'warn');

      service.notifyWarning('Session expiring soon');

      expect(warnSpy).toHaveBeenCalledWith('[User Notification] Session expiring soon');
    });

    it('should include details in warning message when provided', () => {
      const warnSpy = vi.spyOn(loggerService, 'warn');

      service.notifyWarning('Rate limit approaching', '80% used');

      expect(warnSpy).toHaveBeenCalledWith('[User Notification] Rate limit approaching (80% used)');
    });
  });

  describe('notifySuccess', () => {
    it('should log success message via LoggerService', () => {
      const infoSpy = vi.spyOn(loggerService, 'info');

      service.notifySuccess('Changes saved successfully');

      expect(infoSpy).toHaveBeenCalledWith('[User Notification] Changes saved successfully');
    });
  });

  describe('notifyInfo', () => {
    it('should log info message via LoggerService', () => {
      const infoSpy = vi.spyOn(loggerService, 'info');

      service.notifyInfo('New updates available');

      expect(infoSpy).toHaveBeenCalledWith('[User Notification] New updates available');
    });
  });
});
