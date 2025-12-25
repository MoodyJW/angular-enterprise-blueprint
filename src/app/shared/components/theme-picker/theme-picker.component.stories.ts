import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, argsToTemplate } from '@storybook/angular';

import { ThemePickerComponent } from './theme-picker.component';

const meta: Meta<ThemePickerComponent> = {
  title: 'Shared/ThemePicker',
  component: ThemePickerComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [],
    }),
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: ['dropdown', 'grid', 'inline'],
      description: 'Display variant of the theme picker',
      table: {
        type: { summary: 'ThemePickerVariant' },
        defaultValue: { summary: 'dropdown' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the theme picker',
      table: {
        type: { summary: 'ThemePickerSize' },
        defaultValue: { summary: 'md' },
      },
    },
    showLabels: {
      control: 'boolean',
      description: 'Whether to show theme labels',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    groupByCategory: {
      control: 'boolean',
      description: 'Whether to group themes by category (light, dark, high contrast)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    ariaLabel: {
      control: 'text',
      description: 'ARIA label for accessibility',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Select theme' },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Accessible theme picker component for switching between application themes. Supports dropdown, grid, and inline variants with full keyboard navigation and WCAG AAA compliance.',
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
            id: 'aria-required-attr',
            enabled: true,
          },
        ],
      },
    },
  },
};

export default meta;
type Story = StoryObj<ThemePickerComponent>;

// Default Dropdown
export const Default: Story = {
  render: () => ({
    template: `
      <div style="padding: 20px;">
        <eb-theme-picker />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Default dropdown variant of the theme picker.',
      },
    },
  },
};

// Grid Variant
export const GridVariant: Story = {
  render: () => ({
    template: `
      <div style="padding: 20px; max-width: 400px;">
        <h4 style="margin: 0 0 16px 0; font-size: 14px; color: var(--color-text-secondary);">Choose a theme</h4>
        <eb-theme-picker variant="grid" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Grid variant showing all themes as selectable swatches with labels.',
      },
    },
  },
};

// Inline Variant
export const InlineVariant: Story = {
  render: () => ({
    template: `
      <div style="padding: 20px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 14px; color: var(--color-text-secondary);">Theme:</span>
          <eb-theme-picker variant="inline" />
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Inline variant for compact theme selection, ideal for settings bars or headers.',
      },
    },
  },
};

// All Variants Comparison
export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; padding: 20px;">
        <div>
          <h4 style="margin: 0 0 12px 0; font-size: 14px; color: var(--color-text-secondary);">Dropdown</h4>
          <eb-theme-picker variant="dropdown" />
        </div>

        <div>
          <h4 style="margin: 0 0 12px 0; font-size: 14px; color: var(--color-text-secondary);">Grid</h4>
          <eb-theme-picker variant="grid" />
        </div>

        <div>
          <h4 style="margin: 0 0 12px 0; font-size: 14px; color: var(--color-text-secondary);">Inline</h4>
          <eb-theme-picker variant="inline" />
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all three theme picker variants.',
      },
    },
  },
};

// All Sizes
export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; padding: 20px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="width: 80px; font-size: 14px; color: var(--color-text-secondary);">Small:</span>
          <eb-theme-picker size="sm" />
        </div>

        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="width: 80px; font-size: 14px; color: var(--color-text-secondary);">Medium:</span>
          <eb-theme-picker size="md" />
        </div>

        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="width: 80px; font-size: 14px; color: var(--color-text-secondary);">Large:</span>
          <eb-theme-picker size="lg" />
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'All available sizes of the theme picker.',
      },
    },
  },
};

// Grouped by Category
export const GroupedByCategory: Story = {
  render: () => ({
    template: `
      <div style="padding: 20px;">
        <p style="margin: 0 0 12px 0; font-size: 14px; color: var(--color-text-secondary);">
          Click to open dropdown with grouped themes:
        </p>
        <eb-theme-picker [groupByCategory]="true" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Dropdown with themes grouped by category (Light, Dark, High Contrast).',
      },
    },
  },
};

// Without Labels
export const WithoutLabels: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; padding: 20px;">
        <div>
          <h4 style="margin: 0 0 12px 0; font-size: 14px; color: var(--color-text-secondary);">Grid without labels</h4>
          <eb-theme-picker variant="grid" [showLabels]="false" />
        </div>

        <div>
          <h4 style="margin: 0 0 12px 0; font-size: 14px; color: var(--color-text-secondary);">Inline (always without labels)</h4>
          <eb-theme-picker variant="inline" />
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Theme pickers without visible labels (relies on aria-label for accessibility).',
      },
    },
  },
};

// In Header Context
export const InHeaderContext: Story = {
  render: () => ({
    template: `
      <header style="display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; background: var(--color-surface); border-bottom: 1px solid var(--color-border);">
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 20px; font-weight: 600; color: var(--color-text);">My App</span>
        </div>

        <div style="display: flex; align-items: center; gap: 16px;">
          <nav style="display: flex; gap: 16px;">
            <a href="#" style="color: var(--color-text-secondary); text-decoration: none;">Dashboard</a>
            <a href="#" style="color: var(--color-text-secondary); text-decoration: none;">Settings</a>
          </nav>
          <eb-theme-picker size="sm" />
        </div>
      </header>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Theme picker integrated into a typical application header.',
      },
    },
  },
};

// In Settings Panel
export const InSettingsPanel: Story = {
  render: () => ({
    template: `
      <div style="max-width: 600px; padding: 24px; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 8px;">
        <h3 style="margin: 0 0 24px 0; font-size: 18px; color: var(--color-text);">Appearance Settings</h3>

        <div style="display: flex; flex-direction: column; gap: 24px;">
          <div>
            <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: var(--color-text);">
              Theme
            </label>
            <p style="margin: 0 0 12px 0; font-size: 13px; color: var(--color-text-secondary);">
              Choose a color theme for the application interface.
            </p>
            <eb-theme-picker variant="grid" />
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Theme picker in a settings panel context with grid layout.',
      },
    },
  },
};

// Accessibility Demo
export const AccessibilityDemo: Story = {
  render: () => ({
    template: `
      <div style="max-width: 600px; padding: 20px;">
        <h4 style="margin: 0 0 16px 0;">Accessibility Features</h4>
        <ul style="font-size: 14px; line-height: 1.8; color: var(--color-text-secondary); margin: 0 0 24px 0; padding-left: 20px;">
          <li><strong>ARIA Labels:</strong> All variants include proper aria-label attributes</li>
          <li><strong>Role:</strong> Uses listbox/radiogroup roles for semantic meaning</li>
          <li><strong>Keyboard Navigation:</strong> Full support for arrow keys, Enter, Escape</li>
          <li><strong>Focus Management:</strong> Visible focus indicators and focus trapping</li>
          <li><strong>Screen Reader:</strong> Announces current theme and changes</li>
        </ul>

        <h5 style="margin: 0 0 12px 0; font-size: 14px;">Keyboard Controls:</h5>
        <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border: 1px solid var(--color-border);"><kbd>Enter</kbd> / <kbd>Space</kbd></td>
            <td style="padding: 8px; border: 1px solid var(--color-border);">Open dropdown / Select theme</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid var(--color-border);"><kbd>↑</kbd> / <kbd>↓</kbd></td>
            <td style="padding: 8px; border: 1px solid var(--color-border);">Navigate options</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid var(--color-border);"><kbd>Home</kbd> / <kbd>End</kbd></td>
            <td style="padding: 8px; border: 1px solid var(--color-border);">Jump to first/last option</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid var(--color-border);"><kbd>Escape</kbd></td>
            <td style="padding: 8px; border: 1px solid var(--color-border);">Close dropdown</td>
          </tr>
        </table>

        <div style="margin-top: 24px;">
          <eb-theme-picker ariaLabel="Select application theme" />
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates accessibility features including keyboard navigation and ARIA attributes.',
      },
    },
  },
};

// Interactive Example
export const Interactive: Story = {
  args: {
    variant: 'dropdown',
    size: 'md',
    showLabels: true,
    groupByCategory: false,
    ariaLabel: 'Select theme',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 20px;">
        <eb-theme-picker ${argsToTemplate(args)} />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Interactive theme picker - use the controls below to customize all properties.',
      },
    },
  },
};
