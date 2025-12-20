import { signal } from '@angular/core';

import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';

import { RadioComponent } from './radio.component';

const meta: Meta<RadioComponent> = {
  title: 'Shared/Radio',
  component: RadioComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [],
    }),
  ],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the radio button',
      table: {
        type: { summary: 'RadioSize' },
        defaultValue: { summary: 'md' },
      },
    },
    checked: {
      control: 'boolean',
      description: 'Whether the radio button is checked',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the radio button is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    required: {
      control: 'boolean',
      description: 'Whether the radio button is required',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    label: {
      control: 'text',
      description: 'Label text for the radio button',
    },
    helperText: {
      control: 'text',
      description: 'Helper text below the radio button',
    },
    validationState: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error'],
      description: 'Validation state of the radio button',
      table: {
        type: { summary: 'RadioValidationState' },
        defaultValue: { summary: 'default' },
      },
    },
    value: {
      control: 'text',
      description: 'Value attribute for the radio button (REQUIRED)',
    },
    name: {
      control: 'text',
      description: 'Name attribute for the radio group (REQUIRED)',
    },
    ariaLabel: {
      control: 'text',
      description: 'ARIA label for accessibility (REQUIRED)',
    },
    ariaDescribedBy: {
      control: 'text',
      description: 'ID of element describing the radio button',
    },
    ariaInvalid: {
      control: 'boolean',
      description: 'Whether the radio button is invalid',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Accessible radio button component following WCAG 2.1 AAA guidelines. Supports multiple sizes, validation states, and radio groups for mutually exclusive selections.',
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'label',
            enabled: true,
          },
          {
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
    },
  },
};

export default meta;
type Story = StoryObj<RadioComponent>;

export const Default: Story = {
  args: {
    label: 'Default radio button',
    name: 'default-group',
    value: 'default',
    ariaLabel: 'Default radio button',
    checked: false,
    disabled: false,
    required: false,
    size: 'md',
    validationState: 'default',
    helperText: '',
  },
};

export const Checked: Story = {
  args: {
    label: 'Checked radio button',
    name: 'checked-group',
    value: 'checked',
    ariaLabel: 'Checked radio button',
    checked: true,
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Radio with helper text',
    name: 'helper-group',
    value: 'helper',
    ariaLabel: 'Radio with helper text',
    helperText: 'This is some helpful information',
  },
};

export const Required: Story = {
  args: {
    label: 'Required radio button',
    name: 'required-group',
    value: 'required',
    ariaLabel: 'Required radio button',
    required: true,
    helperText: 'This field is required',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled radio button',
    name: 'disabled-group',
    value: 'disabled',
    ariaLabel: 'Disabled radio button',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: 'Disabled and checked',
    name: 'disabled-checked-group',
    value: 'disabled-checked',
    ariaLabel: 'Disabled and checked radio button',
    disabled: true,
    checked: true,
  },
};

export const SmallSize: Story = {
  args: {
    label: 'Small radio button',
    name: 'small-group',
    value: 'small',
    ariaLabel: 'Small radio button',
    size: 'sm',
  },
};

export const LargeSize: Story = {
  args: {
    label: 'Large radio button',
    name: 'large-group',
    value: 'large',
    ariaLabel: 'Large radio button',
    size: 'lg',
  },
};

export const SuccessState: Story = {
  args: {
    label: 'Success state',
    name: 'success-group',
    value: 'success',
    ariaLabel: 'Success state radio button',
    validationState: 'success',
    helperText: 'Your selection is valid',
    checked: true,
  },
};

export const WarningState: Story = {
  args: {
    label: 'Warning state',
    name: 'warning-group',
    value: 'warning',
    ariaLabel: 'Warning state radio button',
    validationState: 'warning',
    helperText: 'Please review your selection',
  },
};

export const ErrorState: Story = {
  args: {
    label: 'Error state',
    name: 'error-group',
    value: 'error',
    ariaLabel: 'Error state radio button',
    validationState: 'error',
    helperText: 'This field is required',
  },
};

export const RadioGroup: Story = {
  render: (args) => ({
    props: {
      ...args,
      selectedValue: signal('option2'),
      handleSelection: (_value: string) => {
        // Handle selection change
      },
    },
    template: `
      <div role="radiogroup" aria-label="Payment method selection" style="display: flex; flex-direction: column; gap: 1rem;">
        <h3 style="margin: 0 0 0.5rem 0; font-size: 1.125rem; font-weight: 600;">Select Payment Method</h3>

        <eb-radio
          label="Credit Card"
          name="payment-method"
          value="credit"
          [checked]="selectedValue() === 'credit'"
          (selected)="selectedValue.set($event); handleSelection($event)"
          ariaLabel="Credit Card"
          helperText="Visa, Mastercard, or American Express"
        />

        <eb-radio
          label="PayPal"
          name="payment-method"
          value="paypal"
          [checked]="selectedValue() === 'paypal'"
          (selected)="selectedValue.set($event); handleSelection($event)"
          ariaLabel="PayPal"
          helperText="Pay securely with your PayPal account"
        />

        <eb-radio
          label="Bank Transfer"
          name="payment-method"
          value="bank"
          [checked]="selectedValue() === 'bank'"
          (selected)="selectedValue.set($event); handleSelection($event)"
          ariaLabel="Bank Transfer"
          helperText="Direct transfer from your bank account"
        />

        <div style="margin-top: 1rem; padding: 1rem; background: var(--color-surface); border-radius: var(--border-radius); font-family: monospace;">
          Selected: {{ selectedValue() }}
        </div>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <eb-radio
          label="Small radio button"
          name="size-group"
          value="small"
          size="sm"
          ariaLabel="Small radio button"
        />
        <eb-radio
          label="Medium radio button"
          name="size-group"
          value="medium"
          size="md"
          ariaLabel="Medium radio button"
        />
        <eb-radio
          label="Large radio button"
          name="size-group"
          value="large"
          size="lg"
          ariaLabel="Large radio button"
        />
      </div>
    `,
  }),
};

export const ValidationStates: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <eb-radio
          label="Default state"
          name="validation-group"
          value="default"
          validationState="default"
          ariaLabel="Default state"
          helperText="No validation applied"
        />
        <eb-radio
          label="Success state"
          name="validation-group"
          value="success"
          validationState="success"
          [checked]="true"
          ariaLabel="Success state"
          helperText="Your selection is valid"
        />
        <eb-radio
          label="Warning state"
          name="validation-group"
          value="warning"
          validationState="warning"
          ariaLabel="Warning state"
          helperText="Please review your selection"
        />
        <eb-radio
          label="Error state"
          name="validation-group"
          value="error"
          validationState="error"
          ariaLabel="Error state"
          helperText="This option is invalid"
        />
      </div>
    `,
  }),
};

export const FormIntegration: Story = {
  render: (args) => ({
    props: {
      ...args,
      preferences: signal({
        notifications: 'email',
        theme: 'auto',
        privacy: 'private',
      }),
      handlePreferenceChange: (_key: string, _value: string) => {
        // Handle preference change
      },
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 2rem; max-width: 600px;">
        <div>
          <h3 style="margin: 0 0 1rem 0; font-size: 1.125rem; font-weight: 600;">Notification Preferences</h3>
          <div role="radiogroup" aria-label="Notification preferences" style="display: flex; flex-direction: column; gap: 0.75rem;">
            <eb-radio
              label="Email notifications"
              name="notifications"
              value="email"
              [checked]="preferences().notifications === 'email'"
              (selected)="preferences.update(p => ({ ...p, notifications: $event })); handlePreferenceChange('notifications', $event)"
              ariaLabel="Email notifications"
              helperText="Receive updates via email"
            />
            <eb-radio
              label="SMS notifications"
              name="notifications"
              value="sms"
              [checked]="preferences().notifications === 'sms'"
              (selected)="preferences.update(p => ({ ...p, notifications: $event })); handlePreferenceChange('notifications', $event)"
              ariaLabel="SMS notifications"
              helperText="Receive updates via text message"
            />
            <eb-radio
              label="No notifications"
              name="notifications"
              value="none"
              [checked]="preferences().notifications === 'none'"
              (selected)="preferences.update(p => ({ ...p, notifications: $event })); handlePreferenceChange('notifications', $event)"
              ariaLabel="No notifications"
              helperText="Don't send me any updates"
            />
          </div>
        </div>

        <div>
          <h3 style="margin: 0 0 1rem 0; font-size: 1.125rem; font-weight: 600;">Theme Preference</h3>
          <div role="radiogroup" aria-label="Theme preference" style="display: flex; flex-direction: column; gap: 0.75rem;">
            <eb-radio
              label="Light theme"
              name="theme"
              value="light"
              [checked]="preferences().theme === 'light'"
              (selected)="preferences.update(p => ({ ...p, theme: $event })); handlePreferenceChange('theme', $event)"
              ariaLabel="Light theme"
            />
            <eb-radio
              label="Dark theme"
              name="theme"
              value="dark"
              [checked]="preferences().theme === 'dark'"
              (selected)="preferences.update(p => ({ ...p, theme: $event })); handlePreferenceChange('theme', $event)"
              ariaLabel="Dark theme"
            />
            <eb-radio
              label="Auto (system preference)"
              name="theme"
              value="auto"
              [checked]="preferences().theme === 'auto'"
              (selected)="preferences.update(p => ({ ...p, theme: $event })); handlePreferenceChange('theme', $event)"
              ariaLabel="Auto theme based on system preference"
            />
          </div>
        </div>

        <div style="padding: 1rem; background: var(--color-surface); border-radius: var(--border-radius); font-family: monospace;">
          <div><strong>Current Preferences:</strong></div>
          <div>Notifications: {{ preferences().notifications }}</div>
          <div>Theme: {{ preferences().theme }}</div>
          <div>Privacy: {{ preferences().privacy }}</div>
        </div>
      </div>
    `,
  }),
};

export const AccessibilityDemo: Story = {
  render: () => ({
    template: `
      <div style="max-width: 600px;">
        <h3 style="margin: 0 0 1rem 0; font-size: 1.125rem; font-weight: 600;">Accessibility Features</h3>
        <div style="background: var(--color-surface); padding: 1.5rem; border-radius: var(--border-radius); margin-bottom: 1.5rem;">
          <h4 style="margin: 0 0 0.5rem 0; font-size: 1rem;">Keyboard Navigation:</h4>
          <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
            <li><kbd>Tab</kbd> - Navigate to radio group</li>
            <li><kbd>Arrow Keys</kbd> - Move between radio buttons in a group</li>
            <li><kbd>Space</kbd> - Select focused radio button</li>
          </ul>
          <h4 style="margin: 1rem 0 0.5rem 0; font-size: 1rem;">Screen Reader Support:</h4>
          <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
            <li>ARIA labels for all radio buttons</li>
            <li>Helper text linked via aria-describedby</li>
            <li>Invalid state announced via aria-invalid</li>
          </ul>
        </div>

        <div role="radiogroup" aria-label="Subscription plan selection" aria-required="true" style="display: flex; flex-direction: column; gap: 0.75rem;">
          <eb-radio
            label="Free Plan"
            name="plan"
            value="free"
            ariaLabel="Free Plan - No cost, basic features"
            helperText="No cost, basic features included"
            required
          />
          <eb-radio
            label="Pro Plan"
            name="plan"
            value="pro"
            ariaLabel="Pro Plan - $9.99 per month, all features"
            helperText="$9.99/month - All features included"
            required
          />
          <eb-radio
            label="Enterprise Plan"
            name="plan"
            value="enterprise"
            ariaLabel="Enterprise Plan - Custom pricing, dedicated support"
            helperText="Custom pricing - Dedicated support included"
            required
          />
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'This story demonstrates the accessibility features of the radio component, including keyboard navigation, ARIA attributes, and screen reader support.',
      },
    },
  },
};
