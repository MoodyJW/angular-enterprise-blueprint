/**
 * SEO type definitions for the SeoService.
 *
 * These types provide strict typing for all SEO-related metadata,
 * including standard meta tags, Open Graph, Twitter Cards, and JSON-LD.
 */

/**
 * Standard meta tag configuration.
 */
export interface MetaConfig {
  /** Page description for search engines (recommended: 150-160 characters) */
  readonly description?: string;
  /** Keywords for the page (less important for modern SEO but still used) */
  readonly keywords?: string[];
  /** Author of the content */
  readonly author?: string;
  /** Robots directive (e.g., 'index, follow', 'noindex, nofollow') */
  readonly robots?: RobotsDirective;
}

/**
 * Common robots meta tag directives.
 */
export type CommonRobotsDirective =
  | 'index, follow'
  | 'index, nofollow'
  | 'noindex, follow'
  | 'noindex, nofollow'
  | 'none';

/**
 * Robots meta tag directive - common values or custom string.
 * The `& Record<never, never>` pattern allows custom strings while preserving autocomplete for common values.
 */
export type RobotsDirective = CommonRobotsDirective | (string & Record<never, never>);

/**
 * Open Graph configuration for social sharing (Facebook, LinkedIn, etc.).
 * @see https://ogp.me/
 */
export interface OpenGraphConfig {
  /** The title of the content */
  readonly title?: string;
  /** A brief description of the content */
  readonly description?: string;
  /** The type of content (e.g., 'website', 'article', 'profile') */
  readonly type?: OpenGraphType;
  /** The canonical URL of the content */
  readonly url?: string;
  /** URL to an image representing the content */
  readonly image?: string;
  /** Alt text for the image */
  readonly imageAlt?: string;
  /** Width of the image in pixels */
  readonly imageWidth?: number;
  /** Height of the image in pixels */
  readonly imageHeight?: number;
  /** The name of the website */
  readonly siteName?: string;
  /** The locale of the content (e.g., 'en_US') */
  readonly locale?: string;
}

/**
 * Common Open Graph content types.
 */
export type CommonOpenGraphType =
  | 'website'
  | 'article'
  | 'profile'
  | 'book'
  | 'music.song'
  | 'music.album'
  | 'video.movie'
  | 'video.episode';

/**
 * Open Graph content type - common values or custom string.
 */
export type OpenGraphType = CommonOpenGraphType | (string & Record<never, never>);

/**
 * Twitter Card configuration.
 * @see https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/markup
 */
export interface TwitterCardConfig {
  /** The card type */
  readonly card?: TwitterCardType;
  /** The title of the content (max 70 characters) */
  readonly title?: string;
  /** Description of the content (max 200 characters) */
  readonly description?: string;
  /** URL to the image */
  readonly image?: string;
  /** Alt text for the image */
  readonly imageAlt?: string;
  /** @username of the website */
  readonly site?: string;
  /** @username of the content creator */
  readonly creator?: string;
}

/**
 * Twitter Card types.
 */
export type TwitterCardType = 'summary' | 'summary_large_image' | 'app' | 'player';

/**
 * JSON-LD structured data for rich search results.
 * @see https://schema.org/
 */
export interface JsonLdConfig {
  /** The schema.org type (e.g., 'WebSite', 'Article', 'Organization') */
  readonly '@type': string;
  /** Additional schema.org properties */
  readonly [key: string]: unknown;
}

/**
 * Predefined JSON-LD schemas for common use cases.
 */
export interface WebSiteSchema extends JsonLdConfig {
  readonly '@type': 'WebSite';
  readonly name: string;
  readonly url: string;
  readonly description?: string;
  readonly potentialAction?: SearchActionSchema;
}

export interface SearchActionSchema {
  readonly '@type': 'SearchAction';
  readonly target: string;
  readonly 'query-input': string;
}

export interface OrganizationSchema extends JsonLdConfig {
  readonly '@type': 'Organization';
  readonly name: string;
  readonly url: string;
  readonly logo?: string;
  readonly sameAs?: readonly string[];
  readonly contactPoint?: ContactPointSchema;
}

export interface ContactPointSchema {
  readonly '@type': 'ContactPoint';
  readonly contactType: string;
  readonly email?: string;
  readonly telephone?: string;
}

export interface ArticleSchema extends JsonLdConfig {
  readonly '@type': 'Article' | 'BlogPosting' | 'NewsArticle';
  readonly headline: string;
  readonly description?: string;
  readonly image?: string | readonly string[];
  readonly author?: PersonSchema | OrganizationSchema;
  readonly publisher?: OrganizationSchema;
  readonly datePublished?: string;
  readonly dateModified?: string;
}

export interface PersonSchema extends JsonLdConfig {
  readonly '@type': 'Person';
  readonly name: string;
  readonly url?: string;
  readonly image?: string;
}

export interface BreadcrumbSchema extends JsonLdConfig {
  readonly '@type': 'BreadcrumbList';
  readonly itemListElement: readonly BreadcrumbItemSchema[];
}

export interface BreadcrumbItemSchema {
  readonly '@type': 'ListItem';
  readonly position: number;
  readonly name: string;
  readonly item?: string;
}

/**
 * Complete page SEO configuration.
 */
export interface PageSeoConfig {
  /** Page title (will be combined with site name if configured) */
  readonly title: string;
  /** Standard meta tags */
  readonly meta?: MetaConfig;
  /** Canonical URL for this page */
  readonly canonicalUrl?: string;
  /** Open Graph configuration */
  readonly openGraph?: OpenGraphConfig;
  /** Twitter Card configuration */
  readonly twitterCard?: TwitterCardConfig;
  /** JSON-LD structured data */
  readonly jsonLd?: JsonLdConfig | readonly JsonLdConfig[];
}

/**
 * Default SEO configuration applied to all pages.
 */
export interface DefaultSeoConfig {
  /** Site name appended to page titles */
  readonly siteName: string;
  /** Separator between page title and site name (default: ' | ') */
  readonly titleSeparator?: string;
  /** Default meta tags */
  readonly defaultMeta?: MetaConfig;
  /** Default Open Graph configuration */
  readonly defaultOpenGraph?: Partial<OpenGraphConfig>;
  /** Default Twitter Card configuration */
  readonly defaultTwitterCard?: Partial<TwitterCardConfig>;
  /** Base URL for canonical URLs */
  readonly baseUrl?: string;
}
