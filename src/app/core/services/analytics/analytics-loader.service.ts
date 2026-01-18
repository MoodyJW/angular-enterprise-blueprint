import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Service responsible for dynamically loading external scripts.
 * Used primarily for lazy-loading analytics SDKs.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsLoaderService {
  private readonly document = inject(DOCUMENT);

  /**
   * Loads an external script and returns an Observable that completes on success.
   *
   * @param src - The script URL to load
   * @param nonce - Optional nonce for CSP compliance
   * @returns Observable that completes when script loads, or errors on failure
   */
  loadScript(src: string, nonce?: string): Observable<void> {
    return new Observable<void>((subscriber) => {
      const script = this.document.createElement('script');
      script.src = src;
      script.async = true;

      if (nonce !== undefined) {
        script.setAttribute('nonce', nonce);
      }

      script.onload = (): void => {
        subscriber.next();
        subscriber.complete();
      };

      script.onerror = (): void => {
        subscriber.error(new Error(`Failed to load script: ${src}`));
      };

      this.document.head.appendChild(script);

      // Cleanup function (called on unsubscribe)
      return (): void => {
        // Script is already appended; no cleanup needed for this use case
      };
    });
  }
}
