# Donut Chart Component

A lightweight, accessible, and customizable donut chart component built with Angular and pure CSS (conic-gradients). It is designed to visualize percentage-based metrics such as test coverage, performance scores, or progress indicators.

## Features

- **Pure CSS Rendering**: Uses `conic-gradient` for high performance and sharp rendering at any size.
- **Configurable**: Supports custom values, totals, sizes, and color variants.
- **Accessible**: Implements ARIA roles and labels for screen readers.
- **Responsive**: Scales easily via the `size` input.
- **Themable**: Integrates with the application's design tokens (primary, success, warning, error).

## Usage

Import the `DonutChartComponent` into your component or module:

```typescript
import { DonutChartComponent } from '@shared/components/donut-chart/donut-chart.component';

@Component({
  imports: [DonutChartComponent],
  // ...
})
export class MyComponent {}
```

Use it in your template:

```html
<!-- Basic Usage -->
<eb-donut-chart [value]="75" label="Performance"></eb-donut-chart>

<!-- Customized -->
<eb-donut-chart
  [value]="98"
  [total]="100"
  label="Test Coverage"
  size="xl"
  variant="success"
></eb-donut-chart>
```

## API

### Inputs

| Input     | Type                                             | Default     | Description                                                  |
| :-------- | :----------------------------------------------- | :---------- | :----------------------------------------------------------- |
| `value`   | `number`                                         | `0`         | The current value to display.                                |
| `total`   | `number`                                         | `100`       | The total value (denominator). Used to calculate percentage. |
| `label`   | `string`                                         | `''`        | Label text displayed below the value (e.g., "Coverage").     |
| `size`    | `'sm' \| 'md' \| 'lg' \| 'xl'`                   | `'md'`      | Size of the chart.                                           |
| `variant` | `'primary' \| 'success' \| 'warning' \| 'error'` | `'primary'` | Color theme of the chart segment.                            |

## Accessibility

- **Role**: `img`
- **Label**: Automatically generates an `aria-label` in the format: `"{label}: {percentage}%"`.
- **Structure**: Uses a flat DOM structure to ensure proper reading order and focus management if needed.
