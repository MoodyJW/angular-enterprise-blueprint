# Language Switcher Component

> **Last Updated**: January 2026
> **Status**: Production Ready
> **Test Coverage**: >90%

Dropdown component for switching the application's active language with persistence and keyboard navigation.

## Features

- ✅ **Two Variants**: Dropdown (compact) and Inline (button row)
- ✅ **Two Sizes**: Small (sm) and Medium (md)
- ✅ **Persistence**: Saves preference to localStorage
- ✅ **Keyboard Navigation**: Arrow keys, Enter, Escape support
- ✅ **i18n Integration**: Uses Transloco for translations
- ✅ **Accessible**: ARIA labels and keyboard support

## Usage

```html
<!-- Default dropdown -->
<eb-language-switcher />

<!-- Small size dropdown -->
<eb-language-switcher variant="dropdown" size="sm" />

<!-- Inline variant -->
<eb-language-switcher variant="inline" />
```

## API

### Inputs

| Input     | Type                     | Default      | Description           |
| --------- | ------------------------ | ------------ | --------------------- |
| `variant` | `'dropdown' \| 'inline'` | `'dropdown'` | Display variant       |
| `size`    | `'sm' \| 'md'`           | `'md'`       | Size of the component |

## Available Languages

Configured in `LANGUAGES` constant:

| Code | Native Name |
| ---- | ----------- |
| `en` | English     |
| `es` | Español     |

To add more languages, update `src/app/core/i18n/` configuration and the `LANGUAGES` array in this component.

## Service Integration

The component uses `TranslocoService` from `@jsverse/transloco`:

```typescript
// Programmatic language change
import { TranslocoService } from '@jsverse/transloco';

private transloco = inject(TranslocoService);

changeLanguage(code: string) {
  this.transloco.setActiveLang(code);
}
```

## Accessibility

- **Keyboard Navigation**:
  - `Enter`/`Space`: Open dropdown or select option
  - `Escape`: Close dropdown
  - `Tab`: Close dropdown and move focus
- **ARIA Labels**: Dynamic label announces current language
- **Focus Management**: Proper focus states for keyboard users

## Persistence

Language preference is stored in `localStorage` under `preferred-language` key and restored on page load.

## Storybook

```bash
npm run storybook
```

Navigate to `Shared/Language Switcher`.

## Architecture

```
language-switcher/
├── language-switcher.component.ts
├── language-switcher.component.html
├── language-switcher.component.scss
├── language-switcher.component.spec.ts
├── language-switcher.component.stories.ts
├── index.ts
└── README.md
```
