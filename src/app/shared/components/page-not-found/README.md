# Page Not Found Component

> **Last Updated**: January 2026
> **Status**: Production Ready
> **Test Coverage**: >90%

404 error page displayed when users navigate to an unknown route.

## Features

- ✅ **Internationalized**: All text uses Transloco for i18n
- ✅ **Navigation**: "Go Home" button to return to home page
- ✅ **Accessible**: Semantic HTML with proper heading structure
- ✅ **Themed**: Uses CSS variables for consistent styling

## Usage

Configure as the wildcard route in your routing module:

```typescript
// app.routes.ts
import { PageNotFoundComponent } from '@shared/components';

export const routes: Routes = [
  // ... other routes
  { path: '**', component: PageNotFoundComponent },
];
```

Or lazy-load:

```typescript
{
  path: '**',
  loadComponent: () => import('@shared/components/page-not-found').then(m => m.PageNotFoundComponent)
}
```

## Translations

Add the following keys to your translation files:

```json
{
  "pageNotFound": {
    "title": "Page Not Found",
    "message": "The page you're looking for doesn't exist.",
    "goHome": "Go Home"
  }
}
```

## Customization

The component uses the following CSS variables for styling:

- `--color-text`: Primary text color
- `--color-text-secondary`: Secondary message text
- `--color-primary`: Button color
- `--space-*`: Spacing scale

## Storybook

```bash
npm run storybook
```

Navigate to `Shared/Page Not Found`.

## Architecture

```
page-not-found/
├── page-not-found.component.ts
├── page-not-found.component.html
├── page-not-found.component.scss
├── page-not-found.component.spec.ts
├── page-not-found.component.stories.ts
├── index.ts
└── README.md
```
