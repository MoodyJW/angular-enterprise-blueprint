import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Reusable label component for form inputs
 *
 * This component provides a consistent label appearance across all form controls
 * including required indicators and proper ARIA associations.
 *
 * @example
 * ```html
 * <eb-input-label
 *   [forId]="inputId"
 *   [label]="'Email Address'"
 *   [required]="true"
 * />
 * ```
 */
@Component({
  selector: 'eb-input-label',
  imports: [CommonModule],
  template: `
    @if (label()) {
      <label [id]="id()" [for]="forId()" [class]="labelClass()">
        {{ label() }}
        @if (required()) {
          <span class="input-label__required" aria-hidden="true">*</span>
        }
      </label>
    }
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .input-label {
        display: block;
        margin-bottom: var(--space-1, 0.5rem);
        font-size: var(--font-size-sm, 0.875rem);
        font-weight: var(--font-weight-medium, 500);
        color: var(--color-text, #0f172a);
        line-height: 1.5;

        &__required {
          color: var(--color-error, #dc2626);
          margin-left: var(--space-1, 0.25rem);
          font-weight: var(--font-weight-semibold, 600);
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputLabelComponent {
  /**
   * The ID of the input element this label is for
   */
  readonly forId = input<string | undefined>(undefined);

  /**
   * The ID of the label element itself
   */
  readonly id = input<string | undefined>(undefined);

  /**
   * The label text to display
   */
  readonly label = input<string | undefined>(undefined);

  /**
   * Whether the field is required
   */
  readonly required = input<boolean>(false);

  /**
   * Additional CSS classes to apply to the label
   */
  readonly labelClass = input<string>('input-label');
}
