import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { TranslocoHttpLoader } from './transloco-loader';

describe('TranslocoHttpLoader', () => {
  let loader: TranslocoHttpLoader;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), TranslocoHttpLoader],
    });

    loader = TestBed.inject(TranslocoHttpLoader);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  describe('getTranslation', () => {
    describe('default language (inlined)', () => {
      it('should return inlined English translations without HTTP request', () => {
        let receivedTranslation: unknown;

        loader.getTranslation('en').subscribe((translation) => {
          receivedTranslation = translation;
        });

        // Verify no HTTP request was made for English
        httpTestingController.expectNone('assets/i18n/en.json');

        // Verify translations were returned (synchronously from inlined JSON)
        expect(receivedTranslation).toBeDefined();
        expect(typeof receivedTranslation).toBe('object');
      });

      it('should return English translations with expected structure', () => {
        loader.getTranslation('en').subscribe((translation) => {
          // Verify the inlined translation has expected top-level keys
          expect(translation).toHaveProperty('common');
          expect(translation).toHaveProperty('nav');
        });

        httpTestingController.expectNone('assets/i18n/en.json');
      });
    });

    describe('non-default languages (HTTP)', () => {
      it('should fetch Spanish translation file via HTTP', () => {
        const mockTranslation = { hello: 'Hola', goodbye: 'Adiós' };

        loader.getTranslation('es').subscribe((translation) => {
          expect(translation).toEqual(mockTranslation);
        });

        const req = httpTestingController.expectOne('assets/i18n/es.json');
        expect(req.request.method).toBe('GET');
        req.flush(mockTranslation);
      });

      it('should fetch French translation file via HTTP', () => {
        const mockTranslation = { hello: 'Bonjour', goodbye: 'Au revoir' };

        loader.getTranslation('fr').subscribe((translation) => {
          expect(translation).toEqual(mockTranslation);
        });

        const req = httpTestingController.expectOne('assets/i18n/fr.json');
        expect(req.request.method).toBe('GET');
        req.flush(mockTranslation);
      });

      it('should use relative path without leading slash for HTTP requests', () => {
        loader.getTranslation('de').subscribe();

        const req = httpTestingController.expectOne('assets/i18n/de.json');
        // Verify the URL does NOT start with a slash
        expect(req.request.url).not.toMatch(/^\//);
        req.flush({});
      });

      it('should handle complex translation objects via HTTP', () => {
        const mockTranslation = {
          nav: {
            home: 'Inicio',
            about: 'Acerca',
          },
          buttons: {
            submit: 'Enviar',
            cancel: 'Cancelar',
          },
        };

        loader.getTranslation('es').subscribe((translation) => {
          expect(translation).toEqual(mockTranslation);
        });

        httpTestingController.expectOne('assets/i18n/es.json').flush(mockTranslation);
      });

      it('should propagate HTTP errors for non-default languages', () => {
        let error: Error | undefined;

        loader.getTranslation('invalid').subscribe({
          error: (e: Error) => {
            error = e;
          },
        });

        httpTestingController
          .expectOne('assets/i18n/invalid.json')
          .flush('Not found', { status: 404, statusText: 'Not Found' });

        expect(error).toBeDefined();
      });
    });
  });
});
