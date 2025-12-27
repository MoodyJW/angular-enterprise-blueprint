# ADR-007: SEO Management Approach

## Status

Accepted

## Date

2025-12-20

## Context

As a public-facing enterprise blueprint, the application needs to be discoverable by search engines and look professional when shared on social media. Single Page Applications (SPAs) traditionally struggle with SEO unless specific metadata is dynamically updated.

We need a system to manage:

1. Page Titles (e.g., "Home - Application Name")
2. Meta Descriptions
3. Open Graph (Facebook/LinkedIn) and Twitter Card tags
4. Canonical URLs to prevent duplicate content penalties

### Options Considered

1. **Angular `Title` and `Meta` Services**: Using the built-in services directly in every component.
   - _Pros_: Native Angular API.
   - _Cons_: Repetitive boilerplate code in every route component; easy to forget tags.
2. **Route Data Configuration**: Defining title/meta in the router config.
   - _Pros_: Declarative, centralized.
   - _Cons_: Static only; doesn't handle dynamic content (e.g., "Product: X").
3. **Centralized `SeoService`**: A wrapper service that provides a simplified API for setting all metadata at once.
   - _Pros_: Unified API, consistent formatting (e.g., suffixing titles), easier testing.
   - _Cons_: Another service to maintain.

## Decision

We chose **Option 3: Centralized `SeoService`**.

We created a `SeoService` that acts as a facade over Angular's `Title` and `Meta` services. It provides high-level methods like `updateTitle()`, `updateDescription()`, and `updateSocialTags()` that handle the specific HTML meta tag implementation details.

### Rationale

1. **Consistency**: The service automatically appends ` | Enterprise Blueprint` to all page titles, ensuring consistent branding.
2. **Completeness**: One method call (`setMeta`) can update Title, Description, OG Image, and Twitter Card type simultaneously.
3. **Canonical URLs**: The service assumes responsibility for setting the `rel="canonical"` link tag, which is critical for preventing SEO penalties when the same content is accessible via multiple URL parameters.

## Implementation

### Service API

```typescript
// src/app/core/services/seo/seo.service.ts
@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(
    private title: Title,
    private meta: Meta,
  ) {}

  setTitle(title: string): void {
    this.title.setTitle(`${title} | Enterprise Blueprint`);
  }

  setMetaTags(config: SeoConfig): void {
    this.setTitle(config.title);
    this.meta.updateTag({ name: 'description', content: config.description });

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({ property: 'og:description', content: config.description });

    if (config.image) {
      this.meta.updateTag({ property: 'og:image', content: config.image });
    }
  }
}
```

### Usage in Component

```typescript
@Component({ ... })
export class FeatureComponent implements OnInit {
  private seo = inject(SeoService);

  ngOnInit() {
    this.seo.setMetaTags({
      title: 'Feature Dashboard',
      description: 'Manage your enterprise features effectively.',
      image: 'assets/feature-hero.png'
    });
  }
}
```

## Consequences

### Positive

- **Developer Productivity**: Setting SEO tags becomes a one-liner in components.
- **Brand Consistency**: Title formats are enforced globally.
- **Social Ready**: Every page automatically gets the basic tags needed for rich sharing cards.

### Negative

- **Client-Side Only**: Without Server-Side Rendering (SSR), some crawlers (mostly older ones) might still see the initial empty HTML shell. (Note: Modern Googlebot executes JS, so this is less of a concern than in the past).

### Neutral

- **Standard SPA Pattern**: Service-based SEO management is the conventional approach for client-rendered Angular applications.
- **SSR Migration Path**: If we later adopt Angular Universal for SSR, the `SeoService` API remains unchanged—only the underlying implementation would be enhanced.

## References

- [Angular Title Service](https://angular.dev/api/platform-browser/Title)
- [Angular Meta Service](https://angular.dev/api/platform-browser/Meta)
- [Open Graph Protocol](https://ogp.me/)
