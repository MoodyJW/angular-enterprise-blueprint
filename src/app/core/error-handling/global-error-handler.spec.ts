import { NgZone } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ENVIRONMENT } from '@core/config';
import { LoggerService } from '@core/services/logger';
import type { AppEnvironment } from '@environments/environment.type';
import { ErrorNotificationService } from './error-notification.service';
import { GlobalErrorHandler } from './global-error-handler';

describe('GlobalErrorHandler', () => {
  let handler: GlobalErrorHandler;
  let loggerService: LoggerService;
  let errorNotificationService: ErrorNotificationService;

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
        GlobalErrorHandler,
        ErrorNotificationService,
        LoggerService,
        { provide: ENVIRONMENT, useValue: mockEnv },
      ],
    });

    handler = TestBed.inject(GlobalErrorHandler);
    loggerService = TestBed.inject(LoggerService);
    errorNotificationService = TestBed.inject(ErrorNotificationService);
  });

  describe('handleError', () => {
    describe('with Error objects', () => {
      it('should log standard Error objects', () => {
        const logSpy = vi.spyOn(loggerService, 'error');
        const error = new Error('Test error message');

        handler.handleError(error);

        expect(logSpy).toHaveBeenCalled();
        const firstCall = logSpy.mock.calls[0];
        expect(firstCall[0]).toContain('[GlobalErrorHandler] Test error message');
      });

      it('should include error code/name in log', () => {
        const logSpy = vi.spyOn(loggerService, 'error');
        const error = new TypeError('Type mismatch');

        handler.handleError(error);

        const firstCall = logSpy.mock.calls[0];
        expect(firstCall[1]).toEqual(
          expect.objectContaining({
            code: 'TypeError',
            severity: 'error',
          }),
        );
      });

      it('should log stack trace', () => {
        const logSpy = vi.spyOn(loggerService, 'error');
        const error = new Error('Error with stack');

        handler.handleError(error);

        // Should have multiple calls - one for error info, one for stack trace, one for user notification
        expect(logSpy.mock.calls.length).toBeGreaterThanOrEqual(2);
        // Find the stack trace log call
        const stackTraceCall = logSpy.mock.calls.find(
          (call) => typeof call[0] === 'string' && call[0].includes('Stack trace'),
        );
        expect(stackTraceCall).toBeDefined();
        if (stackTraceCall !== undefined) {
          expect(stackTraceCall[0]).toContain('[GlobalErrorHandler] Stack trace:');
        }
      });

      it('should notify user with generic message', () => {
        const notifySpy = vi.spyOn(errorNotificationService, 'notifyError');
        const error = new Error('Internal technical error');

        handler.handleError(error);

        expect(notifySpy).toHaveBeenCalledWith(
          'An unexpected error occurred. Please try again.',
          'Error',
        );
      });
    });

    describe('with string errors', () => {
      it('should handle string errors', () => {
        const logSpy = vi.spyOn(loggerService, 'error');

        handler.handleError('String error message');

        expect(logSpy).toHaveBeenCalled();
        const firstCall = logSpy.mock.calls[0];
        expect(firstCall[0]).toContain('[GlobalErrorHandler] String error message');
      });

      it('should notify user for string errors', () => {
        const notifySpy = vi.spyOn(errorNotificationService, 'notifyError');

        handler.handleError('Something broke');

        expect(notifySpy).toHaveBeenCalledWith(
          'An unexpected error occurred. Please try again.',
          undefined,
        );
      });
    });

    describe('with error-like objects', () => {
      it('should handle objects with message property', () => {
        const logSpy = vi.spyOn(loggerService, 'error');
        const errorLike = { message: 'Custom error object' };

        handler.handleError(errorLike);

        expect(logSpy).toHaveBeenCalled();
        const firstCall = logSpy.mock.calls[0];
        expect(firstCall[0]).toContain('[GlobalErrorHandler] Custom error object');
      });

      it('should include name if present', () => {
        const logSpy = vi.spyOn(loggerService, 'error');
        const errorLike = { message: 'Custom error', name: 'CustomError' };

        handler.handleError(errorLike);

        const firstCall = logSpy.mock.calls[0];
        expect(firstCall[1]).toEqual(
          expect.objectContaining({
            code: 'CustomError',
          }),
        );
      });
    });

    describe('with unknown error types', () => {
      it('should handle null errors', () => {
        const logSpy = vi.spyOn(loggerService, 'error');

        handler.handleError(null);

        expect(logSpy).toHaveBeenCalled();
        const firstCall = logSpy.mock.calls[0];
        expect(firstCall[0]).toContain('[GlobalErrorHandler] An unknown error occurred');
      });

      it('should handle undefined errors', () => {
        const logSpy = vi.spyOn(loggerService, 'error');

        handler.handleError(undefined);

        expect(logSpy).toHaveBeenCalled();
      });

      it('should handle number errors', () => {
        const logSpy = vi.spyOn(loggerService, 'error');

        handler.handleError(42);

        expect(logSpy).toHaveBeenCalled();
      });

      it('should handle object without message property', () => {
        const logSpy = vi.spyOn(loggerService, 'error');

        handler.handleError({ code: 'ERR', data: 123 });

        expect(logSpy).toHaveBeenCalled();
        const firstCall = logSpy.mock.calls[0];
        expect(firstCall[0]).toContain('[GlobalErrorHandler] An unknown error occurred');
      });
    });

    describe('NgZone handling', () => {
      it('should run error handling outside Angular zone', () => {
        const ngZone = TestBed.inject(NgZone);
        const runOutsideSpy = vi.spyOn(ngZone, 'runOutsideAngular');

        handler.handleError(new Error('Test'));

        expect(runOutsideSpy).toHaveBeenCalled();
      });

      it('should notify user inside Angular zone', () => {
        const ngZone = TestBed.inject(NgZone);
        const runSpy = vi.spyOn(ngZone, 'run');

        handler.handleError(new Error('Test'));

        expect(runSpy).toHaveBeenCalled();
      });
    });

    describe('error normalization', () => {
      it('should include timestamp in normalized error', () => {
        const logSpy = vi.spyOn(loggerService, 'error');
        const beforeTime = new Date();

        handler.handleError(new Error('Test'));

        const firstCall = logSpy.mock.calls[0];
        const errorInfo = firstCall[1] as Record<string, unknown>;
        const timestamp = new Date(errorInfo['timestamp'] as string);

        expect(timestamp.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
      });

      it('should set severity to error by default', () => {
        const logSpy = vi.spyOn(loggerService, 'error');

        handler.handleError(new Error('Test'));

        const firstCall = logSpy.mock.calls[0];
        const errorInfo = firstCall[1] as Record<string, unknown>;
        expect(errorInfo['severity']).toBe('error');
      });
    });

    describe('with Error.cause (ES2022+)', () => {
      it('should include string cause in context', () => {
        const logSpy = vi.spyOn(loggerService, 'error');
        const error = new Error('Wrapper error', { cause: 'Original cause' });

        handler.handleError(error);

        const firstCall = logSpy.mock.calls[0];
        const errorInfo = firstCall[1] as Record<string, unknown>;
        expect(errorInfo['cause']).toBe('Original cause');
      });

      it('should JSON stringify object cause', () => {
        const logSpy = vi.spyOn(loggerService, 'error');
        const originalCause = { code: 'ERR_001', details: 'Some details' };
        const error = new Error('Wrapper error', { cause: originalCause });

        handler.handleError(error);

        const firstCall = logSpy.mock.calls[0];
        const errorInfo = firstCall[1] as Record<string, unknown>;
        expect(errorInfo['cause']).toBe(JSON.stringify(originalCause));
      });

      it('should handle errors without cause', () => {
        const logSpy = vi.spyOn(loggerService, 'error');
        const error = new Error('Error without cause');

        handler.handleError(error);

        const firstCall = logSpy.mock.calls[0];
        const errorInfo = firstCall[1] as Record<string, unknown>;
        expect(errorInfo['cause']).toBeUndefined();
      });
    });

    describe('user-friendly messages', () => {
      it('should not expose technical error messages to users', () => {
        const notifySpy = vi.spyOn(errorNotificationService, 'notifyError');
        const error = new Error('TypeError: Cannot read property x of undefined');

        handler.handleError(error);

        // User should see generic message, not technical details
        expect(notifySpy).toHaveBeenCalledWith(
          'An unexpected error occurred. Please try again.',
          'Error',
        );
      });

      it('should pass error code to notification service', () => {
        const notifySpy = vi.spyOn(errorNotificationService, 'notifyError');
        const error = new RangeError('Index out of bounds');

        handler.handleError(error);

        expect(notifySpy).toHaveBeenCalledWith(
          'An unexpected error occurred. Please try again.',
          'RangeError',
        );
      });
    });

    describe('multiple errors in sequence', () => {
      it('should handle multiple errors independently', () => {
        const logSpy = vi.spyOn(loggerService, 'error');

        handler.handleError(new Error('First error'));
        handler.handleError(new Error('Second error'));
        handler.handleError(new TypeError('Third error'));

        // Should have logged each error
        const errorCalls = logSpy.mock.calls.filter(
          (call) => typeof call[0] === 'string' && call[0].includes('[GlobalErrorHandler]'),
        );
        expect(errorCalls.length).toBeGreaterThanOrEqual(3);
      });
    });

    describe('edge cases', () => {
      it('should handle Error with empty message', () => {
        const logSpy = vi.spyOn(loggerService, 'error');
        const error = new Error('');

        handler.handleError(error);

        expect(logSpy).toHaveBeenCalled();
        const firstCall = logSpy.mock.calls[0];
        expect(firstCall[0]).toContain('[GlobalErrorHandler]');
      });

      it('should handle boolean errors', () => {
        const logSpy = vi.spyOn(loggerService, 'error');

        handler.handleError(false);

        expect(logSpy).toHaveBeenCalled();
        const firstCall = logSpy.mock.calls[0];
        expect(firstCall[0]).toContain('[GlobalErrorHandler] An unknown error occurred');
      });

      it('should handle array errors', () => {
        const logSpy = vi.spyOn(loggerService, 'error');

        handler.handleError(['error1', 'error2']);

        expect(logSpy).toHaveBeenCalled();
      });

      it('should handle object with non-string message property', () => {
        const logSpy = vi.spyOn(loggerService, 'error');
        const errorLike = { message: 123 };

        handler.handleError(errorLike);

        expect(logSpy).toHaveBeenCalled();
        const firstCall = logSpy.mock.calls[0];
        // Should fall through to unknown error handler since message is not a string
        expect(firstCall[0]).toContain('[GlobalErrorHandler] An unknown error occurred');
      });

      it('should handle deeply nested error objects', () => {
        const logSpy = vi.spyOn(loggerService, 'error');
        const errorLike = {
          message: 'Nested error',
          nested: { deeper: { value: 'test' } },
        };

        handler.handleError(errorLike);

        expect(logSpy).toHaveBeenCalled();
        const firstCall = logSpy.mock.calls[0];
        expect(firstCall[0]).toContain('[GlobalErrorHandler] Nested error');
      });
    });
  });
});
