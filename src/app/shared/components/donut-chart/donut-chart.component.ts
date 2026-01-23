import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type DonutChartVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'error';
export type DonutChartSize = 'sm' | 'md' | 'lg';

/**
 * Reusable donut chart component using pure CSS conic-gradient.
 * Visualizes a percentage value with support for different sizes and theme colors.
 *
 * @example
 * ```html
 * <eb-donut-chart
 *   [value]="95"
 *   [total]="100"
 *   label="Performance"
 *   variant="success"
 *   size="md"
 * />
 * ```
 */
@Component({
  selector: 'eb-donut-chart',
  imports: [CommonModule],
  templateUrl: './donut-chart.component.html',
  styleUrl: './donut-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonutChartComponent {
  /**
   * Current value of the chart
   */
  readonly value = input.required<number>();

  /**
   * Total value (max) of the chart
   * Defaults to 100
   */
  readonly total = input<number>(100);

  /**
   * Label to display below the chart
   */
  readonly label = input<string | undefined>(undefined);

  /**
   * Visual variant (color)
   */
  readonly variant = input<DonutChartVariant>('primary');

  /**
   * Size of the chart
   * - sm: 64px
   * - md: 96px (default)
   * - lg: 128px
   */
  readonly size = input<DonutChartSize>('md');

  /**
   * Computed percentage for the chart circle (0-100)
   */
  readonly percentage = computed(() => {
    const val = this.value();
    const total = this.total();
    if (total === 0) return 0;
    return Math.min(100, Math.max(0, (val / total) * 100));
  });

  /**
   * Computed display text for the center value
   * Currently shows "Value" (e.g., 95)
   */
  readonly displayValue = computed(() => {
    return Math.round(this.value());
  });

  /**
   * Computed CSS style for the chart conic-gradient
   * Passes the percentage as a CSS variable
   */
  readonly chartStyle = computed(() => {
    return {
      '--percent': `${String(this.percentage())}%`,
    };
  });

  /**
   * Computed CSS classes for the component
   */
  readonly componentClasses = computed(() => {
    const classes = ['donut-chart'];
    classes.push(`donut-chart--${this.variant()}`);
    classes.push(`donut-chart--${this.size()}`);
    return classes.join(' ');
  });
}
