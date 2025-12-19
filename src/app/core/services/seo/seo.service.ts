import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { ENVIRONMENT } from '../../config';
import type {
  DefaultSeoConfig,
  JsonLdConfig,
  MetaConfig,
  OpenGraphConfig,
  PageSeoConfig,
  TwitterCardConfig,
} from './seo.types';

/**
 * Service for managing SEO-related metadata.
 *
 * Provides a unified API for setting page titles, meta tags, Open Graph tags,
 * Twitter Cards, canonical URLs, and JSON-LD structured data.
 *
 * ## Features
 *
 * - **Title Management**: Dynamic page titles with configurable site name suffix
 * - **Meta Tags**: Standard meta tags (description, keywords, robots, author)
 * - **Open Graph**: Social sharing for Facebook, LinkedIn, etc.
 * - **Twitter Cards**: Twitter-specific social sharing
 * - **Canonical URLs**: Prevent duplicate content issues
 * - **JSON-LD**: Structured data for rich search results
 *
 * ## Usage
 *
 * ```typescript
 * // In a component or route resolver
 * constructor(private seo: SeoService) {
 *   this.seo.updatePageSeo({
 *     title: 'About Us',
 *     meta: { description: 'Learn about our company' },
 *     openGraph: { type: 'website' },
 *   });
 * }
 * ```
 *
 * @see https://ogp.me/ - Open Graph Protocol
 * @see https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/markup - Twitter Cards
 * @see https://schema.org/ - Structured Data
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly env = inject(ENVIRONMENT);

  private readonly defaultConfig: DefaultSeoConfig;
  private jsonLdScriptElement: HTMLScriptElement | null = null;

  constructor() {
    this.defaultConfig = {
      siteName: this.env.appName,
      titleSeparator: ' | ',
      defaultMeta: {
        robots: 'index, follow',
      },
      defaultOpenGraph: {
        type: 'website',
        siteName: this.env.appName,
        locale: 'en_US',
      },
      defaultTwitterCard: {
        card: 'summary_large_image',
      },
    };
  }

  /**
   * Updates all SEO metadata for a page.
   *
   * This is the primary method for setting page SEO. It handles:
   * - Page title (with site name suffix)
   * - Meta tags
   * - Canonical URL
   * - Open Graph tags
   * - Twitter Card tags
   * - JSON-LD structured data
   *
   * @param config - The page SEO configuration
   */
  updatePageSeo(config: PageSeoConfig): void {
    this.setTitle(config.title);

    if (config.meta !== undefined) {
      this.setMetaTags(config.meta);
    }

    if (config.canonicalUrl !== undefined) {
      this.setCanonicalUrl(config.canonicalUrl);
    }

    if (config.openGraph !== undefined) {
      this.setOpenGraph(config.openGraph, config.title);
    }

    if (config.twitterCard !== undefined) {
      this.setTwitterCard(config.twitterCard, config.title);
    }

    if (config.jsonLd !== undefined) {
      this.setJsonLd(config.jsonLd);
    }
  }

  /**
   * Sets the page title with optional site name suffix.
   *
   * @param pageTitle - The page-specific title
   * @param includeSiteName - Whether to append the site name (default: true)
   */
  setTitle(pageTitle: string, includeSiteName = true): void {
    const separator = this.defaultConfig.titleSeparator ?? ' | ';
    const fullTitle = includeSiteName
      ? `${pageTitle}${separator}${this.defaultConfig.siteName}`
      : pageTitle;

    this.title.setTitle(fullTitle);
  }

  /**
   * Gets the current page title.
   */
  getTitle(): string {
    return this.title.getTitle();
  }

  /**
   * Sets standard meta tags.
   *
   * @param config - Meta tag configuration
   */
  setMetaTags(config: MetaConfig): void {
    const mergedConfig = { ...this.defaultConfig.defaultMeta, ...config };

    if (mergedConfig.description !== undefined) {
      this.updateMetaTag('name', 'description', mergedConfig.description);
    }

    if (mergedConfig.keywords !== undefined && mergedConfig.keywords.length > 0) {
      this.updateMetaTag('name', 'keywords', mergedConfig.keywords.join(', '));
    }

    if (mergedConfig.author !== undefined) {
      this.updateMetaTag('name', 'author', mergedConfig.author);
    }

    if (mergedConfig.robots !== undefined) {
      this.updateMetaTag('name', 'robots', mergedConfig.robots);
    }
  }

  /**
   * Sets the canonical URL for the current page.
   *
   * Canonical URLs help search engines understand which version of a page
   * is the authoritative one, preventing duplicate content issues.
   *
   * @param url - The canonical URL (absolute or relative)
   */
  setCanonicalUrl(url: string): void {
    const absoluteUrl = this.resolveUrl(url);
    let linkElement = this.document.querySelector('link[rel="canonical"]');

    if (linkElement === null) {
      linkElement = this.document.createElement('link');
      linkElement.setAttribute('rel', 'canonical');
      this.document.head.appendChild(linkElement);
    }

    linkElement.setAttribute('href', absoluteUrl);
  }

  /**
   * Removes the canonical URL tag.
   */
  removeCanonicalUrl(): void {
    const linkElement = this.document.querySelector('link[rel="canonical"]');
    if (linkElement !== null) {
      linkElement.remove();
    }
  }

  /**
   * Sets Open Graph meta tags for social sharing.
   *
   * Open Graph tags control how content appears when shared on
   * Facebook, LinkedIn, and other social platforms.
   *
   * @param config - Open Graph configuration
   * @param fallbackTitle - Fallback title if not specified in config
   */
  setOpenGraph(config: OpenGraphConfig, fallbackTitle?: string): void {
    const mergedConfig = { ...this.defaultConfig.defaultOpenGraph, ...config };

    const title = mergedConfig.title ?? fallbackTitle;
    if (title !== undefined) {
      this.updateMetaTag('property', 'og:title', title);
    }

    if (mergedConfig.description !== undefined) {
      this.updateMetaTag('property', 'og:description', mergedConfig.description);
    }

    if (mergedConfig.type !== undefined) {
      this.updateMetaTag('property', 'og:type', mergedConfig.type);
    }

    if (mergedConfig.url !== undefined) {
      this.updateMetaTag('property', 'og:url', this.resolveUrl(mergedConfig.url));
    }

    if (mergedConfig.image !== undefined) {
      this.updateMetaTag('property', 'og:image', this.resolveUrl(mergedConfig.image));

      if (mergedConfig.imageAlt !== undefined) {
        this.updateMetaTag('property', 'og:image:alt', mergedConfig.imageAlt);
      }

      if (mergedConfig.imageWidth !== undefined) {
        this.updateMetaTag('property', 'og:image:width', String(mergedConfig.imageWidth));
      }

      if (mergedConfig.imageHeight !== undefined) {
        this.updateMetaTag('property', 'og:image:height', String(mergedConfig.imageHeight));
      }
    }

    if (mergedConfig.siteName !== undefined) {
      this.updateMetaTag('property', 'og:siteName', mergedConfig.siteName);
    }

    if (mergedConfig.locale !== undefined) {
      this.updateMetaTag('property', 'og:locale', mergedConfig.locale);
    }
  }

  /**
   * Sets Twitter Card meta tags.
   *
   * Twitter Cards control how content appears when shared on Twitter.
   * Many properties fall back to Open Graph equivalents if not specified.
   *
   * @param config - Twitter Card configuration
   * @param fallbackTitle - Fallback title if not specified in config
   */
  setTwitterCard(config: TwitterCardConfig, fallbackTitle?: string): void {
    const mergedConfig = { ...this.defaultConfig.defaultTwitterCard, ...config };

    if (mergedConfig.card !== undefined) {
      this.updateMetaTag('name', 'twitter:card', mergedConfig.card);
    }

    const title = mergedConfig.title ?? fallbackTitle;
    if (title !== undefined) {
      this.updateMetaTag('name', 'twitter:title', title);
    }

    if (mergedConfig.description !== undefined) {
      this.updateMetaTag('name', 'twitter:description', mergedConfig.description);
    }

    if (mergedConfig.image !== undefined) {
      this.updateMetaTag('name', 'twitter:image', this.resolveUrl(mergedConfig.image));

      if (mergedConfig.imageAlt !== undefined) {
        this.updateMetaTag('name', 'twitter:image:alt', mergedConfig.imageAlt);
      }
    }

    if (mergedConfig.site !== undefined) {
      this.updateMetaTag('name', 'twitter:site', mergedConfig.site);
    }

    if (mergedConfig.creator !== undefined) {
      this.updateMetaTag('name', 'twitter:creator', mergedConfig.creator);
    }
  }

  /**
   * Sets JSON-LD structured data for rich search results.
   *
   * JSON-LD provides search engines with structured information about
   * your content, enabling rich snippets and enhanced search results.
   *
   * @param data - Single or array of JSON-LD schema objects
   */
  setJsonLd(data: JsonLdConfig | readonly JsonLdConfig[]): void {
    // Remove existing JSON-LD script
    this.removeJsonLd();

    const schemas: readonly JsonLdConfig[] = Array.isArray(data) ? data : [data];
    const jsonLdData = schemas.map((schema) => ({
      '@context': 'https://schema.org' as const,
      ...schema,
    }));

    this.jsonLdScriptElement = this.document.createElement('script');
    this.jsonLdScriptElement.type = 'application/ld+json';
    this.jsonLdScriptElement.textContent = JSON.stringify(
      jsonLdData.length === 1 ? jsonLdData[0] : jsonLdData,
    );
    this.document.head.appendChild(this.jsonLdScriptElement);
  }

  /**
   * Removes JSON-LD structured data from the page.
   */
  removeJsonLd(): void {
    if (this.jsonLdScriptElement !== null) {
      this.jsonLdScriptElement.remove();
      this.jsonLdScriptElement = null;
    }
  }

  /**
   * Resets all SEO metadata to defaults.
   *
   * Useful when navigating away from a page to prevent stale metadata.
   */
  resetSeo(): void {
    this.setTitle(this.defaultConfig.siteName, false);
    this.removeCanonicalUrl();
    this.removeJsonLd();
    this.removeOpenGraphTags();
    this.removeTwitterCardTags();
  }

  /**
   * Removes all Open Graph meta tags.
   */
  private removeOpenGraphTags(): void {
    const ogTags = [
      'og:title',
      'og:description',
      'og:type',
      'og:url',
      'og:image',
      'og:image:alt',
      'og:image:width',
      'og:image:height',
      'og:siteName',
      'og:locale',
    ];

    ogTags.forEach((tag) => {
      this.meta.removeTag(`property="${tag}"`);
    });
  }

  /**
   * Removes all Twitter Card meta tags.
   */
  private removeTwitterCardTags(): void {
    const twitterTags = [
      'twitter:card',
      'twitter:title',
      'twitter:description',
      'twitter:image',
      'twitter:image:alt',
      'twitter:site',
      'twitter:creator',
    ];

    twitterTags.forEach((tag) => {
      this.meta.removeTag(`name="${tag}"`);
    });
  }

  /**
   * Updates or creates a meta tag.
   */
  private updateMetaTag(attrSelector: 'name' | 'property', name: string, content: string): void {
    const selector = `${attrSelector}="${name}"`;

    if (this.meta.getTag(selector) !== null) {
      this.meta.updateTag({ [attrSelector]: name, content }, selector);
    } else {
      this.meta.addTag({ [attrSelector]: name, content });
    }
  }

  /**
   * Resolves a URL to an absolute URL.
   */
  private resolveUrl(url: string): string {
    // Already absolute
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    // Use base URL if configured
    if (this.defaultConfig.baseUrl !== undefined) {
      const base = this.defaultConfig.baseUrl.replace(/\/$/, '');
      const path = url.startsWith('/') ? url : `/${url}`;
      return `${base}${path}`;
    }

    // Use document location as fallback
    // Note: location may be null in test environments or SSR
    const location = this.document.location as Location | null;
    const origin = location?.origin ?? '';
    const path = url.startsWith('/') ? url : `/${url}`;
    return `${origin}${path}`;
  }
}
