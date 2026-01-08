import { provideIcons } from '@ng-icons/core';
import {
  matCheckBox,
  matCheckBoxOutlineBlank,
  matIndeterminateCheckBox,
} from '@ng-icons/material-icons/baseline';
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
          [ICON_NAMES.CHECKBOX_UNCHECKED]: matCheckBoxOutlineBlank,
          [ICON_NAMES.CHECKBOX_CHECKED]: matCheckBox,
          [ICON_NAMES.CHECKBOX_INDETERMINATE]: matIndeterminateCheckBox,
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
          'Reusable checkmark component for checkbox states. Uses Material Design Icons for all three states: unchecked (outline), checked (filled), and indeterminate (partial fill). The icon is always visible and represents the checkbox visual itself.',
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
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <eb-checkbox-checkmark [checked]="checked" [indeterminate]="indeterminate" />
        <span style="color: var(--color-text);">Unchecked state</span>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Default unchecked state - displays the outline checkbox icon (matCheckBoxOutlineBlank).',
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
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <eb-checkbox-checkmark [checked]="checked" [indeterminate]="indeterminate" />
        <span style="color: var(--color-text);">Checked state</span>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Checked state - displays the filled checkbox icon (matCheckBox).',
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
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <eb-checkbox-checkmark [checked]="checked" [indeterminate]="indeterminate" />
        <span style="color: var(--color-text);">Indeterminate state</span>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Indeterminate state - displays the partial checkbox icon (matIndeterminateCheckBox). Used for "select all" scenarios.',
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
          <eb-checkbox-checkmark [checked]="false" [indeterminate]="false" />
          <p style="font-size: 12px; margin: 0.5rem 0 0; color: var(--color-text);">Unchecked</p>
        </div>

        <div style="text-align: center;">
          <eb-checkbox-checkmark [checked]="true" [indeterminate]="false" />
          <p style="font-size: 12px; margin: 0.5rem 0 0; color: var(--color-text);">Checked</p>
        </div>

        <div style="text-align: center;">
          <eb-checkbox-checkmark [checked]="false" [indeterminate]="true" />
          <p style="font-size: 12px; margin: 0.5rem 0 0; color: var(--color-text);">Indeterminate</p>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'All three states of the checkbox checkmark component side by side. Each state uses a distinct Material Design icon.',
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
        <eb-checkbox-checkmark [checked]="checked" [indeterminate]="indeterminate" />
        <p style="font-size: 12px; margin: 0.5rem 0 0; color: var(--color-text-brand, var(--color-text));">Both checked and indeterminate</p>
        <p style="font-size: 12px; margin: 0; color: var(--color-text-secondary);">(indeterminate takes precedence)</p>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'When both checked and indeterminate are true, indeterminate takes precedence and shows the indeterminate icon.',
      },
    },
  },
};

// Different Sizes (simulated with CSS)
export const DifferentSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 2rem; align-items: flex-end;">
        <div style="text-align: center;">
          <div style="width: 16px; height: 16px;">
            <eb-checkbox-checkmark [checked]="true" />
          </div>
          <p style="font-size: 12px; margin: 0.5rem 0 0;">Small (16px)</p>
        </div>

        <div style="text-align: center;">
          <div style="width: 20px; height: 20px;">
            <eb-checkbox-checkmark [checked]="true" />
          </div>
          <p style="font-size: 12px; margin: 0.5rem 0 0;">Medium (20px)</p>
        </div>

        <div style="text-align: center;">
          <div style="width: 24px; height: 24px;">
            <eb-checkbox-checkmark [checked]="true" />
          </div>
          <p style="font-size: 12px; margin: 0.5rem 0 0;">Large (24px)</p>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The checkmark component adapts to its container size. The parent checkbox controls the size variant.',
      },
    },
  },
};

// Icon Colors (via CSS custom properties)
export const IconColors: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 2rem; align-items: center;">
        <div style="text-align: center;">
          <div style="--checkbox-icon-color: var(--color-text-muted);">
            <eb-checkbox-checkmark [checked]="false" />
          </div>
          <p style="font-size: 12px; margin: 0.5rem 0 0; color: var(--color-text);">Muted (unchecked)</p>
        </div>

        <div style="text-align: center;">
          <div style="--checkbox-icon-color: var(--color-primary);">
            <eb-checkbox-checkmark [checked]="true" />
          </div>
          <p style="font-size: 12px; margin: 0.5rem 0 0; color: var(--color-text);">Primary (checked)</p>
        </div>

        <div style="text-align: center;">
          <div style="--checkbox-icon-color: var(--color-success);">
            <eb-checkbox-checkmark [checked]="true" />
          </div>
          <p style="font-size: 12px; margin: 0.5rem 0 0; color: var(--color-text);">Success</p>
        </div>

        <div style="text-align: center;">
          <div style="--checkbox-icon-color: var(--color-warning);">
            <eb-checkbox-checkmark [checked]="true" />
          </div>
          <p style="font-size: 12px; margin: 0.5rem 0 0; color: var(--color-text);">Warning</p>
        </div>

        <div style="text-align: center;">
          <div style="--checkbox-icon-color: var(--color-error);">
            <eb-checkbox-checkmark [checked]="true" />
          </div>
          <p style="font-size: 12px; margin: 0.5rem 0 0; color: var(--color-text);">Error</p>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Icon color can be customized via the --checkbox-icon-color CSS custom property. This is controlled by the parent checkbox based on validation state.',
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
        <div style="margin-bottom: 1rem;">
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
