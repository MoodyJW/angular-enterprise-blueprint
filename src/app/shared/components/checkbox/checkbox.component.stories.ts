import { provideIcons } from '@ng-icons/core';
import { heroCheck, heroMinus } from '@ng-icons/heroicons/outline';
import { ICON_NAMES } from '@shared/constants';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';

import { CheckboxComponent } from './checkbox.component';

const meta: Meta<CheckboxComponent> = {
  title: 'Shared/Checkbox',
  component: CheckboxComponent,
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
  args: {
    size: 'md',
    checked: false,
    indeterminate: false,
    disabled: false,
    required: false,
    label: '',
    helperText: '',
    validationState: 'default',
    value: '',
    name: '',
    ariaLabel: 'Checkbox',
    ariaDescribedBy: undefined,
    ariaInvalid: false,
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
  render: (args) => ({
    props: args,
    template: `
      <eb-checkbox
        [size]="size"
        [(checked)]="checked"
        [indeterminate]="indeterminate"
        [label]="label"
        [helperText]="helperText"
        [validationState]="validationState"
        [disabled]="disabled"
        [required]="required"
        [value]="value"
        [name]="name"
        [ariaLabel]="ariaLabel"
        [ariaDescribedBy]="ariaDescribedBy"
        [ariaInvalid]="ariaInvalid"
      />
    `,
  }),
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
    props: {
      smallChecked: false,
      mediumChecked: false,
      largeChecked: false,
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <eb-checkbox
          size="sm"
          label="Small checkbox"
          [(checked)]="smallChecked"
          ariaLabel="Small checkbox"
        />
        <eb-checkbox
          size="md"
          label="Medium checkbox (default)"
          [(checked)]="mediumChecked"
          ariaLabel="Medium checkbox"
        />
        <eb-checkbox
          size="lg"
          label="Large checkbox"
          [(checked)]="largeChecked"
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
    props: {
      web: false,
      mobile: false,
      cloud: false,
      ml: false,
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        <h3 style="margin: 0 0 1rem 0; font-size: 16px; font-weight: 600;">Select your interests</h3>
        <eb-checkbox
          label="Web Development"
          name="interests"
          value="web"
          [(checked)]="web"
          ariaLabel="Web Development"
        />
        <eb-checkbox
          label="Mobile Development"
          name="interests"
          value="mobile"
          [(checked)]="mobile"
          ariaLabel="Mobile Development"
        />
        <eb-checkbox
          label="Cloud Computing"
          name="interests"
          value="cloud"
          [(checked)]="cloud"
          ariaLabel="Cloud Computing"
        />
        <eb-checkbox
          label="Machine Learning"
          name="interests"
          value="ml"
          [(checked)]="ml"
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
    props: {
      item1: true,
      item2: true,
      item3: false,
      item4: false,
      toggleAll(checked: boolean): void {
        this['item1'] = checked;
        this['item2'] = checked;
        this['item3'] = checked;
        this['item4'] = checked;
      },
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        <p style="font-size: 12px; color: var(--color-text-secondary); margin: 0;">
          Click "Select all" to toggle all items, or click individual items
        </p>
        <eb-checkbox
          label="Select all items"
          [checked]="item1 && item2 && item3 && item4"
          [indeterminate]="(item1 || item2 || item3 || item4) && !(item1 && item2 && item3 && item4)"
          (checkedChange)="toggleAll($event)"
          size="md"
          ariaLabel="Select all items"
          style="font-weight: 600; border-bottom: 1px solid var(--color-border); padding-bottom: 0.5rem; margin-bottom: 0.5rem;"
        />
        <div style="padding-left: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem;">
          <eb-checkbox
            label="Item 1"
            [(checked)]="item1"
            ariaLabel="Item 1"
          />
          <eb-checkbox
            label="Item 2"
            [(checked)]="item2"
            ariaLabel="Item 2"
          />
          <eb-checkbox
            label="Item 3"
            [(checked)]="item3"
            ariaLabel="Item 3"
          />
          <eb-checkbox
            label="Item 4"
            [(checked)]="item4"
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
          'Common "select all" pattern where the parent checkbox shows indeterminate state when some (but not all) children are selected. Click "Select all" to toggle all items.',
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

// Keyboard Navigation Demo
export const KeyboardNavigation: Story = {
  render: () => ({
    props: {
      check1: false,
      check2: false,
      check3: false,
    },
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
          [(checked)]="check1"
          ariaLabel="First checkbox"
        />
        <eb-checkbox
          label="Second checkbox"
          [(checked)]="check2"
          ariaLabel="Second checkbox"
        />
        <eb-checkbox
          label="Third checkbox"
          [(checked)]="check3"
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
    props: {
      emailNotifications: true,
      marketing: false,
      twoFactor: true,
      terms: false,
      saveSettings: (event: Event) => {
        event.preventDefault();
        alert('Settings saved! (Form submission prevented)');
      },
    },
    template: `
      <form 
        (submit)="saveSettings($event)"
        style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 500px; padding: 1.5rem; border: 1px solid var(--color-border); border-radius: var(--border-radius-md);"
      >
        <h3 style="margin: 0; font-size: 18px; font-weight: 600;">Account Settings</h3>

        <eb-checkbox
          label="Email notifications"
          name="email_notifications"
          value="enabled"
          [(checked)]="emailNotifications"
          helperText="Receive email updates about your account"
          ariaLabel="Email notifications"
        />

        <eb-checkbox
          label="Marketing communications"
          name="marketing"
          value="enabled"
          [(checked)]="marketing"
          helperText="Receive promotional emails and special offers"
          ariaLabel="Marketing communications"
        />

        <eb-checkbox
          label="Two-factor authentication"
          name="2fa"
          value="enabled"
          validationState="success"
          [(checked)]="twoFactor"
          helperText="Recommended for enhanced security"
          ariaLabel="Two-factor authentication"
        />

        <eb-checkbox
          label="I agree to the terms and conditions"
          name="terms"
          value="agreed"
          required="true"
          validationState="error"
          [(checked)]="terms"
          helperText="You must accept the terms to continue"
          ariaLabel="I agree to the terms and conditions"
        />

        <button type="submit" style="padding: 0.75rem 1.5rem; background: var(--color-primary); color: var(--color-on-primary); border: none; border-radius: var(--border-radius-md); cursor: pointer;">
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
