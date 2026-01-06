# Contact Feature

The Contact feature module provides "Hire Me" lead generation functionality with form submission and rate limiting.

## Components

### Contact Component (`eb-contact`)

Lead generation contact form with real email submission via Formspree.

- **Route**: `/contact`
- **Features**:
  - Reactive form with client-side validation
  - Server-side error handling
  - Rate limiting with cooldown timer
  - Honeypot field for bot prevention
  - Toast notifications for feedback
  - Accessible form controls

## State Management

Uses `ContactStore` (SignalStore) for managing:

- Form submission state
- Server-side validation errors
- Rate limit cooldown
- Success/error states

## Services

### ContactService

Handles form submission to Formspree:

- Email delivery via Formspree API
- Rate limiting with localStorage persistence
- Cooldown timer management

## Internationalization (i18n)

Translation keys are located in `src/assets/i18n/en.json` under the `contact` namespace.

## Testing

Run unit tests:

```bash
npm run test -- --include 'src/app/features/contact/**/*.spec.ts'
```
