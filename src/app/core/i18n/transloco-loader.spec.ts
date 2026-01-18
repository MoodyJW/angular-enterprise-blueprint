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
    it('should fetch English translation file', () => {
      const mockTranslation = { hello: 'Hello', goodbye: 'Goodbye' };

      loader.getTranslation('en').subscribe((translation) => {
        expect(translation).toEqual(mockTranslation);
      });

      const req = httpTestingController.expectOne('assets/i18n/en.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockTranslation);
    });

    it('should fetch Spanish translation file', () => {
      const mockTranslation = { hello: 'Hola', goodbye: 'Adiós' };

      loader.getTranslation('es').subscribe((translation) => {
        expect(translation).toEqual(mockTranslation);
      });

      const req = httpTestingController.expectOne('assets/i18n/es.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockTranslation);
    });

    it('should use relative path without leading slash', () => {
      loader.getTranslation('de').subscribe();

      const req = httpTestingController.expectOne('assets/i18n/de.json');
      // Verify the URL does NOT start with a slash
      expect(req.request.url).not.toMatch(/^\//);
      req.flush({});
    });

    it('should handle complex translation objects', () => {
      const mockTranslation = {
        nav: {
          home: 'Home',
          about: 'About',
        },
        buttons: {
          submit: 'Submit',
          cancel: 'Cancel',
        },
      };

      loader.getTranslation('en').subscribe((translation) => {
        expect(translation).toEqual(mockTranslation);
      });

      httpTestingController.expectOne('assets/i18n/en.json').flush(mockTranslation);
    });

    it('should propagate HTTP errors', () => {
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
