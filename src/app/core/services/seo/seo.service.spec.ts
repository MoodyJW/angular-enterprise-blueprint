import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ENVIRONMENT } from '@core/config';
import type { AppEnvironment } from '@environments/environment.type';
import { SeoService } from './seo.service';
import type { JsonLdConfig, PageSeoConfig } from './seo.types';

describe('SeoService', () => {
  let service: SeoService;
  let titleService: Title;
  let metaService: Meta;
  let mockDocument: Document;

  const mockEnv: AppEnvironment = {
    appName: 'Test App',
    production: false,
    apiUrl: '/api',
    features: { mockAuth: true },
    analytics: { enabled: false, provider: 'console' },
    version: '1.0.0',
  };

  beforeEach(() => {
    // Create a minimal mock document
    mockDocument = document.implementation.createHTMLDocument('Test');

    TestBed.configureTestingModule({
      providers: [
        SeoService,
        { provide: ENVIRONMENT, useValue: mockEnv },
        { provide: DOCUMENT, useValue: mockDocument },
      ],
    });

    service = TestBed.inject(SeoService);
    titleService = TestBed.inject(Title);
    metaService = TestBed.inject(Meta);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    TestBed.resetTestingModule();
  });

  describe('setTitle', () => {
    it('should set the page title with site name suffix', () => {
      service.setTitle('About Us');

      expect(titleService.getTitle()).toBe('About Us | Test App');
    });

    it('should set the page title without site name when includeSiteName is false', () => {
      service.setTitle('Custom Title', false);

      expect(titleService.getTitle()).toBe('Custom Title');
    });
  });

  describe('getTitle', () => {
    it('should return the current page title', () => {
      service.setTitle('Test Page');

      expect(service.getTitle()).toBe('Test Page | Test App');
    });
  });

  describe('setMetaTags', () => {
    it('should set the description meta tag', () => {
      service.setMetaTags({ description: 'Test description' });

      const tag = metaService.getTag('name="description"');
      expect(tag?.content).toBe('Test description');
    });

    it('should set the keywords meta tag', () => {
      service.setMetaTags({ keywords: ['angular', 'enterprise', 'blueprint'] });

      const tag = metaService.getTag('name="keywords"');
      expect(tag?.content).toBe('angular, enterprise, blueprint');
    });

    it('should set the author meta tag', () => {
      service.setMetaTags({ author: 'John Doe' });

      const tag = metaService.getTag('name="author"');
      expect(tag?.content).toBe('John Doe');
    });

    it('should set the robots meta tag', () => {
      service.setMetaTags({ robots: 'noindex, nofollow' });

      const tag = metaService.getTag('name="robots"');
      expect(tag?.content).toBe('noindex, nofollow');
    });

    it('should set default robots directive to "index, follow"', () => {
      service.setMetaTags({});

      const tag = metaService.getTag('name="robots"');
      expect(tag?.content).toBe('index, follow');
    });

    it('should update existing meta tags', () => {
      service.setMetaTags({ description: 'First description' });
      service.setMetaTags({ description: 'Updated description' });

      const tag = metaService.getTag('name="description"');
      expect(tag?.content).toBe('Updated description');
    });
  });

  describe('setCanonicalUrl', () => {
    it('should create a canonical link tag', () => {
      service.setCanonicalUrl('/about');

      const link = mockDocument.querySelector('link[rel="canonical"]');
      expect(link).not.toBeNull();
      expect(link?.getAttribute('href')).toContain('/about');
    });

    it('should update existing canonical link tag', () => {
      service.setCanonicalUrl('/about');
      service.setCanonicalUrl('/contact');

      const links = mockDocument.querySelectorAll('link[rel="canonical"]');
      expect(links.length).toBe(1);
      const firstLink = links[0];
      expect(firstLink).toBeDefined();
      expect(firstLink.getAttribute('href')).toContain('/contact');
    });

    it('should preserve absolute URLs', () => {
      service.setCanonicalUrl('https://example.com/page');

      const link = mockDocument.querySelector('link[rel="canonical"]');
      expect(link?.getAttribute('href')).toBe('https://example.com/page');
    });
  });

  describe('removeCanonicalUrl', () => {
    it('should remove the canonical link tag', () => {
      service.setCanonicalUrl('/about');
      service.removeCanonicalUrl();

      const link = mockDocument.querySelector('link[rel="canonical"]');
      expect(link).toBeNull();
    });

    it('should not throw when no canonical URL exists', () => {
      expect(() => {
        service.removeCanonicalUrl();
      }).not.toThrow();
    });
  });

  describe('setOpenGraph', () => {
    it('should set og:title', () => {
      service.setOpenGraph({ title: 'OG Title' });

      const tag = metaService.getTag('property="og:title"');
      expect(tag?.content).toBe('OG Title');
    });

    it('should use fallback title when title not provided', () => {
      service.setOpenGraph({}, 'Fallback Title');

      const tag = metaService.getTag('property="og:title"');
      expect(tag?.content).toBe('Fallback Title');
    });

    it('should set og:description', () => {
      service.setOpenGraph({ description: 'OG Description' });

      const tag = metaService.getTag('property="og:description"');
      expect(tag?.content).toBe('OG Description');
    });

    it('should set og:type with default "website"', () => {
      service.setOpenGraph({});

      const tag = metaService.getTag('property="og:type"');
      expect(tag?.content).toBe('website');
    });

    it('should set og:type with custom value', () => {
      service.setOpenGraph({ type: 'article' });

      const tag = metaService.getTag('property="og:type"');
      expect(tag?.content).toBe('article');
    });

    it('should set og:url', () => {
      service.setOpenGraph({ url: 'https://example.com/page' });

      const tag = metaService.getTag('property="og:url"');
      expect(tag?.content).toBe('https://example.com/page');
    });

    it('should set og:image and related tags', () => {
      service.setOpenGraph({
        image: 'https://example.com/image.jpg',
        imageAlt: 'Image description',
        imageWidth: 1200,
        imageHeight: 630,
      });

      expect(metaService.getTag('property="og:image"')?.content).toBe(
        'https://example.com/image.jpg',
      );
      expect(metaService.getTag('property="og:image:alt"')?.content).toBe('Image description');
      expect(metaService.getTag('property="og:image:width"')?.content).toBe('1200');
      expect(metaService.getTag('property="og:image:height"')?.content).toBe('630');
    });

    it('should set og:siteName with default from environment', () => {
      service.setOpenGraph({});

      const tag = metaService.getTag('property="og:siteName"');
      expect(tag?.content).toBe('Test App');
    });

    it('should set og:locale with default "en_US"', () => {
      service.setOpenGraph({});

      const tag = metaService.getTag('property="og:locale"');
      expect(tag?.content).toBe('en_US');
    });
  });

  describe('setTwitterCard', () => {
    it('should set twitter:card with default "summary_large_image"', () => {
      service.setTwitterCard({});

      const tag = metaService.getTag('name="twitter:card"');
      expect(tag?.content).toBe('summary_large_image');
    });

    it('should set twitter:card with custom value', () => {
      service.setTwitterCard({ card: 'summary' });

      const tag = metaService.getTag('name="twitter:card"');
      expect(tag?.content).toBe('summary');
    });

    it('should set twitter:title', () => {
      service.setTwitterCard({ title: 'Twitter Title' });

      const tag = metaService.getTag('name="twitter:title"');
      expect(tag?.content).toBe('Twitter Title');
    });

    it('should use fallback title when title not provided', () => {
      service.setTwitterCard({}, 'Fallback Title');

      const tag = metaService.getTag('name="twitter:title"');
      expect(tag?.content).toBe('Fallback Title');
    });

    it('should set twitter:description', () => {
      service.setTwitterCard({ description: 'Twitter Description' });

      const tag = metaService.getTag('name="twitter:description"');
      expect(tag?.content).toBe('Twitter Description');
    });

    it('should set twitter:image and alt', () => {
      service.setTwitterCard({
        image: 'https://example.com/image.jpg',
        imageAlt: 'Image description',
      });

      expect(metaService.getTag('name="twitter:image"')?.content).toBe(
        'https://example.com/image.jpg',
      );
      expect(metaService.getTag('name="twitter:image:alt"')?.content).toBe('Image description');
    });

    it('should set twitter:site', () => {
      service.setTwitterCard({ site: '@mysite' });

      const tag = metaService.getTag('name="twitter:site"');
      expect(tag?.content).toBe('@mysite');
    });

    it('should set twitter:creator', () => {
      service.setTwitterCard({ creator: '@author' });

      const tag = metaService.getTag('name="twitter:creator"');
      expect(tag?.content).toBe('@author');
    });
  });

  describe('setJsonLd', () => {
    it('should create a JSON-LD script element', () => {
      const schema: JsonLdConfig = {
        '@type': 'WebSite',
        name: 'Test Site',
        url: 'https://example.com',
      };

      service.setJsonLd(schema);

      const script = mockDocument.querySelector('script[type="application/ld+json"]');
      expect(script).not.toBeNull();
    });

    it('should include @context in JSON-LD', () => {
      const schema: JsonLdConfig = {
        '@type': 'WebSite',
        name: 'Test Site',
        url: 'https://example.com',
      };

      service.setJsonLd(schema);

      const script = mockDocument.querySelector('script[type="application/ld+json"]');
      const content = JSON.parse(script?.textContent ?? '{}') as Record<string, unknown>;
      expect(content['@context']).toBe('https://schema.org');
    });

    it('should serialize schema properties correctly', () => {
      const schema: JsonLdConfig = {
        '@type': 'WebSite',
        name: 'Test Site',
        url: 'https://example.com',
      };

      service.setJsonLd(schema);

      const script = mockDocument.querySelector('script[type="application/ld+json"]');
      const content = JSON.parse(script?.textContent ?? '{}') as Record<string, unknown>;
      expect(content['@type']).toBe('WebSite');
      expect(content['name']).toBe('Test Site');
      expect(content['url']).toBe('https://example.com');
    });

    it('should handle array of schemas', () => {
      const schemas: JsonLdConfig[] = [
        { '@type': 'WebSite', name: 'Site' },
        { '@type': 'Organization', name: 'Org' },
      ];

      service.setJsonLd(schemas);

      const script = mockDocument.querySelector('script[type="application/ld+json"]');
      const content = JSON.parse(script?.textContent ?? '[]') as Record<string, unknown>[];
      expect(Array.isArray(content)).toBe(true);
      expect(content.length).toBe(2);
    });

    it('should replace existing JSON-LD when called multiple times', () => {
      service.setJsonLd({ '@type': 'WebSite', name: 'First' });
      service.setJsonLd({ '@type': 'WebSite', name: 'Second' });

      const scripts = mockDocument.querySelectorAll('script[type="application/ld+json"]');
      expect(scripts.length).toBe(1);

      const firstScript = scripts[0];
      expect(firstScript).toBeDefined();
      expect(firstScript.textContent).not.toBeNull();
      const content = JSON.parse(firstScript.textContent) as Record<string, unknown>;
      expect(content['name']).toBe('Second');
    });
  });

  describe('removeJsonLd', () => {
    it('should remove the JSON-LD script element', () => {
      service.setJsonLd({ '@type': 'WebSite', name: 'Test' });
      service.removeJsonLd();

      const script = mockDocument.querySelector('script[type="application/ld+json"]');
      expect(script).toBeNull();
    });

    it('should not throw when no JSON-LD exists', () => {
      expect(() => {
        service.removeJsonLd();
      }).not.toThrow();
    });
  });

  describe('updatePageSeo', () => {
    it('should set all SEO properties at once', () => {
      const config: PageSeoConfig = {
        title: 'Test Page',
        meta: {
          description: 'Test description',
          keywords: ['test'],
        },
        canonicalUrl: '/test',
        openGraph: {
          type: 'article',
          description: 'OG description',
        },
        twitterCard: {
          card: 'summary',
          description: 'Twitter description',
        },
        jsonLd: {
          '@type': 'WebPage',
          name: 'Test Page',
        },
      };

      service.updatePageSeo(config);

      // Verify title
      expect(titleService.getTitle()).toBe('Test Page | Test App');

      // Verify meta
      expect(metaService.getTag('name="description"')?.content).toBe('Test description');

      // Verify canonical
      const canonical = mockDocument.querySelector('link[rel="canonical"]');
      expect(canonical).not.toBeNull();

      // Verify Open Graph
      expect(metaService.getTag('property="og:type"')?.content).toBe('article');
      expect(metaService.getTag('property="og:title"')?.content).toBe('Test Page');

      // Verify Twitter Card
      expect(metaService.getTag('name="twitter:card"')?.content).toBe('summary');
      expect(metaService.getTag('name="twitter:title"')?.content).toBe('Test Page');

      // Verify JSON-LD
      const jsonLd = mockDocument.querySelector('script[type="application/ld+json"]');
      expect(jsonLd).not.toBeNull();
    });

    it('should only set provided properties', () => {
      const config: PageSeoConfig = {
        title: 'Simple Page',
      };

      service.updatePageSeo(config);

      expect(titleService.getTitle()).toBe('Simple Page | Test App');
      // Should not add canonical if not provided
      expect(mockDocument.querySelector('link[rel="canonical"]')).toBeNull();
    });
  });

  describe('resetSeo', () => {
    it('should reset title to site name only', () => {
      service.setTitle('Test Page');
      service.resetSeo();

      expect(titleService.getTitle()).toBe('Test App');
    });

    it('should remove canonical URL', () => {
      service.setCanonicalUrl('/test');
      service.resetSeo();

      expect(mockDocument.querySelector('link[rel="canonical"]')).toBeNull();
    });

    it('should remove JSON-LD', () => {
      service.setJsonLd({ '@type': 'WebSite', name: 'Test' });
      service.resetSeo();

      expect(mockDocument.querySelector('script[type="application/ld+json"]')).toBeNull();
    });

    it('should remove Open Graph tags', () => {
      service.setOpenGraph({ title: 'OG Title', description: 'OG Desc' });
      service.resetSeo();

      expect(metaService.getTag('property="og:title"')).toBeNull();
      expect(metaService.getTag('property="og:description"')).toBeNull();
    });

    it('should remove Twitter Card tags', () => {
      service.setTwitterCard({ title: 'Twitter Title', description: 'Twitter Desc' });
      service.resetSeo();

      expect(metaService.getTag('name="twitter:title"')).toBeNull();
      expect(metaService.getTag('name="twitter:description"')).toBeNull();
    });
  });

  describe('URL resolution', () => {
    it('should preserve absolute HTTP URLs', () => {
      service.setCanonicalUrl('http://example.com/page');

      const link = mockDocument.querySelector('link[rel="canonical"]');
      expect(link?.getAttribute('href')).toBe('http://example.com/page');
    });

    it('should preserve absolute HTTPS URLs', () => {
      service.setCanonicalUrl('https://example.com/page');

      const link = mockDocument.querySelector('link[rel="canonical"]');
      expect(link?.getAttribute('href')).toBe('https://example.com/page');
    });

    it('should handle relative URLs with leading slash', () => {
      service.setCanonicalUrl('/about');

      const link = mockDocument.querySelector('link[rel="canonical"]');
      expect(link?.getAttribute('href')).toContain('/about');
    });

    it('should handle relative URLs without leading slash', () => {
      service.setCanonicalUrl('about');

      const link = mockDocument.querySelector('link[rel="canonical"]');
      expect(link?.getAttribute('href')).toContain('/about');
    });
  });
});
