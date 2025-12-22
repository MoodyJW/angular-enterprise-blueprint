import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';

import { CheckboxComponent } from './checkbox.component';

const meta: Meta<CheckboxComponent> = {
  title: 'Shared/Checkbox',
  component: CheckboxComponent,
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
      description: 'Size of the checkbox',
      table: {
        type: { summary: 'CheckboxSize' },
        defaultValue: { summary: 'md' },
      },
    },
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
      description: 'Whether the checkbox is in indeterminate state',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the checkbox is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    required: {
      control: 'boolean',
      description: 'Whether the checkbox is required',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    label: {
      control: 'text',
      description: 'Label text for the checkbox',
    },
    helperText: {
      control: 'text',
      description: 'Helper text below the checkbox',
    },
    validationState: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error'],
      description: 'Validation state of the checkbox',
      table: {
        type: { summary: 'CheckboxValidationState' },
        defaultValue: { summary: 'default' },
      },
    },
    value: {
      control: 'text',
      description: 'Value attribute for the checkbox',
    },
    name: {
      control: 'text',
      description: 'Name attribute for the checkbox',
    },
    ariaLabel: {
      control: 'text',
      description: 'ARIA label for accessibility (REQUIRED)',
    },
    ariaDescribedBy: {
      control: 'text',
      description: 'ID of element describing the checkbox',
    },
    ariaInvalid: {
      control: 'boolean',
      description: 'Whether the checkbox is invalid',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Accessible checkbox component following WCAG 2.1 AAA guidelines. Supports multiple sizes, validation states, and indeterminate state for "select all" scenarios.',
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
            id: 'label',
            enabled: true,
          },
        ],
      },
    },
  },
};

export default meta;
type Story = StoryObj<CheckboxComponent>;

// Default Checkbox
export const Default: Story = {
  args: {
    label: 'Accept terms and conditions',
    ariaLabel: 'Accept terms and conditions',
  },
};

// Checked State
export const Checked: Story = {
  args: {
    label: 'Already accepted',
    checked: true,
    ariaLabel: 'Already accepted',
  },
};

// Indeterminate State
export const Indeterminate: Story = {
  args: {
    label: 'Select all items (some selected)',
    indeterminate: true,
    ariaLabel: 'Select all items',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Indeterminate state is useful for "select all" checkboxes when some but not all items are selected.',
      },
    },
  },
};

// All Sizes
export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <eb-checkbox
          size="sm"
          label="Small checkbox"
          ariaLabel="Small checkbox"
        />
        <eb-checkbox
          size="md"
          label="Medium checkbox (default)"
          ariaLabel="Medium checkbox"
        />
        <eb-checkbox
          size="lg"
          label="Large checkbox"
          ariaLabel="Large checkbox"
        />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'All checkbox sizes: Small (16px), Medium (20px), Large (24px).',
      },
    },
  },
};

// With Helper Text
export const WithHelperText: Story = {
  args: {
    label: 'Subscribe to newsletter',
    helperText: 'Get weekly updates about new features',
    ariaLabel: 'Subscribe to newsletter',
  },
  parameters: {
    docs: {
      description: {
        story: 'Checkbox with helper text for additional context or instructions.',
      },
    },
  },
};

// Required Checkbox
export const Required: Story = {
  args: {
    label: 'I agree to the terms and conditions',
    required: true,
    helperText: 'You must accept to continue',
    ariaLabel: 'I agree to the terms and conditions',
  },
  parameters: {
    docs: {
      description: {
        story: 'Required checkbox shows an asterisk (*) next to the label.',
      },
    },
  },
};

// Validation States
export const ValidationStates: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <eb-checkbox
          label="Default state"
          validationState="default"
          helperText="No validation applied"
          ariaLabel="Default state"
        />
        <eb-checkbox
          label="Success state"
          validationState="success"
          checked="true"
          helperText="Your selection is valid"
          ariaLabel="Success state"
        />
        <eb-checkbox
          label="Warning state"
          validationState="warning"
          helperText="Please review your selection"
          ariaLabel="Warning state"
        />
        <eb-checkbox
          label="Error state"
          validationState="error"
          helperText="This field is required"
          ariaLabel="Error state"
        />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'All validation states with corresponding colors and helper text.',
      },
    },
  },
};

// Disabled States
export const DisabledStates: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <eb-checkbox
          label="Disabled unchecked"
          disabled="true"
          ariaLabel="Disabled unchecked"
        />
        <eb-checkbox
          label="Disabled checked"
          checked="true"
          disabled="true"
          ariaLabel="Disabled checked"
        />
        <eb-checkbox
          label="Disabled indeterminate"
          indeterminate="true"
          disabled="true"
          ariaLabel="Disabled indeterminate"
        />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Disabled checkboxes have reduced opacity and cannot be interacted with.',
      },
    },
  },
};

// Checkbox Group Example
export const CheckboxGroup: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        <h3 style="margin: 0 0 1rem 0; font-size: 16px; font-weight: 600;">Select your interests</h3>
        <eb-checkbox
          label="Web Development"
          name="interests"
          value="web"
          ariaLabel="Web Development"
        />
        <eb-checkbox
          label="Mobile Development"
          name="interests"
          value="mobile"
          ariaLabel="Mobile Development"
        />
        <eb-checkbox
          label="Cloud Computing"
          name="interests"
          value="cloud"
          ariaLabel="Cloud Computing"
        />
        <eb-checkbox
          label="Machine Learning"
          name="interests"
          value="ml"
          ariaLabel="Machine Learning"
        />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Multiple checkboxes in a group for selecting multiple options.',
      },
    },
  },
};

// Select All Pattern
export const SelectAllPattern: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        <eb-checkbox
          label="Select all items"
          indeterminate="true"
          size="md"
          ariaLabel="Select all items"
          style="font-weight: 600; border-bottom: 1px solid var(--color-border); padding-bottom: 0.5rem; margin-bottom: 0.5rem;"
        />
        <div style="padding-left: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem;">
          <eb-checkbox
            label="Item 1"
            checked="true"
            ariaLabel="Item 1"
          />
          <eb-checkbox
            label="Item 2"
            checked="true"
            ariaLabel="Item 2"
          />
          <eb-checkbox
            label="Item 3"
            ariaLabel="Item 3"
          />
          <eb-checkbox
            label="Item 4"
            ariaLabel="Item 4"
          />
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Common "select all" pattern where the parent checkbox shows indeterminate state when some (but not all) children are selected.',
      },
    },
  },
};

// Without Label (Icon Only)
export const WithoutLabel: Story = {
  args: {
    label: '',
    ariaLabel: 'Toggle selection',
    helperText: 'Note: ARIA label is required for accessibility',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Checkbox without visible label. ARIA label is required for screen reader accessibility.',
      },
    },
  },
};

// Interactive Example
export const Interactive: Story = {
  args: {
    label: 'I agree to the terms',
    size: 'md',
    checked: false,
    indeterminate: false,
    disabled: false,
    required: false,
    validationState: 'default',
    helperText: '',
    ariaLabel: 'I agree to the terms',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive checkbox - use the controls below to customize all properties.',
      },
    },
  },
};

// Keyboard Navigation Demo
export const KeyboardNavigation: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 400px;">
        <p style="font-size: 14px; color: var(--color-text-secondary);">
          <strong>Keyboard Navigation:</strong><br>
          • Press Tab to focus<br>
          • Press Space to toggle<br>
          • Focus ring visible on keyboard navigation
        </p>
        <eb-checkbox
          label="First checkbox"
          ariaLabel="First checkbox"
        />
        <eb-checkbox
          label="Second checkbox"
          ariaLabel="Second checkbox"
        />
        <eb-checkbox
          label="Third checkbox"
          ariaLabel="Third checkbox"
        />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates keyboard navigation support. Try tabbing through the checkboxes and using Space to toggle.',
      },
    },
  },
};

// Form Integration Example
export const FormIntegration: Story = {
  render: () => ({
    template: `
      <form style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 500px; padding: 1.5rem; border: 1px solid var(--color-border); border-radius: var(--border-radius-md);">
        <h3 style="margin: 0; font-size: 18px; font-weight: 600;">Account Settings</h3>

        <eb-checkbox
          label="Email notifications"
          name="email_notifications"
          value="enabled"
          checked="true"
          helperText="Receive email updates about your account"
          ariaLabel="Email notifications"
        />

        <eb-checkbox
          label="Marketing communications"
          name="marketing"
          value="enabled"
          helperText="Receive promotional emails and special offers"
          ariaLabel="Marketing communications"
        />

        <eb-checkbox
          label="Two-factor authentication"
          name="2fa"
          value="enabled"
          validationState="success"
          checked="true"
          helperText="Recommended for enhanced security"
          ariaLabel="Two-factor authentication"
        />

        <eb-checkbox
          label="I agree to the terms and conditions"
          name="terms"
          value="agreed"
          required="true"
          validationState="error"
          helperText="You must accept the terms to continue"
          ariaLabel="I agree to the terms and conditions"
        />

        <button type="submit" style="padding: 0.75rem 1.5rem; background: var(--color-primary); color: white; border: none; border-radius: var(--border-radius-md); cursor: pointer;">
          Save Settings
        </button>
      </form>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Example of checkboxes integrated into a form with various states and configurations.',
      },
    },
  },
};

// Dark Theme Example
export const DarkTheme: Story = {
  args: {
    label: 'Dark theme checkbox',
    ariaLabel: 'Dark theme checkbox',
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        story: 'Checkbox component adapts to dark themes using CSS variables.',
      },
    },
  },
};
