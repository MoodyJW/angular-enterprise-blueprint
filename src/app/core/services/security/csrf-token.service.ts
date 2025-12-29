import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CsrfTokenService {
  private _token: string | null = null;

  /**
   * Get CSRF token from cookie or generate new one
   */
  getToken(): string {
    this._token ??= this._readTokenFromCookie() ?? this._generateToken();
    return this._token;
  }

  private _readTokenFromCookie(): string | null {
    // Read XSRF-TOKEN cookie set by backend
    const matches = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return matches !== null ? matches[1] : null;
  }

  private _generateToken(): string {
    // Generate client-side token (for demo only)
    return crypto.randomUUID();
  }
}
