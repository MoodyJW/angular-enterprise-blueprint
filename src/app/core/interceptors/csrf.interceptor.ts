import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { CsrfTokenService } from '@core/services/security/csrf-token.service';

/**
 * Checks if a URL is a same-origin request or a relative URL.
 * External APIs (like GitHub) should NOT receive CSRF tokens.
 */
function isSameOriginOrRelative(url: string): boolean {
  // Relative URLs are always same-origin
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return true;
  }

  // Compare origins for absolute URLs
  try {
    const requestUrl = new URL(url);
    const currentOrigin = window.location.origin;
    return requestUrl.origin === currentOrigin;
  } catch {
    // If URL parsing fails, treat as same-origin (defensive)
    return true;
  }
}

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  const csrfService = inject(CsrfTokenService);

  // Only add CSRF token to:
  // 1. State-changing requests (POST, PUT, PATCH, DELETE)
  // 2. Same-origin requests (not external APIs like GitHub)
  const isStateChanging = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
  const isSameOrigin = isSameOriginOrRelative(req.url);

  if (isStateChanging && isSameOrigin) {
    const token = csrfService.getToken();
    req = req.clone({
      setHeaders: {
        'X-XSRF-TOKEN': token,
      },
    });
  }

  return next(req);
};
