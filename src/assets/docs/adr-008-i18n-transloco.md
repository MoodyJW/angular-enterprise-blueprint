# ADR-008: I18n Strategy with Transloco

## Status

Accepted

## Date

2025-12-21

## Context

The application aims for a global audience, requiring support for multiple languages (initially English and Spanish). We need an internationalization (i18n) solution that:

1. Allows changing language at runtime without reloading the page.
2. Keeps bundle sizes small by lazy-loading translation files.
3. Provides a good developer experience (easy to add keys, readable formats).

### Options Considered

1. **Angular Native I18n (`@angular/localize`)**:
   - _Pros_: Standard, highly optimized build-time substitution.
   - _Cons_: Requires building a separate application bundle for EACH language. No runtime language switching (requires page reload/redirect). XML-based (XLF) format is harder for devs to read/edit manually.
2. **ngx-translate**:
   - _Pros_: The historical standard for runtime i18n in Angular.
   - _Cons_: Maintenance has slowed down; implementation is older and less performant than newer reactive solutions.
3. **Transloco (`@jsverse/transloco`)**:
   - _Pros_: Runtime switching, lazy loading, extensive plugin ecosystem, uses standard JSON files, excellent structural directive support (`*transloco`).
   - _Cons_: Third-party dependency.

## Decision

We chose **Option 3: Transloco**.

Transloco provides the best balance of flexibility and performance for our constraints. The ability to switch languages instantly without a reload is a key requirement for modern "app-like" experiences, which rules out the native Angular solution.

### Rationale

1. **Runtime Switching**: Users can toggle between English and Spanish instantly via the `LanguageSwitcherComponent`.
2. **Developer Experience**: Translations are stored in plain JSON files (`src/assets/i18n/en.json`), which are easy to merge and edit.
3. **Performance**: Transloco uses `OnPush` strategy by default and provides structural directives that minimize change detection cycles.
4. **Scoping**: We can lazy-load specific translation modules only when needed, keeping the initial load fast.

## Implementation

### Configuration

We configure Transloco using an HTTP loader to fetch JSON files.

```typescript
// src/app/core/i18n/transloco-http-loader.ts
export class TranslocoHttpLoader implements TranslocoLoader {
  private http = inject(HttpClient);
  getTranslation(lang: string) {
    return this.http.get<Translation>(`/assets/i18n/${lang}.json`);
  }
}
```

### Usage Pattern

We prioritize the structural directive for template cleanliness and performance.

```html
<!-- src/app/feature/example.component.html -->
<ng-container *transloco="let t">
  <h1>{{ t('feature.title') }}</h1>
  <p>{{ t('feature.description') }}</p>
</ng-container>
```

### Translation File Structure

```json
// src/assets/i18n/en.json
{
  "header": {
    "login": "Login",
    "logout": "Logout"
  },
  "modules": {
    "title": "Modules"
  }
}
```

## Consequences

### Positive

- **Dynamic**: Immediate feedback when changing languages.
- **Maintainable**: JSON is universally understood and easy to process with external translation tools.
- **Efficient**: Only the requested language file is downloaded.

### Negative

- **No Compile-time Safety**: Unlike Angular Native I18n, if a key is missing, it won't break the build; it will just show the key text at runtime (mitigated by "missing key" configuration in dev mode).
- **Bundle Size**: We must ship the translation library code in the main bundle (unlike native i18n which compiles away).

### Neutral

- **Industry Standard for SPAs**: Runtime i18n libraries like Transloco are the norm for applications requiring dynamic language switching.
- **Migration Path**: Moving from Transloco to native i18n would require significant refactoring, but the reverse migration (native to Transloco) is well-documented.

## References

- [Transloco Documentation](https://jsverse.github.io/transloco/)
- [Angular I18n Guide](https://angular.dev/guide/i18n)
