import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Translation, TranslocoLoader } from '@jsverse/transloco';
import type { Observable } from 'rxjs';

/**
 * Loader for fetching translation files over HTTP.
 * Configured to resolve assets relative to the base href.
 *
 * Performance note: The default language (en.json) should be preloaded
 * via a <link rel="preload"> tag in index.html to avoid blocking FCP/LCP.
 */
@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private readonly http = inject(HttpClient);

  getTranslation(lang: string): Observable<Translation> {
    // Use a relative path (no leading slash) so the request is resolved
    // relative to the app's base href. This prevents requests from going
    // to the site root when hosted under a subpath (e.g. GitHub Pages).
    return this.http.get<Translation>(`assets/i18n/${lang}.json`);
  }
}
