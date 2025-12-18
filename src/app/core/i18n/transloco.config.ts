import { isDevMode } from '@angular/core';
import { provideTransloco } from '@jsverse/transloco';
import { TranslocoHttpLoader } from './transloco-loader';

export const AVAILABLE_LANGUAGES = ['en', 'es', 'fr'] as const;
export type AvailableLanguage = (typeof AVAILABLE_LANGUAGES)[number];
export const DEFAULT_LANGUAGE: AvailableLanguage = 'en';

export function provideTranslocoConfig(): ReturnType<typeof provideTransloco> {
  return provideTransloco({
    config: {
      availableLangs: [...AVAILABLE_LANGUAGES],
      defaultLang: DEFAULT_LANGUAGE,
      fallbackLang: DEFAULT_LANGUAGE,
      reRenderOnLangChange: true,
      prodMode: !isDevMode(),
      missingHandler: {
        useFallbackTranslation: true,
        logMissingKey: true,
      },
    },
    loader: TranslocoHttpLoader,
  });
}
