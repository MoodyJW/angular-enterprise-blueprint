import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';

import { InputComponent } from './input.component';

const meta: Meta<InputComponent> = {
  title: 'Shared/Input',
  component: InputComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [],
    }),
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'filled', 'outlined'],
      description: 'Visual variant of the input',
      table: {
        type: { summary: 'InputVariant' },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the input',
      table: {
        type: { summary: 'InputSize' },
        defaultValue: { summary: 'md' },
      },
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'tel', 'url', 'search', 'number'],
      description: 'HTML input type attribute',
      table: {
        type: { summary: 'InputType' },
        defaultValue: { summary: 'text' },
      },
    },
    validationState: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error'],
      description: 'Validation state of the input',
      table: {
        type: { summary: 'InputValidationState' },
        defaultValue: { summary: 'default' },
      },
    },
    value: {
      control: 'text',
      description: 'Current value of the input',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    label: {
      control: 'text',
      description: 'Label text displayed above the input',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text shown when input is empty',
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below the input',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    readonly: {
      control: 'boolean',
      description: 'Whether the input is readonly',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    required: {
      control: 'boolean',
      description: 'Whether the input is required',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the input takes full width',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    maxLength: {
      control: 'number',
      description: 'Maximum length of input value',
    },
    minLength: {
      control: 'number',
      description: 'Minimum length of input value',
    },
    pattern: {
      control: 'text',
      description: 'Pattern for input validation (regex)',
    },
    autocomplete: {
      control: 'text',
      description: 'Autocomplete attribute value',
    },
    prefix: {
      control: 'text',
      description: 'Text or icon displayed before the input',
    },
    suffix: {
      control: 'text',
      description: 'Text or icon displayed after the input',
    },
    showCharCount: {
      control: 'boolean',
      description: 'Whether to show character count',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    ariaLabel: {
      control: 'text',
      description: 'ARIA label for accessibility (REQUIRED)',
    },
    ariaDescribedBy: {
      control: 'text',
      description: 'ID of element describing the input',
    },
    ariaInvalid: {
      control: 'boolean',
      description: 'Whether the input value is invalid',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Accessible input component following WCAG 2.1 AAA guidelines. Supports multiple variants, validation states, prefix/suffix, character count, and comprehensive form features.',
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
type Story = StoryObj<InputComponent>;

/**
 * Default input with basic configuration
 */
export const Default: Story = {
  args: {
    ariaLabel: 'Default input',
    placeholder: 'Enter text...',
  },
};

/**
 * Input with label and helper text
 */
export const WithLabel: Story = {
  args: {
    label: 'Username',
    ariaLabel: 'Enter your username',
    placeholder: 'johndoe',
    helperText: 'Choose a unique username',
  },
};

/**
 * Required input field
 */
export const Required: Story = {
  args: {
    label: 'Email Address',
    ariaLabel: 'Enter your email address',
    type: 'email',
    placeholder: 'you@example.com',
    required: true,
    helperText: 'We will never share your email',
  },
};

/**
 * Input sizes: small, medium, large
 */
export const Sizes: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <eb-input
          [size]="'sm'"
          [label]="'Small Input'"
          [ariaLabel]="'Small input'"
          [placeholder]="'Small size'"
        />
        <eb-input
          [size]="'md'"
          [label]="'Medium Input'"
          [ariaLabel]="'Medium input'"
          [placeholder]="'Medium size (default)'"
        />
        <eb-input
          [size]="'lg'"
          [label]="'Large Input'"
          [ariaLabel]="'Large input'"
          [placeholder]="'Large size'"
        />
      </div>
    `,
  }),
};

/**
 * Input variants: default, filled, outlined
 */
export const Variants: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <eb-input
          [variant]="'default'"
          [label]="'Default Variant'"
          [ariaLabel]="'Default variant input'"
          [placeholder]="'Default border style'"
        />
        <eb-input
          [variant]="'filled'"
          [label]="'Filled Variant'"
          [ariaLabel]="'Filled variant input'"
          [placeholder]="'Filled background style'"
        />
        <eb-input
          [variant]="'outlined'"
          [label]="'Outlined Variant'"
          [ariaLabel]="'Outlined variant input'"
          [placeholder]="'Prominent outline style'"
        />
      </div>
    `,
  }),
};

/**
 * Validation states: success, warning, error
 */
export const ValidationStates: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <eb-input
          [label]="'Success State'"
          [ariaLabel]="'Success state input'"
          [value]="'Valid input'"
          [validationState]="'success'"
          [helperText]="'Username is available!'"
        />
        <eb-input
          [label]="'Warning State'"
          [ariaLabel]="'Warning state input'"
          [value]="'weak-password'"
          [validationState]="'warning'"
          [helperText]="'Password is weak'"
        />
        <eb-input
          [label]="'Error State'"
          [ariaLabel]="'Error state input'"
          [value]="'invalid@'"
          [validationState]="'error'"
          [helperText]="'Invalid email format'"
        />
      </div>
    `,
  }),
};

/**
 * Different input types
 */
export const InputTypes: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <eb-input
          [type]="'text'"
          [label]="'Text Input'"
          [ariaLabel]="'Text input'"
          [placeholder]="'Enter text'"
        />
        <eb-input
          [type]="'email'"
          [label]="'Email Input'"
          [ariaLabel]="'Email input'"
          [placeholder]="'you@example.com'"
        />
        <eb-input
          [type]="'password'"
          [label]="'Password Input'"
          [ariaLabel]="'Password input'"
          [placeholder]="'Enter password'"
        />
        <eb-input
          [type]="'tel'"
          [label]="'Phone Input'"
          [ariaLabel]="'Phone input'"
          [placeholder]="'(555) 123-4567'"
        />
        <eb-input
          [type]="'url'"
          [label]="'URL Input'"
          [ariaLabel]="'URL input'"
          [placeholder]="'https://example.com'"
        />
        <eb-input
          [type]="'search'"
          [label]="'Search Input'"
          [ariaLabel]="'Search input'"
          [placeholder]="'Search...'"
        />
        <eb-input
          [type]="'number'"
          [label]="'Number Input'"
          [ariaLabel]="'Number input'"
          [placeholder]="'Enter number'"
        />
      </div>
    `,
  }),
};

/**
 * Input with prefix and suffix
 */
export const PrefixAndSuffix: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <eb-input
          [label]="'Website URL'"
          [ariaLabel]="'Website URL input'"
          [prefix]="'https://'"
          [placeholder]="'example.com'"
          [helperText]="'Enter your website address'"
        />
        <eb-input
          [label]="'Email Domain'"
          [ariaLabel]="'Email domain input'"
          [suffix]="'@company.com'"
          [placeholder]="'username'"
          [helperText]="'Enter your company email'"
        />
        <eb-input
          [label]="'Price'"
          [ariaLabel]="'Price input'"
          [type]="'number'"
          [prefix]="'$'"
          [suffix]="'.00'"
          [placeholder]="'0'"
          [helperText]="'Enter price in dollars'"
        />
      </div>
    `,
  }),
};

/**
 * Input with character count
 */
export const CharacterCount: Story = {
  args: {
    label: 'Bio',
    ariaLabel: 'Enter your bio',
    placeholder: 'Tell us about yourself...',
    maxLength: 100,
    showCharCount: true,
    helperText: 'Keep it concise',
  },
};

/**
 * Disabled input
 */
export const Disabled: Story = {
  args: {
    label: 'Disabled Field',
    ariaLabel: 'Disabled input',
    value: 'Cannot edit this',
    disabled: true,
    helperText: 'This field is disabled',
  },
};

/**
 * Readonly input
 */
export const Readonly: Story = {
  args: {
    label: 'Readonly Field',
    ariaLabel: 'Readonly input',
    value: 'This is readonly',
    readonly: true,
    helperText: 'This field is readonly',
  },
};

/**
 * Full width input
 */
export const FullWidth: Story = {
  args: {
    label: 'Full Width Input',
    ariaLabel: 'Full width input',
    placeholder: 'This input spans the full width',
    fullWidth: true,
    helperText: 'This input takes up the entire container width',
  },
};

/**
 * Form example with multiple inputs
 */
export const FormExample: Story = {
  render: (args) => ({
    props: args,
    template: `
      <form style="max-width: 500px; display: flex; flex-direction: column; gap: 1.5rem;">
        <h3 style="margin: 0 0 1rem 0; color: var(--color-text-primary);">Sign Up Form</h3>

        <eb-input
          [label]="'Full Name'"
          [ariaLabel]="'Enter your full name'"
          [placeholder]="'John Doe'"
          [required]="true"
          [fullWidth]="true"
        />

        <eb-input
          [label]="'Email Address'"
          [type]="'email'"
          [ariaLabel]="'Enter your email address'"
          [placeholder]="'you@example.com'"
          [required]="true"
          [fullWidth]="true"
        />

        <eb-input
          [label]="'Username'"
          [ariaLabel]="'Choose a username'"
          [placeholder]="'johndoe'"
          [required]="true"
          [prefix]="'@'"
          [maxLength]="20"
          [showCharCount]="true"
          [fullWidth]="true"
          [helperText]="'Choose a unique username (alphanumeric only)'"
        />

        <eb-input
          [label]="'Password'"
          [type]="'password'"
          [ariaLabel]="'Create a password'"
          [placeholder]="'Enter password'"
          [required]="true"
          [minLength]="8"
          [maxLength]="50"
          [fullWidth]="true"
          [helperText]="'Must be at least 8 characters'"
        />

        <eb-input
          [label]="'Website (optional)'"
          [type]="'url'"
          [ariaLabel]="'Enter your website URL'"
          [placeholder]="'https://example.com'"
          [fullWidth]="true"
        />
      </form>
    `,
  }),
};

/**
 * Accessibility demonstration
 */
export const AccessibilityDemo: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <p style="color: var(--color-text-primary); margin-bottom: 1rem;">
          All inputs have proper ARIA attributes, keyboard navigation, and screen reader support.
        </p>

        <eb-input
          [label]="'Required Field'"
          [ariaLabel]="'Required field example'"
          [required]="true"
          [helperText]="'This field is required and marked with * for screen readers'"
        />

        <eb-input
          [label]="'Error with ARIA'"
          [ariaLabel]="'Error field example'"
          [validationState]="'error'"
          [ariaInvalid]="true"
          [helperText]="'Error message is linked via aria-describedby'"
        />

        <eb-input
          [label]="'With Description'"
          [ariaLabel]="'Field with description'"
          [ariaDescribedBy]="'custom-description'"
          [helperText]="'Helper text is automatically linked for screen readers'"
        />
      </div>
    `,
  }),
};
