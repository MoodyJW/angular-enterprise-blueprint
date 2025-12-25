# Auth Feature

The Auth feature module provides authentication functionalities, primarily the login page and integration with the core authentication state.

## Components

### Login Component (`eb-login`)

A standalone component that handles user sign-in.

- **Route**: `/auth/login`
- **Features**:
  - Reactive form with validation
  - Integration with `AuthStore`
  - Transloco i18n support
  - Toast notifications for feedback
  - Accessible form controls

## Internationalization (i18n)

Translation keys are located in `src/assets/i18n/en.json` under the `auth` namespace.

## State Management

Uses `AuthStore` (SignalStore) for managing:

- User state
- Authentication status
- Loading/Error states

## Testing

Run unit tests:

```bash
npm run test -- --include 'src/app/features/auth/**/*.spec.ts'
```

## Mock Credentials

- **Username**: `demo` or `admin`
- **Password**: Any string
