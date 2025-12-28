import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AppEnvironment } from '../../../../environments/environment.type';
import { ENVIRONMENT } from '../../../core/config/environment.token';
import { ContactService } from './contact.service';

describe('ContactService', () => {
  let service: ContactService;
  let httpMock: HttpTestingController;

  const mockEnvironment: AppEnvironment = {
    appName: 'Test App',
    production: false,
    apiUrl: '/api',
    features: { mockAuth: true },
    analytics: { enabled: false, provider: 'console' },
    version: '1.0.0',
    formspreeEndpoint: 'https://formspree.io/f/test-id',
  };

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ENVIRONMENT, useValue: mockEnvironment },
      ],
    });

    service = TestBed.inject(ContactService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should send contact message to formspree endpoint', () => {
    const formData = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'Hello World',
    };

    service.sendContactMessage(formData).subscribe();

    const req = httpMock.expectOne('https://formspree.io/f/test-id');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(formData);
    req.flush({});
  });

  it('should enforce rate limiting', () => {
    const formData = {
      name: 'Test',
      email: 'test@example.com',
      message: 'Msg',
    };

    // First request
    service.sendContactMessage(formData).subscribe();
    const req = httpMock.expectOne('https://formspree.io/f/test-id');
    req.flush({});

    // Second request immediately after
    service.sendContactMessage(formData).subscribe({
      error: (err: Error) => {
        expect(err.message).toContain('Please wait');
      },
    });

    httpMock.expectNone('https://formspree.io/f/test-id');
  });

  it('should allow request after cooldown', () => {
    const formData = {
      name: 'Test',
      email: 'test@example.com',
      message: 'Msg',
    };

    // Mock Date.now
    const now = Date.now();
    vi.spyOn(Date, 'now').mockReturnValue(now);

    // First request
    service.sendContactMessage(formData).subscribe();
    httpMock.expectOne('https://formspree.io/f/test-id').flush({});

    // Advance time by 31 seconds
    vi.spyOn(Date, 'now').mockReturnValue(now + 31000);

    // Second request should succeed
    service.sendContactMessage(formData).subscribe();
    httpMock.expectOne('https://formspree.io/f/test-id').flush({});
  });

  it('should include Accept header in request', () => {
    const formData = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'Hello',
    };

    service.sendContactMessage(formData).subscribe();

    const req = httpMock.expectOne('https://formspree.io/f/test-id');
    expect(req.request.headers.get('Accept')).toBe('application/json');
    req.flush({});
  });

  it('should include optional company field in request', () => {
    const formData = {
      name: 'Test User',
      email: 'test@example.com',
      company: 'Test Company',
      message: 'Hello',
    };

    service.sendContactMessage(formData).subscribe();

    const req = httpMock.expectOne('https://formspree.io/f/test-id');
    expect(req.request.body).toEqual(formData);
    expect((req.request.body as typeof formData).company).toBe('Test Company');
    req.flush({});
  });

  it('should record submission timestamp in localStorage', () => {
    const formData = {
      name: 'Test',
      email: 'test@example.com',
      message: 'Msg',
    };

    const now = Date.now();
    vi.spyOn(Date, 'now').mockReturnValue(now);

    service.sendContactMessage(formData).subscribe();
    const req = httpMock.expectOne('https://formspree.io/f/test-id');
    req.flush({});

    const storedTime = localStorage.getItem('eb_contact_last_submission');
    expect(storedTime).toBe(now.toString());
  });

  describe('Rate Limiting', () => {
    it('should return false when not rate limited', () => {
      expect(service.isRateLimited()).toBe(false);
    });

    it('should return true when rate limited', () => {
      const now = Date.now();
      localStorage.setItem('eb_contact_last_submission', now.toString());
      vi.spyOn(Date, 'now').mockReturnValue(now + 5000); // 5 seconds later

      expect(service.isRateLimited()).toBe(true);
    });

    it('should return false after cooldown expires', () => {
      const now = Date.now();
      localStorage.setItem('eb_contact_last_submission', now.toString());
      vi.spyOn(Date, 'now').mockReturnValue(now + 31000); // 31 seconds later

      expect(service.isRateLimited()).toBe(false);
    });

    it('should return false when no previous submission exists', () => {
      localStorage.removeItem('eb_contact_last_submission');
      expect(service.isRateLimited()).toBe(false);
    });
  });

  describe('Remaining Cooldown', () => {
    it('should return 0 when no previous submission', () => {
      expect(service.getRemainingCooldown()).toBe(0);
    });

    it('should return 0 after cooldown expires', () => {
      const now = Date.now();
      localStorage.setItem('eb_contact_last_submission', now.toString());
      vi.spyOn(Date, 'now').mockReturnValue(now + 31000); // 31 seconds later

      expect(service.getRemainingCooldown()).toBe(0);
    });

    it('should return remaining seconds during cooldown', () => {
      const now = Date.now();
      localStorage.setItem('eb_contact_last_submission', now.toString());
      vi.spyOn(Date, 'now').mockReturnValue(now + 20000); // 20 seconds later

      const remaining = service.getRemainingCooldown();
      expect(remaining).toBe(10); // 30 - 20 = 10 seconds remaining
    });

    it('should ceil remaining time to nearest second', () => {
      const now = Date.now();
      localStorage.setItem('eb_contact_last_submission', now.toString());
      vi.spyOn(Date, 'now').mockReturnValue(now + 20500); // 20.5 seconds later

      const remaining = service.getRemainingCooldown();
      expect(remaining).toBe(10); // ceil(9.5) = 10
    });

    it('should return 30 immediately after submission', () => {
      const now = Date.now();
      localStorage.setItem('eb_contact_last_submission', now.toString());
      vi.spyOn(Date, 'now').mockReturnValue(now); // Same instant

      const remaining = service.getRemainingCooldown();
      expect(remaining).toBe(30);
    });
  });

  describe('Simulation Mode', () => {
    beforeEach(() => {
      // Configure environment without formspree endpoint
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          {
            provide: ENVIRONMENT,
            useValue: {
              ...mockEnvironment,
              formspreeEndpoint: undefined,
            },
          },
        ],
      });

      service = TestBed.inject(ContactService);
      httpMock = TestBed.inject(HttpTestingController);
    });

    it('should simulate submission when endpoint is undefined', async () => {
      vi.useFakeTimers();
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const formData = {
        name: 'Test',
        email: 'test@example.com',
        message: 'Msg',
      };

      const promise = new Promise<void>((resolve) => {
        service.sendContactMessage(formData).subscribe({
          next: () => {
            expect(consoleWarnSpy).toHaveBeenCalledWith(
              'Formspree endpoint not configured. Simulating success.',
            );
            resolve();
          },
        });
      });

      vi.advanceTimersByTime(1000);
      await promise;
      vi.useRealTimers();
    });

    it('should simulate submission when endpoint is empty string', async () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          {
            provide: ENVIRONMENT,
            useValue: {
              ...mockEnvironment,
              formspreeEndpoint: '',
            },
          },
        ],
      });

      service = TestBed.inject(ContactService);

      vi.useFakeTimers();

      const formData = {
        name: 'Test',
        email: 'test@example.com',
        message: 'Msg',
      };

      const promise = new Promise<void>((resolve) => {
        service.sendContactMessage(formData).subscribe({
          next: () => {
            resolve();
          },
        });
      });

      vi.advanceTimersByTime(1000);
      await promise;
      vi.useRealTimers();
    });

    it('should record submission timestamp during simulation', async () => {
      vi.useFakeTimers();
      const now = Date.now();
      vi.spyOn(Date, 'now').mockReturnValue(now);

      const formData = {
        name: 'Test',
        email: 'test@example.com',
        message: 'Msg',
      };

      const promise = new Promise<void>((resolve) => {
        service.sendContactMessage(formData).subscribe({
          next: () => {
            const storedTime = localStorage.getItem('eb_contact_last_submission');
            expect(storedTime).toBe(now.toString());
            resolve();
          },
        });
      });

      vi.advanceTimersByTime(1000);
      await promise;
      vi.useRealTimers();
    });

    it('should enforce rate limiting during simulation mode', async () => {
      vi.useFakeTimers();
      const now = Date.now();
      vi.spyOn(Date, 'now').mockReturnValue(now);

      const formData = {
        name: 'Test',
        email: 'test@example.com',
        message: 'Msg',
      };

      const promise = new Promise<void>((resolve) => {
        // First submission
        service.sendContactMessage(formData).subscribe(() => {
          // Advance by a small amount (still in cooldown)
          vi.spyOn(Date, 'now').mockReturnValue(now + 5000);

          // Second submission should fail
          service.sendContactMessage(formData).subscribe({
            error: (err: Error) => {
              expect(err.message).toContain('Please wait');
              resolve();
            },
          });
        });
      });

      vi.advanceTimersByTime(1000);
      await promise;
      vi.useRealTimers();
    });
  });

  describe('Manual Cooldown', () => {
    it('should allow manual cooldown start', () => {
      const now = Date.now();
      vi.spyOn(Date, 'now').mockReturnValue(now);

      expect(service.isRateLimited()).toBe(false);

      service.startCooldown();

      expect(service.isRateLimited()).toBe(true);
      const storedTime = localStorage.getItem('eb_contact_last_submission');
      expect(storedTime).toBe(now.toString());
    });

    it('should prevent submissions after manual cooldown', () => {
      service.startCooldown();

      const formData = {
        name: 'Test',
        email: 'test@example.com',
        message: 'Msg',
      };

      service.sendContactMessage(formData).subscribe({
        error: (err: Error) => {
          expect(err.message).toContain('Please wait');
        },
      });

      httpMock.expectNone('https://formspree.io/f/test-id');
    });
  });

  describe('Error Handling', () => {
    it('should propagate HTTP errors', () => {
      const formData = {
        name: 'Test',
        email: 'test@example.com',
        message: 'Msg',
      };

      service.sendContactMessage(formData).subscribe({
        error: (err: { status: number }) => {
          expect(err.status).toBe(500);
        },
      });

      const req = httpMock.expectOne('https://formspree.io/f/test-id');
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('should not record submission on HTTP error', () => {
      const formData = {
        name: 'Test',
        email: 'test@example.com',
        message: 'Msg',
      };

      service.sendContactMessage(formData).subscribe({
        error: () => {
          const storedTime = localStorage.getItem('eb_contact_last_submission');
          expect(storedTime).toBeNull();
        },
      });

      const req = httpMock.expectOne('https://formspree.io/f/test-id');
      req.flush('Error', { status: 400, statusText: 'Bad Request' });
    });
  });
});
