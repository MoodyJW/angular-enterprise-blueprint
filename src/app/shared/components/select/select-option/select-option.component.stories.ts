import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';

import { SelectOptionComponent } from './select-option.component';

const meta: Meta<SelectOptionComponent> = {
  title: 'Shared/Select/SelectOption',
  component: SelectOptionComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [],
    }),
  ],
  argTypes: {
    optionClass: {
      control: 'text',
      description: 'CSS classes to apply to the option',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'select-option' },
      },
    },
    isSelected: {
      control: 'boolean',
      description: 'Whether the option is selected',
      table: {
        type: { summary: 'boolean' },
      },
    },
    isDisabled: {
      control: 'boolean',
      description: 'Whether the option is disabled',
      table: {
        type: { summary: 'boolean' },
      },
    },
    isHighlighted: {
      control: 'boolean',
      description: 'Whether the option is highlighted (keyboard navigation)',
      table: {
        type: { summary: 'boolean' },
      },
    },
    isMultiple: {
      control: 'boolean',
      description: 'Whether this is part of a multiple select (shows checkbox)',
      table: {
        type: { summary: 'boolean' },
      },
    },
    index: {
      control: 'number',
      description: 'Index of the option in the list',
      table: {
        type: { summary: 'number' },
      },
    },
    label: {
      control: 'text',
      description: 'Label text for the option',
      table: {
        type: { summary: 'string' },
      },
    },
    description: {
      control: 'text',
      description: 'Optional description text',
      table: {
        type: { summary: 'string | undefined' },
      },
    },
    clicked: {
      action: 'clicked',
      description: 'Event emitted when option is clicked',
      table: {
        category: 'Events',
      },
    },
    enterPressed: {
      action: 'enterPressed',
      description: 'Event emitted when Enter key is pressed',
      table: {
        category: 'Events',
      },
    },
    spacePressed: {
      action: 'spacePressed',
      description: 'Event emitted when Space key is pressed',
      table: {
        category: 'Events',
      },
    },
    mouseEntered: {
      action: 'mouseEntered',
      description: 'Event emitted when mouse enters the option',
      table: {
        category: 'Events',
      },
    },
  },
  args: {
    optionClass: 'select-option',
    isSelected: false,
    isDisabled: false,
    isHighlighted: false,
    isMultiple: false,
    index: 0,
    label: 'Option Label',
  },
};

export default meta;
type Story = StoryObj<SelectOptionComponent>;

export const Default: Story = {
  args: {
    label: 'Default Option',
  },
};

export const Selected: Story = {
  args: {
    label: 'Selected Option',
    isSelected: true,
  },
};

export const Highlighted: Story = {
  args: {
    label: 'Highlighted Option',
    isHighlighted: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Option',
    isDisabled: true,
  },
};

export const SelectedAndHighlighted: Story = {
  args: {
    label: 'Selected & Highlighted',
    isSelected: true,
    isHighlighted: true,
  },
};

export const SelectedAndDisabled: Story = {
  args: {
    label: 'Selected & Disabled',
    isSelected: true,
    isDisabled: true,
  },
};

export const WithDescription: Story = {
  args: {
    label: 'Option with Description',
    description: 'This is a helpful description for the option',
  },
};

export const SelectedWithDescription: Story = {
  args: {
    label: 'Selected Option with Description',
    description: 'This option is currently selected',
    isSelected: true,
  },
};

export const DisabledWithDescription: Story = {
  args: {
    label: 'Disabled Option with Description',
    description: 'This option is not available',
    isDisabled: true,
  },
};

export const MultipleDefault: Story = {
  args: {
    label: 'Multiple Select Option',
    isMultiple: true,
  },
};

export const MultipleSelected: Story = {
  args: {
    label: 'Multiple Select - Selected',
    isMultiple: true,
    isSelected: true,
  },
};

export const MultipleHighlighted: Story = {
  args: {
    label: 'Multiple Select - Highlighted',
    isMultiple: true,
    isHighlighted: true,
  },
};

export const MultipleDisabled: Story = {
  args: {
    label: 'Multiple Select - Disabled',
    isMultiple: true,
    isDisabled: true,
  },
};

export const MultipleWithDescription: Story = {
  args: {
    label: 'Multiple Select with Description',
    description: 'Select multiple options from the list',
    isMultiple: true,
  },
};

export const MultipleSelectedWithDescription: Story = {
  args: {
    label: 'Multiple Selected with Description',
    description: 'This option is currently selected',
    isMultiple: true,
    isSelected: true,
  },
};

export const LongLabel: Story = {
  args: {
    label:
      'This is a very long option label that might overflow and needs to be handled properly with ellipsis',
  },
};

export const LongDescription: Story = {
  args: {
    label: 'Option with Long Description',
    description:
      'This is a very long description that provides extensive information about the option and might need to wrap or be truncated',
  },
};

export const AllStates: Story = {
  args: {
    label: 'All States Combined',
    description: 'Selected, Highlighted, and part of Multiple Select',
    isMultiple: true,
    isSelected: true,
    isHighlighted: true,
  },
};
