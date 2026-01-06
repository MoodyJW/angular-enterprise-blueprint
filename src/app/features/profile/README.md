# Profile Feature

The Profile feature module displays "The Architect" bio, GitHub statistics, and resume preview/download.

## Components

### Profile Component (`eb-profile`)

Main profile page displaying developer bio and statistics.

- **Route**: `/profile`
- **Features**:
  - Developer bio and information
  - GitHub statistics (repos, commits, contributions)
  - Tech stack badges
  - Resume preview modal
  - Resume download button

### ProfileStatsCard Component

Displays GitHub statistics in a styled card format.

## State Management

Uses `ProfileStore` (SignalStore) for managing:

- GitHub statistics data
- Loading/error states

## Services

### ProfileService

Fetches GitHub statistics from the GitHub API:

- Repository count
- Commit activity
- Contribution data

## Security

- Resume URL validation with whitelist pattern
- Safe resource URL handling for iframe embedding

## Internationalization (i18n)

Translation keys are located in `src/assets/i18n/en.json` under the `profile` namespace.

## Testing

Run unit tests:

```bash
npm run test -- --include 'src/app/features/profile/**/*.spec.ts'
```
