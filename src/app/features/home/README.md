# Home Feature

The Home feature module displays the main dashboard with system status, build metrics, and real-time visitor statistics.

## Components

### Home Component (`eb-home`)

The main dashboard component displaying enterprise application health.

- **Route**: `/` (default)
- **Features**:
  - System status cards with real-time metrics
  - Build health indicators (tests, coverage, bundle size)
  - Live visitor count simulation
  - Responsive grid layout

## State Management

Uses `DashboardStore` (SignalStore) for managing:

- Metrics data (build status, test coverage, bundle size)
- Live visitor count
- Loading states

## Services

### DashboardMetricsService

Fetches application metrics from `assets/data/metrics.json`:

- Build status
- Test coverage
- Bundle size
- Lighthouse scores

## Testing

Run unit tests:

```bash
npm run test -- --include 'src/app/features/home/**/*.spec.ts'
```
