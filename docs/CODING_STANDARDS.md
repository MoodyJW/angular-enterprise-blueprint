# 📏 Coding Standards & Best Practices

This document outlines the mandatory coding standards for the Angular Enterprise Blueprint.

## 1. Internationalization (I18n)

**All user-facing text must be internationalized.**

- **Tooling:** We use `@jsverse/transloco`.
- **Rule:** Never hardcode strings in templates.
- **Implementation:**
  - Add keys to `src/assets/i18n/en.json`.
  - Use the `TranslocoDirective` in templates: `<ng-container *transloco="let t">`.
  - Access strings via `t('scope.key')`.
- **Testing:** Use `TranslocoTestingModule` in unit tests.

### Example

**❌ Incorrect:**

```html
<button>Save Changes</button>
```

**✅ Correct:**

```html
<!-- en.json: { "common": { "save": "Save Changes" } } -->
<button *transloco="let t">{{ t('common.save') }}</button>
```
