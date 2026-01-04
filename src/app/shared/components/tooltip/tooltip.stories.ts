import type { Meta, StoryObj } from '@storybook/angular';

import { TooltipDirective } from './tooltip.directive';

/**
 * # Tooltip Directive
 *
 * The Tooltip directive provides accessible contextual information on hover and focus.
 *
 * ## Features
 * - ✅ Shows on hover and keyboard focus
 * - ✅ Auto-positioning with smart fallback
 * - ✅ Customizable delays
 * - ✅ WCAG 2.1 AA compliant
 * - ✅ Signal-based reactive state
 * - ✅ Theme integration
 *
 * ## Usage
 * ```html
 * <button ebTooltip="Save your changes">Save</button>
 * ```
 */
const meta: Meta = {
  title: 'Shared/Tooltip',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'An accessible tooltip directive that displays contextual information on hover and keyboard focus.',
      },
    },
  },
};

export default meta;

/**
 * Default tooltip with top position
 */
export const Default: StoryObj = {
  render: () => ({
    template: `
      <div style="display: flex; justify-content: center; align-items: center; min-height: 200px;">
        <button
          ebTooltip="This is a helpful tooltip"
          style="padding: 12px 24px; background: var(--color-primary); color: var(--color-on-primary); border: none; border-radius: 6px; cursor: pointer;"
        >
          Hover me
        </button>
      </div>
    `,
    moduleMetadata: {
      imports: [TooltipDirective],
    },
  }),
};

/**
 * Tooltip with top position
 */
export const TopPosition: StoryObj = {
  render: () => ({
    template: `
      <div style="display: flex; justify-content: center; align-items: center; min-height: 200px;">
        <button
          ebTooltip="Tooltip positioned on top"
          tooltipPosition="top"
          style="padding: 12px 24px; background: var(--color-primary); color: var(--color-on-primary); border: none; border-radius: 6px; cursor: pointer;"
        >
          Top Tooltip
        </button>
      </div>
    `,
    moduleMetadata: {
      imports: [TooltipDirective],
    },
  }),
};

/**
 * Tooltip with bottom position
 */
export const BottomPosition: StoryObj = {
  render: () => ({
    template: `
      <div style="display: flex; justify-content: center; align-items: center; min-height: 200px;">
        <button
          ebTooltip="Tooltip positioned on bottom"
          tooltipPosition="bottom"
          style="padding: 12px 24px; background: var(--color-primary); color: var(--color-on-primary); border: none; border-radius: 6px; cursor: pointer;"
        >
          Bottom Tooltip
        </button>
      </div>
    `,
    moduleMetadata: {
      imports: [TooltipDirective],
    },
  }),
};

/**
 * Tooltip with left position
 */
export const LeftPosition: StoryObj = {
  render: () => ({
    template: `
      <div style="display: flex; justify-content: center; align-items: center; min-height: 200px;">
        <button
          ebTooltip="Tooltip positioned on left"
          tooltipPosition="left"
          style="padding: 12px 24px; background: var(--color-primary); color: var(--color-on-primary); border: none; border-radius: 6px; cursor: pointer;"
        >
          Left Tooltip
        </button>
      </div>
    `,
    moduleMetadata: {
      imports: [TooltipDirective],
    },
  }),
};

/**
 * Tooltip with right position
 */
export const RightPosition: StoryObj = {
  render: () => ({
    template: `
      <div style="display: flex; justify-content: center; align-items: center; min-height: 200px;">
        <button
          ebTooltip="Tooltip positioned on right"
          tooltipPosition="right"
          style="padding: 12px 24px; background: var(--color-primary); color: var(--color-on-primary); border: none; border-radius: 6px; cursor: pointer;"
        >
          Right Tooltip
        </button>
      </div>
    `,
    moduleMetadata: {
      imports: [TooltipDirective],
    },
  }),
};

/**
 * Tooltip with auto position (smart positioning based on available space)
 */
export const AutoPosition: StoryObj = {
  render: () => ({
    template: `
      <div style="display: flex; justify-content: center; align-items: center; min-height: 200px;">
        <button
          ebTooltip="Auto-positioned tooltip that adapts to available space"
          tooltipPosition="auto"
          style="padding: 12px 24px; background: var(--color-primary); color: var(--color-on-primary); border: none; border-radius: 6px; cursor: pointer;"
        >
          Auto Position
        </button>
      </div>
    `,
    moduleMetadata: {
      imports: [TooltipDirective],
    },
  }),
};

/**
 * All positions demo
 */
export const AllPositions: StoryObj = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 80px; padding: 80px; min-height: 400px;">
        <div style="display: flex; justify-content: center; align-items: center;">
          <button
            ebTooltip="Top position"
            tooltipPosition="top"
            style="padding: 12px 24px; background: var(--color-primary); color: var(--color-on-primary); border: none; border-radius: 6px; cursor: pointer;"
          >
            Top
          </button>
        </div>
        <div style="display: flex; justify-content: center; align-items: center;">
          <button
            ebTooltip="Right position"
            tooltipPosition="right"
            style="padding: 12px 24px; background: var(--color-primary); color: var(--color-on-primary); border: none; border-radius: 6px; cursor: pointer;"
          >
            Right
          </button>
        </div>
        <div style="display: flex; justify-content: center; align-items: center;">
          <button
            ebTooltip="Bottom position"
            tooltipPosition="bottom"
            style="padding: 12px 24px; background: var(--color-primary); color: var(--color-on-primary); border: none; border-radius: 6px; cursor: pointer;"
          >
            Bottom
          </button>
        </div>
        <div style="display: flex; justify-content: center; align-items: center;">
          <button
            ebTooltip="Left position"
            tooltipPosition="left"
            style="padding: 12px 24px; background: var(--color-primary); color: var(--color-on-primary); border: none; border-radius: 6px; cursor: pointer;"
          >
            Left
          </button>
        </div>
      </div>
    `,
    moduleMetadata: {
      imports: [TooltipDirective],
    },
  }),
};

/**
 * Long tooltip content
 */
export const LongContent: StoryObj = {
  render: () => ({
    template: `
      <div style="display: flex; justify-content: center; align-items: center; min-height: 200px;">
        <button
          ebTooltip="This is a much longer tooltip that contains more detailed information about the action you're about to perform. It wraps nicely within the max-width constraint."
          style="padding: 12px 24px; background: var(--color-primary); color: var(--color-on-primary); border: none; border-radius: 6px; cursor: pointer;"
        >
          Hover for long tooltip
        </button>
      </div>
    `,
    moduleMetadata: {
      imports: [TooltipDirective],
    },
  }),
};

/**
 * Custom show delay
 */
export const CustomShowDelay: StoryObj = {
  render: () => ({
    template: `
      <div style="display: flex; justify-content: center; align-items: center; min-height: 200px; gap: 24px;">
        <button
          ebTooltip="Quick tooltip (100ms)"
          [tooltipShowDelay]="100"
          style="padding: 12px 24px; background: var(--color-primary); color: var(--color-on-primary); border: none; border-radius: 6px; cursor: pointer;"
        >
          Fast (100ms)
        </button>
        <button
          ebTooltip="Default tooltip (200ms)"
          style="padding: 12px 24px; background: var(--color-primary); color: var(--color-on-primary); border: none; border-radius: 6px; cursor: pointer;"
        >
          Default (200ms)
        </button>
        <button
          ebTooltip="Slow tooltip (1000ms)"
          [tooltipShowDelay]="1000"
          style="padding: 12px 24px; background: var(--color-primary); color: var(--color-on-primary); border: none; border-radius: 6px; cursor: pointer;"
        >
          Slow (1000ms)
        </button>
      </div>
    `,
    moduleMetadata: {
      imports: [TooltipDirective],
    },
  }),
};

/**
 * Custom hide delay
 */
export const CustomHideDelay: StoryObj = {
  render: () => ({
    template: `
      <div style="display: flex; justify-content: center; align-items: center; min-height: 200px; gap: 24px;">
        <button
          ebTooltip="Instant hide"
          [tooltipHideDelay]="0"
          style="padding: 12px 24px; background: var(--color-primary); color: var(--color-on-primary); border: none; border-radius: 6px; cursor: pointer;"
        >
          Instant Hide
        </button>
        <button
          ebTooltip="Delayed hide (500ms)"
          [tooltipHideDelay]="500"
          style="padding: 12px 24px; background: var(--color-primary); color: var(--color-on-primary); border: none; border-radius: 6px; cursor: pointer;"
        >
          Delayed Hide
        </button>
      </div>
    `,
    moduleMetadata: {
      imports: [TooltipDirective],
    },
  }),
};

/**
 * Disabled tooltip
 */
export const Disabled: StoryObj = {
  render: () => ({
    template: `
      <div style="display: flex; justify-content: center; align-items: center; min-height: 200px; gap: 24px;">
        <button
          ebTooltip="This tooltip is enabled"
          style="padding: 12px 24px; background: var(--color-primary); color: var(--color-on-primary); border: none; border-radius: 6px; cursor: pointer;"
        >
          Enabled Tooltip
        </button>
        <button
          ebTooltip="This tooltip is disabled"
          [tooltipDisabled]="true"
          style="padding: 12px 24px; background: var(--color-secondary); color: var(--color-on-secondary); border: none; border-radius: 6px; cursor: not-allowed;"
        >
          Disabled Tooltip
        </button>
      </div>
    `,
    moduleMetadata: {
      imports: [TooltipDirective],
    },
  }),
};

/**
 * Different element types
 */
export const DifferentElements: StoryObj = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; padding: 80px; align-items: center;">
        <button
          ebTooltip="Tooltip on a button"
          style="padding: 12px 24px; background: var(--color-primary); color: var(--color-on-primary); border: none; border-radius: 6px; cursor: pointer;"
        >
          Button with tooltip
        </button>

        <span
          tabindex="0"
          role="button"
          ebTooltip="Tooltip on inline text"
          style="padding: 8px 12px; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 4px; cursor: help;"
        >
          Hover over this text
        </span>

        <div
          tabindex="0"
          role="button"
          ebTooltip="Tooltip on a div element"
          style="padding: 16px; background: var(--color-surface-hover); border-radius: 8px; cursor: pointer; width: 200px; text-align: center;"
        >
          Div with tooltip
        </div>

        <input
          type="text"
          ebTooltip="Enter your name here"
          placeholder="Hover me"
          style="padding: 12px; border: 1px solid var(--color-border); border-radius: 6px; width: 200px;"
        />

        <a
          href="#"
          ebTooltip="This is a link with helpful context"
          style="color: var(--color-primary); text-decoration: underline;"
        >
          Link with tooltip
        </a>
      </div>
    `,
    moduleMetadata: {
      imports: [TooltipDirective],
    },
  }),
};

/**
 * Accessibility demonstration (keyboard navigation)
 */
export const Accessibility: StoryObj = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; padding: 80px; align-items: center;">
        <p style="margin-bottom: 16px; text-align: center; color: var(--color-text-secondary);">
          Use Tab to navigate between elements. Tooltips will appear on focus.
        </p>
        <button
          ebTooltip="First button tooltip - shows on focus"
          style="padding: 12px 24px; background: var(--color-primary); color: var(--color-on-primary); border: none; border-radius: 6px; cursor: pointer;"
        >
          First Button
        </button>
        <button
          ebTooltip="Second button tooltip - also keyboard accessible"
          style="padding: 12px 24px; background: var(--color-primary); color: var(--color-on-primary); border: none; border-radius: 6px; cursor: pointer;"
        >
          Second Button
        </button>
        <button
          ebTooltip="Third button tooltip - fully WCAG compliant"
          style="padding: 12px 24px; background: var(--color-primary); color: var(--color-on-primary); border: none; border-radius: 6px; cursor: pointer;"
        >
          Third Button
        </button>
      </div>
    `,
    moduleMetadata: {
      imports: [TooltipDirective],
    },
  }),
};
