import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Footer component for form inputs.
 * Displays helper text and character count.
 */
@Component({
  selector: 'eb-input-footer',
  imports: [CommonModule],
  templateUrl: './input-footer.component.html',
  styleUrl: './input-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputFooterComponent {
  /**
   * Optional helper text displayed under the input element.
   * Linked to the input via `aria-describedby` when present.
   */
  readonly helperText = input<string>('');

  /**
   * Computed ID used for the helper text element. Consumers can provide this
   * or rely on the parent input to compute and pass a stable id.
   */
  readonly helperTextId = input<string | undefined>(undefined);

  /**
   * CSS classes applied to the helper text element. Use BEM modifiers to style
   * different validation states (e.g. `input-helper-text--error`).
   */
  readonly helperTextClasses = input<string>('input-footer__helper-text');

  /**
   * When true, show a character count in the footer. Requires `maxLength` to be set.
   */
  readonly showCharCount = input<boolean>(false);

  /**
   * Maximum length used to compute and display the character count.
   */
  readonly maxLength = input<number | undefined>(undefined);

  /**
   * Precomputed character count text (e.g. `3/10`). Parent components may
   * supply this computed value or the footer can compute it from inputs.
   */
  readonly charCountText = input<string>('');

  /**
   * Internal computed flag used by the template to decide whether to render
   * the character count element.
   */
  readonly shouldShowCharCount = computed(
    () => this.showCharCount() && !(this.maxLength() == null),
  );
}
