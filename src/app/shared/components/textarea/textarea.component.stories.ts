import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';

import { TextareaComponent } from './textarea.component';

const meta: Meta<TextareaComponent> = {
  title: 'Shared/Textarea',
  component: TextareaComponent,
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
      description: 'Visual variant of the textarea',
      table: {
        type: { summary: 'TextareaVariant' },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the textarea',
      table: {
        type: { summary: 'TextareaSize' },
        defaultValue: { summary: 'md' },
      },
    },
    resize: {
      control: 'select',
      options: ['none', 'vertical', 'horizontal', 'both'],
      description: 'Resize behavior of the textarea',
      table: {
        type: { summary: 'TextareaResize' },
        defaultValue: { summary: 'vertical' },
      },
    },
    validationState: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error'],
      description: 'Validation state of the textarea',
      table: {
        type: { summary: 'TextareaValidationState' },
        defaultValue: { summary: 'default' },
      },
    },
    value: {
      control: 'text',
      description: 'Current value of the textarea',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    label: {
      control: 'text',
      description: 'Label text displayed above the textarea',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text shown when textarea is empty',
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below the textarea',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the textarea is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    readonly: {
      control: 'boolean',
      description: 'Whether the textarea is readonly',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    required: {
      control: 'boolean',
      description: 'Whether the textarea is required',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the textarea takes full width',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    autoResize: {
      control: 'boolean',
      description: 'Whether the textarea automatically resizes based on content',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    showCharCount: {
      control: 'boolean',
      description: 'Whether to show character count (requires maxLength)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    rows: {
      control: 'number',
      description: 'Number of visible text rows',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '4' },
      },
    },
    maxRows: {
      control: 'number',
      description: 'Maximum number of visible text rows (for auto-resize)',
    },
    minRows: {
      control: 'number',
      description: 'Minimum number of visible text rows (for auto-resize)',
    },
    maxLength: {
      control: 'number',
      description: 'Maximum length of textarea value',
    },
    minLength: {
      control: 'number',
      description: 'Minimum length of textarea value',
    },
    ariaLabel: {
      control: 'text',
      description: 'ARIA label for the textarea (REQUIRED for accessibility)',
    },
  },
  args: {
    ariaLabel: 'Text area input',
  },
};

export default meta;
type Story = StoryObj<TextareaComponent>;

/**
 * Default textarea with standard styling and behavior.
 */
export const Default: Story = {
  args: {
    label: 'Message',
    placeholder: 'Enter your message here...',
    ariaLabel: 'Enter your message',
  },
};

/**
 * Textarea with helper text to provide additional context or instructions.
 */
export const WithHelperText: Story = {
  args: {
    label: 'Description',
    placeholder: 'Enter description...',
    helperText: 'Provide a detailed description of your project',
    ariaLabel: 'Project description',
  },
};

/**
 * Textarea with character count display. Useful for enforcing length limits.
 */
export const WithCharacterCount: Story = {
  args: {
    label: 'Bio',
    placeholder: 'Tell us about yourself...',
    maxLength: 200,
    showCharCount: true,
    helperText: 'Keep it brief and engaging',
    ariaLabel: 'User bio',
  },
};

/**
 * Validation state examples showing success, warning, and error states.
 */
export const ValidationSuccess: Story = {
  args: {
    label: 'Feedback',
    value: 'This is a valid feedback message that meets all requirements.',
    validationState: 'success',
    helperText: 'Thank you for your feedback!',
    ariaLabel: 'Feedback message',
  },
};

export const ValidationWarning: Story = {
  args: {
    label: 'Comment',
    value: 'Short',
    validationState: 'warning',
    helperText: 'Your comment is a bit short. Consider adding more details.',
    ariaLabel: 'Comment',
  },
};

export const ValidationError: Story = {
  args: {
    label: 'Required Field',
    validationState: 'error',
    helperText: 'This field is required',
    required: true,
    ariaLabel: 'Required comment field',
  },
};

/**
 * Different visual variants of the textarea component.
 */
export const VariantFilled: Story = {
  args: {
    label: 'Notes',
    variant: 'filled',
    placeholder: 'Enter your notes...',
    ariaLabel: 'Notes',
  },
};

export const VariantOutlined: Story = {
  args: {
    label: 'Comments',
    variant: 'outlined',
    placeholder: 'Add your comments...',
    ariaLabel: 'Comments',
  },
};

/**
 * Different sizes of the textarea component.
 */
export const SizeSmall: Story = {
  args: {
    label: 'Quick Note',
    size: 'sm',
    rows: 3,
    placeholder: 'Small textarea...',
    ariaLabel: 'Quick note',
  },
};

export const SizeLarge: Story = {
  args: {
    label: 'Detailed Response',
    size: 'lg',
    rows: 6,
    placeholder: 'Large textarea...',
    ariaLabel: 'Detailed response',
  },
};

/**
 * Auto-resize textarea that grows/shrinks based on content.
 * Type text to see the textarea expand automatically.
 */
export const AutoResize: Story = {
  args: {
    label: 'Auto-expanding Text',
    autoResize: true,
    rows: 3,
    minRows: 3,
    maxRows: 10,
    placeholder: 'Start typing to see auto-resize in action...',
    helperText: 'This textarea will automatically expand as you type (min: 3 rows, max: 10 rows)',
    ariaLabel: 'Auto-expanding text area',
  },
};

/**
 * Different resize behaviors for manual resizing by the user.
 */
export const ResizeNone: Story = {
  args: {
    label: 'Fixed Size',
    resize: 'none',
    rows: 4,
    placeholder: 'This textarea cannot be resized manually',
    helperText: 'Resize is disabled',
    ariaLabel: 'Fixed size textarea',
  },
};

export const ResizeHorizontal: Story = {
  args: {
    label: 'Horizontal Resize',
    resize: 'horizontal',
    rows: 4,
    placeholder: 'This textarea can be resized horizontally',
    helperText: 'Drag the corner to resize horizontally',
    ariaLabel: 'Horizontal resize textarea',
  },
};

export const ResizeBoth: Story = {
  args: {
    label: 'Full Resize',
    resize: 'both',
    rows: 4,
    placeholder: 'This textarea can be resized in both directions',
    helperText: 'Drag the corner to resize in any direction',
    ariaLabel: 'Full resize textarea',
  },
};

/**
 * Full-width textarea that spans the entire container width.
 */
export const FullWidth: Story = {
  args: {
    label: 'Full Width Textarea',
    fullWidth: true,
    placeholder: 'This textarea spans the full width',
    ariaLabel: 'Full width textarea',
  },
};

/**
 * Disabled textarea that cannot be interacted with.
 */
export const Disabled: Story = {
  args: {
    label: 'Disabled Field',
    value: 'This textarea is disabled and cannot be edited',
    disabled: true,
    helperText: 'This field is currently disabled',
    ariaLabel: 'Disabled textarea',
  },
};

/**
 * Readonly textarea that displays content but prevents editing.
 */
export const Readonly: Story = {
  args: {
    label: 'Read-only Content',
    value: 'This is read-only content that cannot be modified but can be selected and copied.',
    readonly: true,
    helperText: 'This content is read-only',
    ariaLabel: 'Read-only textarea',
  },
};

/**
 * Required field indicator with asterisk.
 */
export const Required: Story = {
  args: {
    label: 'Required Information',
    required: true,
    placeholder: 'This field is required...',
    helperText: 'Please fill out this field',
    ariaLabel: 'Required information',
  },
};

/**
 * Comprehensive example combining multiple features.
 */
export const CompleteExample: Story = {
  args: {
    label: 'Project Proposal',
    placeholder: 'Describe your project proposal in detail...',
    variant: 'outlined',
    size: 'md',
    rows: 6,
    maxLength: 500,
    minLength: 50,
    showCharCount: true,
    required: true,
    helperText: 'Provide a detailed description (50-500 characters)',
    validationState: 'default',
    fullWidth: true,
    ariaLabel: 'Project proposal description',
  },
};

/**
 * Form integration example showing how the component works within a form context.
 */
export const FormIntegration: Story = {
  args: {
    label: 'Contact Message',
    placeholder: 'How can we help you?',
    rows: 5,
    maxLength: 1000,
    showCharCount: true,
    required: true,
    fullWidth: true,
    helperText: 'Tell us about your inquiry',
    ariaLabel: 'Contact form message',
  },
  parameters: {
    docs: {
      description: {
        story:
          'This example demonstrates how the textarea component can be integrated into a form. It includes validation, character counting, and accessibility features.',
      },
    },
  },
};
