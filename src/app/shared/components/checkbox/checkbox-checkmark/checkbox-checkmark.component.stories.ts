import { provideIcons } from '@ng-icons/core';
import { heroCheck, heroMinus } from '@ng-icons/heroicons/outline';
import { ICON_NAMES } from '@shared/constants';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';

import { CheckboxCheckmarkComponent } from './checkbox-checkmark.component';

const meta: Meta<CheckboxCheckmarkComponent> = {
  title: 'Shared/Checkbox/CheckboxCheckmark',
  component: CheckboxCheckmarkComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [
        provideIcons({
          [ICON_NAMES.CHECK]: heroCheck,
          [ICON_NAMES.REMOVE]: heroMinus,
        }),
      ],
    }),
  ],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the checkbox is checked',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    indeterminate: {
      control: 'boolean',
      description: 'Whether the checkbox is in indeterminate state (takes precedence over checked)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Reusable checkmark component for checkbox states. Displays check icon when checked and minus icon when indeterminate. Uses the shared Icon component internally.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<CheckboxCheckmarkComponent>;

// Default (Unchecked)
export const Default: Story = {
  args: {
    checked: false,
    indeterminate: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="position: relative; width: 20px; height: 20px; background-color: var(--color-surface); border: 2px solid var(--color-border); border-radius: 4px;">
        <eb-checkbox-checkmark [checked]="checked" [indeterminate]="indeterminate" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Default unchecked state - no icon is displayed.',
      },
    },
  },
};

// Checked State
export const Checked: Story = {
  args: {
    checked: true,
    indeterminate: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="position: relative; width: 20px; height: 20px; background-color: var(--color-primary); border: 2px solid var(--color-primary); border-radius: 4px;">
        <eb-checkbox-checkmark [checked]="checked" [indeterminate]="indeterminate" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Checked state - displays a check icon (heroCheck).',
      },
    },
  },
};

// Indeterminate State
export const Indeterminate: Story = {
  args: {
    checked: false,
    indeterminate: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="position: relative; width: 20px; height: 20px; background-color: var(--color-primary); border: 2px solid var(--color-primary); border-radius: 4px;">
        <eb-checkbox-checkmark [checked]="checked" [indeterminate]="indeterminate" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Indeterminate state - displays a minus icon (heroMinus). Used for "select all" scenarios.',
      },
    },
  },
};

// All States
export const AllStates: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 2rem; align-items: center;">
        <div style="text-align: center;">
          <div style="position: relative; width: 20px; height: 20px; background-color: var(--color-surface); border: 2px solid var(--color-border); border-radius: 4px; margin-bottom: 0.5rem;">
            <eb-checkbox-checkmark [checked]="false" [indeterminate]="false" />
          </div>
          <p style="font-size: 12px; margin: 0; color: var(--color-text);">Unchecked</p>
        </div>

        <div style="text-align: center;">
          <div style="position: relative; width: 20px; height: 20px; background-color: var(--color-primary); border: 2px solid var(--color-primary); border-radius: 4px; margin-bottom: 0.5rem;">
            <eb-checkbox-checkmark [checked]="true" [indeterminate]="false" />
          </div>
          <p style="font-size: 12px; margin: 0; color: var(--color-text);">Checked</p>
        </div>

        <div style="text-align: center;">
          <div style="position: relative; width: 20px; height: 20px; background-color: var(--color-primary); border: 2px solid var(--color-primary); border-radius: 4px; margin-bottom: 0.5rem;">
            <eb-checkbox-checkmark [checked]="false" [indeterminate]="true" />
          </div>
          <p style="font-size: 12px; margin: 0; color: var(--color-text);">Indeterminate</p>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'All possible states of the checkbox checkmark component.',
      },
    },
  },
};

// Indeterminate Precedence
export const IndeterminatePrecedence: Story = {
  args: {
    checked: true,
    indeterminate: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="text-align: center;">
        <div style="position: relative; width: 20px; height: 20px; background-color: var(--color-primary); border: 2px solid var(--color-primary); border-radius: 4px; margin-bottom: 0.5rem;">
          <eb-checkbox-checkmark [checked]="checked" [indeterminate]="indeterminate" />
        </div>
        <p style="font-size: 12px; margin: 0; color: var(--color-text-brand, var(--color-text));">Both checked and indeterminate</p>
        <p style="font-size: 12px; margin: 0; color: var(--color-text-secondary);">(indeterminate takes precedence)</p>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'When both checked and indeterminate are true, indeterminate takes precedence and shows the minus icon.',
      },
    },
  },
};

// Different Sizes
export const DifferentSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 2rem; align-items: center;">
        <div style="text-align: center;">
          <div style="position: relative; width: 16px; height: 16px; background-color: #3b82f6; border: 2px solid #3b82f6; border-radius: 4px; margin-bottom: 0.5rem;">
            <eb-checkbox-checkmark [checked]="true" />
          </div>
          <p style="font-size: 12px; margin: 0;">Small (16px)</p>
        </div>

        <div style="text-align: center;">
          <div style="position: relative; width: 20px; height: 20px; background-color: #3b82f6; border: 2px solid #3b82f6; border-radius: 4px; margin-bottom: 0.5rem;">
            <eb-checkbox-checkmark [checked]="true" />
          </div>
          <p style="font-size: 12px; margin: 0;">Medium (20px)</p>
        </div>

        <div style="text-align: center;">
          <div style="position: relative; width: 24px; height: 24px; background-color: #3b82f6; border: 2px solid #3b82f6; border-radius: 4px; margin-bottom: 0.5rem;">
            <eb-checkbox-checkmark [checked]="true" />
          </div>
          <p style="font-size: 12px; margin: 0;">Large (24px)</p>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The checkmark component adapts to different checkbox sizes. The icon size is fixed at "sm" (16px) for optimal visibility.',
      },
    },
  },
};

// With Validation Colors
export const WithValidationColors: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 2rem; align-items: center;">
        <div style="text-align: center;">
          <div style="position: relative; width: 20px; height: 20px; background-color: var(--color-primary); border: 2px solid var(--color-primary); border-radius: 4px; margin-bottom: 0.5rem;">
            <eb-checkbox-checkmark [checked]="true" />
          </div>
          <p style="font-size: 12px; margin: 0; color: var(--color-text);">Default</p>
        </div>

        <div style="text-align: center;">
          <div style="position: relative; width: 20px; height: 20px; background-color: var(--color-success); border: 2px solid var(--color-success); border-radius: 4px; margin-bottom: 0.5rem;">
            <eb-checkbox-checkmark [checked]="true" />
          </div>
          <p style="font-size: 12px; margin: 0; color: var(--color-text);">Success</p>
        </div>

        <div style="text-align: center;">
          <div style="position: relative; width: 20px; height: 20px; background-color: var(--color-warning); border: 2px solid var(--color-warning); border-radius: 4px; margin-bottom: 0.5rem;">
            <eb-checkbox-checkmark [checked]="true" />
          </div>
          <p style="font-size: 12px; margin: 0; color: var(--color-text);">Warning</p>
        </div>

        <div style="text-align: center;">
          <div style="position: relative; width: 20px; height: 20px; background-color: var(--color-error); border: 2px solid var(--color-error); border-radius: 4px; margin-bottom: 0.5rem;">
            <eb-checkbox-checkmark [checked]="true" />
          </div>
          <p style="font-size: 12px; margin: 0; color: var(--color-text);">Error</p>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The checkmark component works with different validation state colors from the parent checkbox.',
      },
    },
  },
};

// Interactive Example
export const Interactive: Story = {
  args: {
    checked: false,
    indeterminate: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="text-align: center;">
        <div style="position: relative; width: 20px; height: 20px; background-color: ${args.checked || args.indeterminate ? 'var(--color-primary)' : 'var(--color-surface)'}; border: 2px solid ${args.checked || args.indeterminate ? 'var(--color-primary)' : 'var(--color-border)'}; border-radius: 4px; margin: 0 auto 1rem;">
          <eb-checkbox-checkmark [checked]="checked" [indeterminate]="indeterminate" />
        </div>
        <p style="font-size: 14px; margin: 0; color: var(--color-text);">Use the controls below to toggle states</p>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Interactive example - use the controls below to toggle between states.',
      },
    },
  },
};
