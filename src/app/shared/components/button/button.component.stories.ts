import { provideIcons } from '@ng-icons/core';
import * as heroIcons from '@ng-icons/heroicons/outline';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, argsToTemplate } from '@storybook/angular';

import { ICON_NAMES } from '@shared/constants';
import { ButtonComponent } from './button.component';

const meta: Meta<ButtonComponent> = {
  title: 'Shared/Button',
  component: ButtonComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [provideIcons(heroIcons)],
    }),
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'ghost', 'danger'],
      description: 'Visual variant of the button',
      table: {
        type: { summary: 'ButtonVariant' },
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the button',
      table: {
        type: { summary: 'ButtonSize' },
        defaultValue: { summary: 'md' },
      },
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: 'HTML button type attribute',
      table: {
        type: { summary: 'ButtonType' },
        defaultValue: { summary: 'button' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    loading: {
      control: 'boolean',
      description: 'Whether the button is in loading state',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the button takes full width',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    iconOnly: {
      control: 'boolean',
      description: 'Whether this is an icon-only button',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    iconLeft: {
      control: 'select',
      options: [undefined, ...Object.values(ICON_NAMES)],
      description: 'Icon identifier for left position',
    },
    iconRight: {
      control: 'select',
      options: [undefined, ...Object.values(ICON_NAMES)],
      description: 'Icon identifier for right position',
    },
    ariaLabel: {
      control: 'text',
      description: 'ARIA label for accessibility (REQUIRED)',
    },
    ariaDescribedBy: {
      control: 'text',
      description: 'ID of element describing the button',
    },
    ariaPressed: {
      control: 'boolean',
      description: 'Whether button is pressed (for toggle buttons)',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Accessible button component following WCAG 2.1 AAA guidelines. Supports multiple variants, sizes, loading states, and icon positioning.',
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'button-name',
            enabled: true,
          },
        ],
      },
    },
  },
};

export default meta;
type Story = StoryObj<ButtonComponent>;

// Primary Button
export const Primary: Story = {
  args: {
    variant: 'primary',
    ariaLabel: 'Primary action button',
  },
  render: (args) => ({
    props: args,
    template: `<eb-button ${argsToTemplate(args)}>Primary Button</eb-button>`,
  }),
};

// Secondary Button
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    ariaLabel: 'Secondary action button',
  },
  render: (args) => ({
    props: args,
    template: `<eb-button ${argsToTemplate(args)}>Secondary Button</eb-button>`,
  }),
};

// Tertiary Button
export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
    ariaLabel: 'Tertiary action button',
  },
  render: (args) => ({
    props: args,
    template: `<eb-button ${argsToTemplate(args)}>Tertiary Button</eb-button>`,
  }),
};

// Ghost Button
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    ariaLabel: 'Ghost action button',
  },
  render: (args) => ({
    props: args,
    template: `<eb-button ${argsToTemplate(args)}>Ghost Button</eb-button>`,
  }),
};

// Danger Button
export const Danger: Story = {
  args: {
    variant: 'danger',
    ariaLabel: 'Delete item',
  },
  render: (args) => ({
    props: args,
    template: `<eb-button ${argsToTemplate(args)}>Delete</eb-button>`,
  }),
};

// All Variants
export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
        <eb-button variant="primary" ariaLabel="Primary button">Primary</eb-button>
        <eb-button variant="secondary" ariaLabel="Secondary button">Secondary</eb-button>
        <eb-button variant="tertiary" ariaLabel="Tertiary button">Tertiary</eb-button>
        <eb-button variant="ghost" ariaLabel="Ghost button">Ghost</eb-button>
        <eb-button variant="danger" ariaLabel="Danger button">Danger</eb-button>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'All button variants displayed together for comparison.',
      },
    },
  },
};

// All Sizes
export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
        <eb-button size="sm" ariaLabel="Small button">Small</eb-button>
        <eb-button size="md" ariaLabel="Medium button">Medium</eb-button>
        <eb-button size="lg" ariaLabel="Large button">Large</eb-button>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'All button sizes: Small (32px), Medium (40px), Large (48px).',
      },
    },
  },
};

// With Icons
export const WithIcons: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
        <eb-button variant="primary" iconLeft="${ICON_NAMES.ARROW_LEFT}" ariaLabel="Go back">Back</eb-button>
        <eb-button variant="primary" iconRight="${ICON_NAMES.ARROW_RIGHT}" ariaLabel="Continue forward">Continue</eb-button>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Buttons with icons on left or right side of text.',
      },
    },
  },
};

// Icon Only Buttons
export const IconOnly: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
        <eb-button variant="ghost" [iconOnly]="true" size="sm" iconLeft="${ICON_NAMES.CLOSE}" ariaLabel="Close dialog"></eb-button>
        <eb-button variant="ghost" [iconOnly]="true" size="md" iconLeft="${ICON_NAMES.CLOSE}" ariaLabel="Close dialog"></eb-button>
        <eb-button variant="ghost" [iconOnly]="true" size="lg" iconLeft="${ICON_NAMES.CLOSE}" ariaLabel="Close dialog"></eb-button>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Icon-only buttons (square aspect ratio). ARIA label is required for accessibility.',
      },
    },
  },
};

// Loading State
export const LoadingStates: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
        <eb-button variant="primary" [loading]="true" ariaLabel="Saving changes">Saving...</eb-button>
        <eb-button variant="secondary" [loading]="true" ariaLabel="Loading content">Loading...</eb-button>
        <eb-button variant="danger" [loading]="true" ariaLabel="Deleting item">Deleting...</eb-button>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Buttons in loading state show a spinner and are disabled. Sets aria-busy="true".',
      },
    },
  },
};

// Disabled State
export const DisabledStates: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
        <eb-button variant="primary" [disabled]="true" ariaLabel="Submit form">Submit</eb-button>
        <eb-button variant="secondary" [disabled]="true" ariaLabel="Cancel action">Cancel</eb-button>
        <eb-button variant="danger" [disabled]="true" ariaLabel="Delete item">Delete</eb-button>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Disabled buttons have reduced opacity and cannot be clicked.',
      },
    },
  },
};

// Full Width
export const FullWidth: Story = {
  render: () => ({
    template: `
      <div style="max-width: 400px;">
        <eb-button variant="primary" [fullWidth]="true" ariaLabel="Sign up">Sign Up</eb-button>
        <br><br>
        <eb-button variant="secondary" [fullWidth]="true" ariaLabel="Cancel">Cancel</eb-button>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Full-width buttons take up 100% of their container width.',
      },
    },
  },
};

// Interactive Example
export const Interactive: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    fullWidth: false,
    iconOnly: false,
    ariaLabel: 'Click me',
  },
  render: (args) => ({
    props: args,
    template: `<eb-button ${argsToTemplate(args)}>Click Me</eb-button>`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Interactive button - use the controls below to customize all properties.',
      },
    },
  },
};

// Keyboard Navigation Demo
export const KeyboardNavigation: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 300px;">
        <p style="font-size: 14px; color: var(--color-text-secondary);">
          <strong>Keyboard Navigation:</strong><br>
          • Press Tab to focus<br>
          • Press Enter or Space to click<br>
          • Focus ring visible on keyboard navigation
        </p>
        <eb-button variant="primary" ariaLabel="First button">First Button</eb-button>
        <eb-button variant="secondary" ariaLabel="Second button">Second Button</eb-button>
        <eb-button variant="tertiary" ariaLabel="Third button">Third Button</eb-button>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates keyboard navigation support. Try tabbing through the buttons.',
      },
    },
  },
};
