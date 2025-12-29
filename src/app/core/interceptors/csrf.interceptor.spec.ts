import { HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';

import { CsrfTokenService } from '../services/security/csrf-token.service';
import { csrfInterceptor } from './csrf.interceptor';

describe('csrfInterceptor', () => {
  const interceptorRunner = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<unknown> =>
    TestBed.runInInjectionContext(() => csrfInterceptor(req, next));

  let csrfServiceSpy: { getToken: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    csrfServiceSpy = {
      getToken: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: CsrfTokenService, useValue: csrfServiceSpy }],
    });
  });

  describe('same-origin requests', () => {
    it('should add X-XSRF-TOKEN header to POST requests with relative URL', () => {
      const req = new HttpRequest('POST', '/api/data', null);
      const next = vi.fn().mockReturnValue(of(new HttpResponse()));
      const token = 'test-token';
      csrfServiceSpy.getToken.mockReturnValue(token);

      interceptorRunner(req, next);

      expect(csrfServiceSpy.getToken).toHaveBeenCalled();
      const interceptedReq = next.mock.calls[0][0] as HttpRequest<unknown>;
      expect(interceptedReq.headers.get('X-XSRF-TOKEN')).toBe(token);
    });

    it('should add X-XSRF-TOKEN header to DELETE requests', () => {
      const req = new HttpRequest('DELETE', '/api/data', null);
      const next = vi.fn().mockReturnValue(of(new HttpResponse()));
      const token = 'test-token';
      csrfServiceSpy.getToken.mockReturnValue(token);

      interceptorRunner(req, next);

      const interceptedReq = next.mock.calls[0][0] as HttpRequest<unknown>;
      expect(interceptedReq.headers.get('X-XSRF-TOKEN')).toBe(token);
    });

    it('should NOT add X-XSRF-TOKEN header to GET requests', () => {
      const req = new HttpRequest('GET', '/api/data');
      const next = vi.fn().mockReturnValue(of(new HttpResponse()));

      interceptorRunner(req, next);

      expect(csrfServiceSpy.getToken).not.toHaveBeenCalled();
      const interceptedReq = next.mock.calls[0][0] as HttpRequest<unknown>;
      expect(interceptedReq.headers.has('X-XSRF-TOKEN')).toBe(false);
    });
  });

  describe('cross-origin requests', () => {
    it('should NOT add X-XSRF-TOKEN header to external API POST requests', () => {
      const req = new HttpRequest('POST', 'https://api.github.com/graphql', null);
      const next = vi.fn().mockReturnValue(of(new HttpResponse()));

      interceptorRunner(req, next);

      expect(csrfServiceSpy.getToken).not.toHaveBeenCalled();
      const interceptedReq = next.mock.calls[0][0] as HttpRequest<unknown>;
      expect(interceptedReq.headers.has('X-XSRF-TOKEN')).toBe(false);
    });

    it('should NOT add X-XSRF-TOKEN header to external API DELETE requests', () => {
      const req = new HttpRequest('DELETE', 'https://external-api.example.com/resource', null);
      const next = vi.fn().mockReturnValue(of(new HttpResponse()));

      interceptorRunner(req, next);

      expect(csrfServiceSpy.getToken).not.toHaveBeenCalled();
      const interceptedReq = next.mock.calls[0][0] as HttpRequest<unknown>;
      expect(interceptedReq.headers.has('X-XSRF-TOKEN')).toBe(false);
    });
  });
});
