import {
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ENVIRONMENT } from '@core/config';
import { ErrorNotificationService } from '@core/error-handling';
import { LoggerService } from '@core/services/logger';
import type { AppEnvironment } from '@environments/environment.type';
import { httpErrorInterceptor } from './http-error.interceptor';

describe('httpErrorInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let errorNotificationService: ErrorNotificationService;
  let loggerService: LoggerService;
  let router: Router;

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
        provideHttpClient(withInterceptors([httpErrorInterceptor])),
        provideHttpClientTesting(),
        ErrorNotificationService,
        LoggerService,
        { provide: ENVIRONMENT, useValue: mockEnv },
        {
          provide: Router,
          useValue: {
            navigate: vi.fn().mockResolvedValue(true),
          },
        },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    errorNotificationService = TestBed.inject(ErrorNotificationService);
    loggerService = TestBed.inject(LoggerService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('error logging', () => {
    it('should log HTTP errors via LoggerService', () => {
      const logSpy = vi.spyOn(loggerService, 'error');

      httpClient.get('/api/test').subscribe({
        error: () => {
          // Expected error
        },
      });

      httpTestingController.expectOne('/api/test').flush('Server Error', {
        status: 500,
        statusText: 'Internal Server Error',
      });

      expect(logSpy).toHaveBeenCalledWith(
        '[HTTP Error] 500',
        expect.objectContaining({
          url: '/api/test',
        }),
      );
    });
  });

  describe('status code handling', () => {
    describe('400 Bad Request', () => {
      it('should show server message if available', () => {
        const notifySpy = vi.spyOn(errorNotificationService, 'notifyError');

        httpClient.get('/api/test').subscribe({
          error: () => {
            // Expected
          },
        });

        httpTestingController
          .expectOne('/api/test')
          .flush({ message: 'Invalid email format' }, { status: 400, statusText: 'Bad Request' });

        expect(notifySpy).toHaveBeenCalledWith('Invalid email format');
      });

      it('should show default message if no server message', () => {
        const notifySpy = vi.spyOn(errorNotificationService, 'notifyError');

        httpClient.get('/api/test').subscribe({
          error: () => {
            // Expected
          },
        });

        httpTestingController.expectOne('/api/test').flush(null, {
          status: 400,
          statusText: 'Bad Request',
        });

        expect(notifySpy).toHaveBeenCalledWith('Invalid request. Please check your input.');
      });
    });

    describe('401 Unauthorized', () => {
      it('should show warning notification', () => {
        const notifySpy = vi.spyOn(errorNotificationService, 'notifyWarning');

        httpClient.get('/api/test').subscribe({
          error: () => {
            // Expected
          },
        });

        httpTestingController.expectOne('/api/test').flush(null, {
          status: 401,
          statusText: 'Unauthorized',
        });

        expect(notifySpy).toHaveBeenCalledWith('Your session has expired. Please log in again.');
      });

      it('should navigate to login page', () => {
        httpClient.get('/api/test').subscribe({
          error: () => {
            // Expected
          },
        });

        httpTestingController.expectOne('/api/test').flush(null, {
          status: 401,
          statusText: 'Unauthorized',
        });

        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
      });
    });

    describe('403 Forbidden', () => {
      it('should show error notification', () => {
        const notifySpy = vi.spyOn(errorNotificationService, 'notifyError');

        httpClient.get('/api/test').subscribe({
          error: () => {
            // Expected
          },
        });

        httpTestingController.expectOne('/api/test').flush(null, {
          status: 403,
          statusText: 'Forbidden',
        });

        expect(notifySpy).toHaveBeenCalledWith(
          'You do not have permission to access this resource.',
        );
      });

      it('should navigate to forbidden page', () => {
        httpClient.get('/api/test').subscribe({
          error: () => {
            // Expected
          },
        });

        httpTestingController.expectOne('/api/test').flush(null, {
          status: 403,
          statusText: 'Forbidden',
        });

        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(router.navigate).toHaveBeenCalledWith(['/forbidden']);
      });
    });

    describe('404 Not Found', () => {
      it('should show not found notification', () => {
        const notifySpy = vi.spyOn(errorNotificationService, 'notifyError');

        httpClient.get('/api/test').subscribe({
          error: () => {
            // Expected
          },
        });

        httpTestingController.expectOne('/api/test').flush(null, {
          status: 404,
          statusText: 'Not Found',
        });

        expect(notifySpy).toHaveBeenCalledWith('The requested resource was not found.');
      });
    });

    describe('408 Request Timeout', () => {
      it('should show timeout warning', () => {
        const notifySpy = vi.spyOn(errorNotificationService, 'notifyWarning');

        httpClient.get('/api/test').subscribe({
          error: () => {
            // Expected
          },
        });

        httpTestingController.expectOne('/api/test').flush(null, {
          status: 408,
          statusText: 'Request Timeout',
        });

        expect(notifySpy).toHaveBeenCalledWith('The request timed out. Please try again.');
      });
    });

    describe('429 Too Many Requests', () => {
      it('should show rate limit warning', () => {
        const notifySpy = vi.spyOn(errorNotificationService, 'notifyWarning');

        httpClient.get('/api/test').subscribe({
          error: () => {
            // Expected
          },
        });

        httpTestingController.expectOne('/api/test').flush(null, {
          status: 429,
          statusText: 'Too Many Requests',
        });

        expect(notifySpy).toHaveBeenCalledWith('Too many requests. Please try again later.');
      });
    });

    describe('500 Internal Server Error', () => {
      it('should show server error notification', () => {
        const notifySpy = vi.spyOn(errorNotificationService, 'notifyError');

        httpClient.get('/api/test').subscribe({
          error: () => {
            // Expected
          },
        });

        httpTestingController.expectOne('/api/test').flush(null, {
          status: 500,
          statusText: 'Internal Server Error',
        });

        expect(notifySpy).toHaveBeenCalledWith(
          'A server error occurred. Our team has been notified.',
        );
      });
    });

    describe('502 Bad Gateway', () => {
      it('should show service unavailable notification', () => {
        const notifySpy = vi.spyOn(errorNotificationService, 'notifyError');

        httpClient.get('/api/test').subscribe({
          error: () => {
            // Expected
          },
        });

        httpTestingController.expectOne('/api/test').flush(null, {
          status: 502,
          statusText: 'Bad Gateway',
        });

        expect(notifySpy).toHaveBeenCalledWith(
          'The server is temporarily unavailable. Please try again later.',
        );
      });
    });

    describe('503 Service Unavailable', () => {
      it('should show service unavailable notification', () => {
        const notifySpy = vi.spyOn(errorNotificationService, 'notifyError');

        httpClient.get('/api/test').subscribe({
          error: () => {
            // Expected
          },
        });

        httpTestingController.expectOne('/api/test').flush(null, {
          status: 503,
          statusText: 'Service Unavailable',
        });

        expect(notifySpy).toHaveBeenCalledWith(
          'The service is temporarily unavailable. Please try again later.',
        );
      });
    });
  });

  describe('error message extraction', () => {
    it('should extract message from { message: string } format', () => {
      const notifySpy = vi.spyOn(errorNotificationService, 'notifyError');

      httpClient.get('/api/test').subscribe({
        error: () => {
          // Expected
        },
      });

      httpTestingController
        .expectOne('/api/test')
        .flush({ message: 'Email already exists' }, { status: 400, statusText: 'Bad Request' });

      expect(notifySpy).toHaveBeenCalledWith('Email already exists');
    });

    it('should extract message from { error: string } format', () => {
      const notifySpy = vi.spyOn(errorNotificationService, 'notifyError');

      httpClient.get('/api/test').subscribe({
        error: () => {
          // Expected
        },
      });

      httpTestingController
        .expectOne('/api/test')
        .flush({ error: 'Username taken' }, { status: 400, statusText: 'Bad Request' });

      expect(notifySpy).toHaveBeenCalledWith('Username taken');
    });

    it('should extract message from { error: { message: string } } format', () => {
      const notifySpy = vi.spyOn(errorNotificationService, 'notifyError');

      httpClient.get('/api/test').subscribe({
        error: () => {
          // Expected
        },
      });

      httpTestingController
        .expectOne('/api/test')
        .flush(
          { error: { message: 'Nested error message' } },
          { status: 400, statusText: 'Bad Request' },
        );

      expect(notifySpy).toHaveBeenCalledWith('Nested error message');
    });

    it('should extract message from plain string error', () => {
      const notifySpy = vi.spyOn(errorNotificationService, 'notifyError');

      httpClient.get('/api/test').subscribe({
        error: () => {
          // Expected
        },
      });

      httpTestingController.expectOne('/api/test').flush('Plain text error', {
        status: 400,
        statusText: 'Bad Request',
      });

      expect(notifySpy).toHaveBeenCalledWith('Plain text error');
    });

    it('should extract first message from { errors: string[] } format', () => {
      const notifySpy = vi.spyOn(errorNotificationService, 'notifyError');

      httpClient.get('/api/test').subscribe({
        error: () => {
          // Expected
        },
      });

      httpTestingController
        .expectOne('/api/test')
        .flush(
          { errors: ['First error', 'Second error'] },
          { status: 400, statusText: 'Bad Request' },
        );

      expect(notifySpy).toHaveBeenCalledWith('First error');
    });
  });

  describe('error re-throwing', () => {
    it('should re-throw the original error', () => {
      let thrownError: HttpErrorResponse | undefined;

      httpClient.get('/api/test').subscribe({
        error: (error: HttpErrorResponse) => {
          thrownError = error;
        },
      });

      httpTestingController.expectOne('/api/test').flush(null, {
        status: 500,
        statusText: 'Internal Server Error',
      });

      expect(thrownError).toBeDefined();
      if (thrownError !== undefined) {
        expect(thrownError.status).toBe(500);
      }
    });

    it('should preserve the original error body', () => {
      let thrownError: HttpErrorResponse | undefined;
      const errorBody = { message: 'Validation failed', errors: ['Field required'] };

      httpClient.get('/api/test').subscribe({
        error: (error: HttpErrorResponse) => {
          thrownError = error;
        },
      });

      httpTestingController.expectOne('/api/test').flush(errorBody, {
        status: 400,
        statusText: 'Bad Request',
      });

      expect(thrownError).toBeDefined();
      if (thrownError !== undefined) {
        expect(thrownError.error).toEqual(errorBody);
      }
    });
  });

  describe('successful requests', () => {
    it('should not intercept successful GET requests', () => {
      const logSpy = vi.spyOn(loggerService, 'error');

      httpClient.get('/api/test').subscribe({
        next: (response) => {
          expect(response).toEqual({ data: 'success' });
        },
      });

      httpTestingController.expectOne('/api/test').flush({ data: 'success' });

      expect(logSpy).not.toHaveBeenCalled();
    });

    it('should not intercept successful POST requests', () => {
      const logSpy = vi.spyOn(loggerService, 'error');

      httpClient.post('/api/test', { name: 'test' }).subscribe({
        next: (response) => {
          expect(response).toEqual({ id: 1 });
        },
      });

      httpTestingController.expectOne('/api/test').flush({ id: 1 });

      expect(logSpy).not.toHaveBeenCalled();
    });

    it('should not intercept 201 Created responses', () => {
      const logSpy = vi.spyOn(loggerService, 'error');

      httpClient.post('/api/test', { name: 'test' }).subscribe();

      httpTestingController
        .expectOne('/api/test')
        .flush({ id: 1 }, { status: 201, statusText: 'Created' });

      expect(logSpy).not.toHaveBeenCalled();
    });

    it('should not intercept 204 No Content responses', () => {
      const logSpy = vi.spyOn(loggerService, 'error');

      httpClient.delete('/api/test/1').subscribe();

      httpTestingController
        .expectOne('/api/test/1')
        .flush(null, { status: 204, statusText: 'No Content' });

      expect(logSpy).not.toHaveBeenCalled();
    });
  });

  describe('network errors (status 0)', () => {
    it('should handle network connectivity errors', () => {
      const notifySpy = vi.spyOn(errorNotificationService, 'notifyError');

      httpClient.get('/api/test').subscribe({
        error: () => {
          // Expected
        },
      });

      httpTestingController.expectOne('/api/test').error(new ProgressEvent('error'), {
        status: 0,
        statusText: 'Unknown Error',
      });

      expect(notifySpy).toHaveBeenCalledWith(
        'Unable to connect to server. Please check your internet connection.',
      );
    });

    it('should log network errors with status 0', () => {
      const logSpy = vi.spyOn(loggerService, 'error');

      httpClient.get('/api/test').subscribe({
        error: () => {
          // Expected
        },
      });

      httpTestingController.expectOne('/api/test').error(new ProgressEvent('error'), {
        status: 0,
        statusText: 'Unknown Error',
      });

      expect(logSpy).toHaveBeenCalledWith(
        '[HTTP Error] 0',
        expect.objectContaining({
          url: '/api/test',
        }),
      );
    });
  });

  describe('429 with Retry-After header', () => {
    it('should include retry time from Retry-After header', () => {
      const notifySpy = vi.spyOn(errorNotificationService, 'notifyWarning');

      httpClient.get('/api/test').subscribe({
        error: () => {
          // Expected
        },
      });

      const req = httpTestingController.expectOne('/api/test');
      req.flush(null, {
        status: 429,
        statusText: 'Too Many Requests',
        headers: { 'Retry-After': '60' },
      });

      expect(notifySpy).toHaveBeenCalledWith('Too many requests. Please wait 60 seconds.');
    });

    it('should use default message when Retry-After header is missing', () => {
      const notifySpy = vi.spyOn(errorNotificationService, 'notifyWarning');

      httpClient.get('/api/test').subscribe({
        error: () => {
          // Expected
        },
      });

      httpTestingController.expectOne('/api/test').flush(null, {
        status: 429,
        statusText: 'Too Many Requests',
      });

      expect(notifySpy).toHaveBeenCalledWith('Too many requests. Please try again later.');
    });
  });

  describe('other 4xx client errors', () => {
    it('should handle 405 Method Not Allowed', () => {
      const notifySpy = vi.spyOn(errorNotificationService, 'notifyError');

      httpClient.get('/api/test').subscribe({
        error: () => {
          // Expected
        },
      });

      httpTestingController.expectOne('/api/test').flush(null, {
        status: 405,
        statusText: 'Method Not Allowed',
      });

      // Falls through to default handler for other 4xx errors
      expect(notifySpy).toHaveBeenCalled();
    });

    it('should handle 409 Conflict with server message', () => {
      const notifySpy = vi.spyOn(errorNotificationService, 'notifyError');

      httpClient.get('/api/test').subscribe({
        error: () => {
          // Expected
        },
      });

      httpTestingController
        .expectOne('/api/test')
        .flush({ message: 'Resource already exists' }, { status: 409, statusText: 'Conflict' });

      expect(notifySpy).toHaveBeenCalledWith('Resource already exists');
    });

    it('should handle 422 Unprocessable Entity', () => {
      const notifySpy = vi.spyOn(errorNotificationService, 'notifyError');

      httpClient.get('/api/test').subscribe({
        error: () => {
          // Expected
        },
      });

      httpTestingController
        .expectOne('/api/test')
        .flush(
          { message: 'Validation failed' },
          { status: 422, statusText: 'Unprocessable Entity' },
        );

      expect(notifySpy).toHaveBeenCalledWith('Validation failed');
    });
  });

  describe('other 5xx server errors', () => {
    it('should handle 504 Gateway Timeout with specific message', () => {
      const notifySpy = vi.spyOn(errorNotificationService, 'notifyError');

      httpClient.get('/api/test').subscribe({
        error: () => {
          // Expected
        },
      });

      httpTestingController.expectOne('/api/test').flush(null, {
        status: 504,
        statusText: 'Gateway Timeout',
      });

      expect(notifySpy).toHaveBeenCalledWith(
        'The server took too long to respond. Please try again.',
      );
    });

    it('should handle 507 Insufficient Storage', () => {
      const notifySpy = vi.spyOn(errorNotificationService, 'notifyError');

      httpClient.get('/api/test').subscribe({
        error: () => {
          // Expected
        },
      });

      httpTestingController.expectOne('/api/test').flush(null, {
        status: 507,
        statusText: 'Insufficient Storage',
      });

      expect(notifySpy).toHaveBeenCalledWith(
        'A server error occurred. Our team has been notified.',
      );
    });
  });

  describe('error message extraction edge cases', () => {
    it('should extract message from { errors: [{ message: string }] } format', () => {
      const notifySpy = vi.spyOn(errorNotificationService, 'notifyError');

      httpClient.get('/api/test').subscribe({
        error: () => {
          // Expected
        },
      });

      httpTestingController
        .expectOne('/api/test')
        .flush(
          { errors: [{ message: 'First validation error' }, { message: 'Second error' }] },
          { status: 400, statusText: 'Bad Request' },
        );

      expect(notifySpy).toHaveBeenCalledWith('First validation error');
    });

    it('should handle empty errors array', () => {
      const notifySpy = vi.spyOn(errorNotificationService, 'notifyError');

      httpClient.get('/api/test').subscribe({
        error: () => {
          // Expected
        },
      });

      httpTestingController
        .expectOne('/api/test')
        .flush({ errors: [] }, { status: 400, statusText: 'Bad Request' });

      // Should use default message since no errors in array
      expect(notifySpy).toHaveBeenCalledWith('Invalid request. Please check your input.');
    });

    it('should handle null error body', () => {
      const notifySpy = vi.spyOn(errorNotificationService, 'notifyError');

      httpClient.get('/api/test').subscribe({
        error: () => {
          // Expected
        },
      });

      httpTestingController.expectOne('/api/test').flush(null, {
        status: 400,
        statusText: 'Bad Request',
      });

      expect(notifySpy).toHaveBeenCalledWith('Invalid request. Please check your input.');
    });

    it('should handle error body with non-string error property', () => {
      const notifySpy = vi.spyOn(errorNotificationService, 'notifyError');

      httpClient.get('/api/test').subscribe({
        error: () => {
          // Expected
        },
      });

      httpTestingController
        .expectOne('/api/test')
        .flush({ error: { code: 'ERR_001' } }, { status: 400, statusText: 'Bad Request' });

      // error.code exists but no message, should use default
      expect(notifySpy).toHaveBeenCalledWith('Invalid request. Please check your input.');
    });

    it('should handle deeply nested error responses', () => {
      const notifySpy = vi.spyOn(errorNotificationService, 'notifyError');

      httpClient.get('/api/test').subscribe({
        error: () => {
          // Expected
        },
      });

      httpTestingController
        .expectOne('/api/test')
        .flush(
          { error: { message: 'Nested error message', details: { field: 'email' } } },
          { status: 400, statusText: 'Bad Request' },
        );

      expect(notifySpy).toHaveBeenCalledWith('Nested error message');
    });
  });

  describe('logging details', () => {
    it('should include URL in log details', () => {
      const logSpy = vi.spyOn(loggerService, 'error');

      httpClient.get('/api/users/123').subscribe({
        error: () => {
          // Expected
        },
      });

      httpTestingController.expectOne('/api/users/123').flush(null, {
        status: 500,
        statusText: 'Internal Server Error',
      });

      expect(logSpy).toHaveBeenCalledWith(
        '[HTTP Error] 500',
        expect.objectContaining({
          url: '/api/users/123',
        }),
      );
    });

    it('should include server message in log details when available', () => {
      const logSpy = vi.spyOn(loggerService, 'error');

      httpClient.get('/api/test').subscribe({
        error: () => {
          // Expected
        },
      });

      httpTestingController
        .expectOne('/api/test')
        .flush(
          { message: 'Database connection failed' },
          { status: 500, statusText: 'Internal Server Error' },
        );

      expect(logSpy).toHaveBeenCalledWith(
        '[HTTP Error] 500',
        expect.objectContaining({
          serverMessage: 'Database connection failed',
        }),
      );
    });

    it('should log undefined serverMessage when not available', () => {
      const logSpy = vi.spyOn(loggerService, 'error');

      httpClient.get('/api/test').subscribe({
        error: () => {
          // Expected
        },
      });

      httpTestingController.expectOne('/api/test').flush(null, {
        status: 500,
        statusText: 'Internal Server Error',
      });

      expect(logSpy).toHaveBeenCalledWith(
        '[HTTP Error] 500',
        expect.objectContaining({
          serverMessage: undefined,
        }),
      );
    });
  });

  describe('HTTP methods', () => {
    it('should intercept errors from PUT requests', () => {
      const notifySpy = vi.spyOn(errorNotificationService, 'notifyError');

      httpClient.put('/api/test/1', { name: 'updated' }).subscribe({
        error: () => {
          // Expected
        },
      });

      httpTestingController.expectOne('/api/test/1').flush(null, {
        status: 500,
        statusText: 'Internal Server Error',
      });

      expect(notifySpy).toHaveBeenCalled();
    });

    it('should intercept errors from PATCH requests', () => {
      const notifySpy = vi.spyOn(errorNotificationService, 'notifyError');

      httpClient.patch('/api/test/1', { name: 'updated' }).subscribe({
        error: () => {
          // Expected
        },
      });

      httpTestingController.expectOne('/api/test/1').flush(null, {
        status: 500,
        statusText: 'Internal Server Error',
      });

      expect(notifySpy).toHaveBeenCalled();
    });

    it('should intercept errors from DELETE requests', () => {
      const notifySpy = vi.spyOn(errorNotificationService, 'notifyError');

      httpClient.delete('/api/test/1').subscribe({
        error: () => {
          // Expected
        },
      });

      httpTestingController.expectOne('/api/test/1').flush(null, {
        status: 500,
        statusText: 'Internal Server Error',
      });

      expect(notifySpy).toHaveBeenCalled();
    });
  });
});
