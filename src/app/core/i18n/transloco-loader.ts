import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Translation, TranslocoLoader } from '@jsverse/transloco';
import { Observable, of } from 'rxjs';

// Import the default language translations at build time
// This eliminates the HTTP request for the initial render, improving FCP/LCP
import enTranslations from '../../../assets/i18n/en.json';

import { DEFAULT_LANGUAGE } from './transloco.config';

/**
 * Optimized loader for fetching translation files.
 *
 * For the default language (English), translations are inlined at build time
 * to avoid an HTTP request during initial render. This improves Lighthouse
 * performance scores by reducing FCP blocking requests.
 *
 * For other languages, translations are fetched over HTTP on-demand.
 */
@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private readonly http = inject(HttpClient);

  getTranslation(lang: string): Observable<Translation> {
    // Return inlined translations for the default language (no HTTP request)
    if (lang === DEFAULT_LANGUAGE) {
      return of(enTranslations as Translation);
    }

    // Fetch other languages over HTTP on-demand
    // Use a relative path (no leading slash) so the request is resolved
    // relative to the app's base href. This prevents requests from going
    // to the site root when hosted under a subpath (e.g. GitHub Pages).
    return this.http.get<Translation>(`assets/i18n/${lang}.json`);
  }
}
