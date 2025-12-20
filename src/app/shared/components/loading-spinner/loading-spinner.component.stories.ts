import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, argsToTemplate } from '@storybook/angular';

import { LoadingSpinnerComponent } from './loading-spinner.component';

const meta: Meta<LoadingSpinnerComponent> = {
  title: 'Shared/LoadingSpinner',
  component: LoadingSpinnerComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [],
    }),
  ],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Size of the spinner',
      table: {
        type: { summary: 'SpinnerSize' },
        defaultValue: { summary: 'md' },
      },
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'light', 'dark'],
      description: 'Visual variant of the spinner',
      table: {
        type: { summary: 'SpinnerVariant' },
        defaultValue: { summary: 'primary' },
      },
    },
    ariaLabel: {
      control: 'text',
      description: 'ARIA label for the spinner (required for accessibility)',
      table: {
        type: { summary: 'string' },
      },
    },
    message: {
      control: 'text',
      description: 'Optional visible message below the spinner',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: 'undefined' },
      },
    },
    center: {
      control: 'boolean',
      description: 'Whether to center the spinner in its container',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    overlay: {
      control: 'boolean',
      description: 'Whether to overlay the spinner on top of content',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<LoadingSpinnerComponent>;

/**
 * Default loading spinner with medium size and primary variant
 */
export const Default: Story = {
  args: {
    ariaLabel: 'Loading content',
  },
  render: (args) => ({
    props: args,
    template: `<eb-loading-spinner ${argsToTemplate(args)} />`,
  }),
};

/**
 * All size variants of the loading spinner
 */
export const Sizes: Story = {
  args: {
    ariaLabel: 'Loading',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="display: flex; align-items: center; gap: 2rem; flex-wrap: wrap;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <eb-loading-spinner size="sm" ariaLabel="Small spinner" />
          <span style="font-size: 0.875rem; color: var(--color-text);">Small</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <eb-loading-spinner size="md" ariaLabel="Medium spinner" />
          <span style="font-size: 0.875rem; color: var(--color-text);">Medium</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <eb-loading-spinner size="lg" ariaLabel="Large spinner" />
          <span style="font-size: 0.875rem; color: var(--color-text);">Large</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <eb-loading-spinner size="xl" ariaLabel="Extra large spinner" />
          <span style="font-size: 0.875rem; color: var(--color-text);">Extra Large</span>
        </div>
      </div>
    `,
  }),
};

/**
 * All color variants of the loading spinner
 */
export const Variants: Story = {
  args: {
    ariaLabel: 'Loading',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="display: flex; align-items: center; gap: 2rem; flex-wrap: wrap;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <eb-loading-spinner variant="primary" ariaLabel="Primary spinner" />
          <span style="font-size: 0.875rem; color: var(--color-text);">Primary</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <eb-loading-spinner variant="secondary" ariaLabel="Secondary spinner" />
          <span style="font-size: 0.875rem; color: var(--color-text);">Secondary</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem; padding: 1rem; background: #333; border-radius: 8px;">
          <eb-loading-spinner variant="light" ariaLabel="Light spinner" />
          <span style="font-size: 0.875rem; color: #fff;">Light</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem; padding: 1rem; background: #f5f5f5; border-radius: 8px;">
          <eb-loading-spinner variant="dark" ariaLabel="Dark spinner" />
          <span style="font-size: 0.875rem; color: #333;">Dark</span>
        </div>
      </div>
    `,
  }),
};

/**
 * Spinner with a visible message
 */
export const WithMessage: Story = {
  args: {
    ariaLabel: 'Loading user data',
    message: 'Please wait while we load your data...',
  },
  render: (args) => ({
    props: args,
    template: `<eb-loading-spinner ${argsToTemplate(args)} />`,
  }),
};

/**
 * Centered spinner in a container
 */
export const Centered: Story = {
  args: {
    ariaLabel: 'Loading content',
    center: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="border: 2px dashed var(--color-border); border-radius: 8px; min-height: 200px;">
        <eb-loading-spinner ${argsToTemplate(args)} />
      </div>
    `,
  }),
};

/**
 * Centered spinner with message
 */
export const CenteredWithMessage: Story = {
  args: {
    ariaLabel: 'Loading dashboard',
    message: 'Loading your dashboard...',
    center: true,
    size: 'lg',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="border: 2px dashed var(--color-border); border-radius: 8px; min-height: 250px;">
        <eb-loading-spinner ${argsToTemplate(args)} />
      </div>
    `,
  }),
};

/**
 * Overlay spinner (full-screen loading)
 * Note: In this story, the overlay is contained within the story container
 */
export const Overlay: Story = {
  args: {
    ariaLabel: 'Loading application',
    overlay: true,
    size: 'lg',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="position: relative; height: 300px; background: var(--color-surface); border-radius: 8px; overflow: hidden;">
        <div style="padding: 2rem;">
          <h3 style="margin: 0 0 1rem 0; color: var(--color-text);">Page Content</h3>
          <p style="margin: 0; color: var(--color-text);">This content is behind the loading overlay.</p>
        </div>
        <eb-loading-spinner ${argsToTemplate(args)} />
      </div>
    `,
  }),
};

/**
 * Overlay spinner with message
 */
export const OverlayWithMessage: Story = {
  args: {
    ariaLabel: 'Processing request',
    message: 'Processing your request. This may take a moment...',
    overlay: true,
    size: 'xl',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="position: relative; height: 400px; background: var(--color-surface); border-radius: 8px; overflow: hidden;">
        <div style="padding: 2rem;">
          <h3 style="margin: 0 0 1rem 0; color: var(--color-text);">Application Interface</h3>
          <p style="margin: 0 0 1rem 0; color: var(--color-text);">Some content here that will be covered by the overlay.</p>
          <button style="padding: 0.5rem 1rem; border: 1px solid var(--color-border); border-radius: 4px; background: var(--color-background); color: var(--color-text);">
            Example Button
          </button>
        </div>
        <eb-loading-spinner ${argsToTemplate(args)} />
      </div>
    `,
  }),
};

/**
 * Small inline spinner (useful for buttons and small UI elements)
 */
export const InlineSmall: Story = {
  args: {
    ariaLabel: 'Loading',
    size: 'sm',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <eb-loading-spinner ${argsToTemplate(args)} />
        <span style="color: var(--color-text);">Loading...</span>
      </div>
    `,
  }),
};

/**
 * Use case: Loading in a button
 */
export const InButton: Story = {
  args: {
    ariaLabel: 'Submitting form',
    size: 'sm',
    variant: 'light',
  },
  render: (args) => ({
    props: args,
    template: `
      <button style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; border: none; border-radius: 4px; background: var(--color-primary); color: var(--color-background); font-size: 1rem; cursor: wait;">
        <eb-loading-spinner ${argsToTemplate(args)} />
        <span>Submitting...</span>
      </button>
    `,
  }),
};

/**
 * Use case: Loading in a card
 */
export const InCard: Story = {
  args: {
    ariaLabel: 'Loading card content',
    center: true,
    message: 'Loading content...',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="border: 1px solid var(--color-border); border-radius: 8px; padding: 2rem; background: var(--color-surface); box-shadow: var(--shadow-sm);">
        <eb-loading-spinner ${argsToTemplate(args)} />
      </div>
    `,
  }),
};

/**
 * Accessibility demonstration - with reduced motion
 * This story shows how the spinner respects the prefers-reduced-motion setting
 */
export const ReducedMotion: Story = {
  args: {
    ariaLabel: 'Loading with reduced motion',
    size: 'lg',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 2rem; background: var(--color-surface); border-radius: 8px;">
        <p style="margin: 0 0 1rem 0; color: var(--color-text); font-size: 0.875rem;">
          This spinner respects the <code>prefers-reduced-motion</code> setting.
          When reduced motion is enabled, the animation is simplified or disabled.
        </p>
        <div style="display: flex; justify-content: center;">
          <eb-loading-spinner ${argsToTemplate(args)} />
        </div>
      </div>
    `,
  }),
};
