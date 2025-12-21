import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';

import { SelectButtonComponent } from './select-button.component';

const meta: Meta<SelectButtonComponent> = {
  title: 'Shared/Select/SelectButton',
  component: SelectButtonComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [],
    }),
  ],
  argTypes: {
    buttonId: {
      control: 'text',
      description: 'ID for the button element',
      table: {
        type: { summary: 'string | undefined' },
      },
    },
    buttonClass: {
      control: 'text',
      description: 'CSS classes to apply to the button',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'select-button' },
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
    ariaLabel: {
      control: 'text',
      description: 'ARIA label for accessibility',
      table: {
        type: { summary: 'string | undefined' },
      },
    },
    ariaLabelledby: {
      control: 'text',
      description: 'ID of element that labels this button',
      table: {
        type: { summary: 'string | undefined' },
      },
    },
    ariaDescribedby: {
      control: 'text',
      description: 'ID of element that describes this button',
      table: {
        type: { summary: 'string | undefined' },
      },
    },
    ariaInvalid: {
      control: 'text',
      description: 'Whether the button has an invalid value',
      table: {
        type: { summary: 'string | undefined' },
      },
    },
    ariaRequired: {
      control: 'text',
      description: 'Whether the button is required',
      table: {
        type: { summary: 'string | undefined' },
      },
    },
    isOpen: {
      control: 'boolean',
      description: 'Whether the dropdown is open',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    ariaControls: {
      control: 'text',
      description: 'ID of the listbox this button controls',
      table: {
        type: { summary: 'string' },
      },
    },
    displayText: {
      control: 'text',
      description: 'Text to display in the button',
      table: {
        type: { summary: 'string' },
      },
    },
    hasValue: {
      control: 'boolean',
      description: 'Whether the select has a value (affects placeholder styling)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    showClear: {
      control: 'boolean',
      description: 'Whether to show the clear button',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    clicked: {
      action: 'clicked',
      description: 'Event emitted when button is clicked',
      table: {
        category: 'Events',
      },
    },
    clearClicked: {
      action: 'clearClicked',
      description: 'Event emitted when clear button is clicked',
      table: {
        category: 'Events',
      },
    },
    focused: {
      action: 'focused',
      description: 'Event emitted when button receives focus',
      table: {
        category: 'Events',
      },
    },
    blurred: {
      action: 'blurred',
      description: 'Event emitted when button loses focus',
      table: {
        category: 'Events',
      },
    },
    keydown: {
      action: 'keydown',
      description: 'Event emitted on keydown',
      table: {
        category: 'Events',
      },
    },
  },
  args: {
    buttonClass: 'select-button',
    disabled: false,
    isOpen: false,
    ariaControls: 'listbox-1',
    displayText: 'Select an option',
    hasValue: false,
    showClear: false,
  },
};

export default meta;
type Story = StoryObj<SelectButtonComponent>;

export const Default: Story = {
  args: {
    displayText: 'Select an option',
    hasValue: false,
  },
};

export const WithValue: Story = {
  args: {
    displayText: 'Option 1',
    hasValue: true,
  },
};

export const Open: Story = {
  args: {
    displayText: 'Select an option',
    hasValue: false,
    isOpen: true,
  },
};

export const OpenWithValue: Story = {
  args: {
    displayText: 'Option 1',
    hasValue: true,
    isOpen: true,
  },
};

export const WithClearButton: Story = {
  args: {
    displayText: 'Option 1',
    hasValue: true,
    showClear: true,
  },
};

export const Disabled: Story = {
  args: {
    displayText: 'Select an option',
    hasValue: false,
    disabled: true,
  },
};

export const DisabledWithValue: Story = {
  args: {
    displayText: 'Option 1',
    hasValue: true,
    disabled: true,
  },
};

export const SmallSize: Story = {
  args: {
    buttonClass: 'select-button select-button--sm',
    displayText: 'Select an option',
    hasValue: false,
  },
};

export const MediumSize: Story = {
  args: {
    buttonClass: 'select-button select-button--md',
    displayText: 'Select an option',
    hasValue: false,
  },
};

export const LargeSize: Story = {
  args: {
    buttonClass: 'select-button select-button--lg',
    displayText: 'Select an option',
    hasValue: false,
  },
};

export const FilledVariant: Story = {
  args: {
    buttonClass: 'select-button select-button--filled',
    displayText: 'Select an option',
    hasValue: false,
  },
};

export const OutlinedVariant: Story = {
  args: {
    buttonClass: 'select-button select-button--outlined',
    displayText: 'Select an option',
    hasValue: false,
  },
};

export const ErrorState: Story = {
  args: {
    buttonClass: 'select-button select-button--error',
    displayText: 'Select an option',
    hasValue: false,
    ariaInvalid: 'true',
  },
};

export const SuccessState: Story = {
  args: {
    buttonClass: 'select-button select-button--success',
    displayText: 'Option 1',
    hasValue: true,
  },
};

export const WarningState: Story = {
  args: {
    buttonClass: 'select-button select-button--warning',
    displayText: 'Option 1',
    hasValue: true,
  },
};
