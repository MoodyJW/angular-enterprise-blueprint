import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CsrfTokenService } from '../services/security/csrf-token.service';

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  const csrfService = inject(CsrfTokenService);

  // Only add CSRF token to state-changing requests
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const token = csrfService.getToken();
    req = req.clone({
      setHeaders: {
        'X-XSRF-TOKEN': token,
      },
    });
  }

  return next(req);
};
