import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CsrfTokenService } from './csrf-token.service';

describe('CsrfTokenService', () => {
  let service: CsrfTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CsrfTokenService],
    });
    service = TestBed.inject(CsrfTokenService);
  });

  afterEach(() => {
    // Clear cookies
    document.cookie = 'XSRF-TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    vi.restoreAllMocks();
  });

  describe('getToken', () => {
    it('should return token from cookie if present', () => {
      document.cookie = 'XSRF-TOKEN=cookie-token';
      const token = service.getToken();
      expect(token).toBe('cookie-token');
    });

    it('should generate new token if cookie is missing', () => {
      const token = service.getToken();
      expect(token).toBeTruthy();
      expect(token.length).toBeGreaterThan(0);
    });

    it('should cache the token after first read', () => {
      document.cookie = 'XSRF-TOKEN=initial-token';
      const token1 = service.getToken();

      // Change cookie to verify cache is used
      document.cookie = 'XSRF-TOKEN=changed-token';
      const token2 = service.getToken();

      expect(token1).toBe('initial-token');
      expect(token2).toBe('initial-token');
    });
  });
});
