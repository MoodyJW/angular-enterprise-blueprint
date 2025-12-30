import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';

import type { SelectOption } from '../select.component';

import { SelectDropdownComponent } from './select-dropdown.component';

const meta: Meta<SelectDropdownComponent> = {
  title: 'Shared/Select/SelectDropdown',
  component: SelectDropdownComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [],
    }),
    moduleMetadata({
      imports: [SelectDropdownComponent],
    }),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'The dropdown panel for the Select component. Contains search input (optional) and options list. Note: This component uses position: relative for Storybook rendering (normally position: absolute inside the Select).',
      },
    },
  },
  argTypes: {
    dropdownClass: {
      control: 'text',
      description: 'CSS classes to apply to the dropdown container',
    },
    searchable: {
      control: 'boolean',
      description: 'Whether to show search input',
    },
    searchQuery: {
      control: 'text',
      description: 'Current search query value',
    },
    listboxId: {
      control: 'text',
      description: 'ID for the listbox element',
    },
    ariaLabel: {
      control: 'text',
      description: 'ARIA label for the listbox',
    },
    isMultiple: {
      control: 'boolean',
      description: 'Whether multiple selections are allowed',
    },
    maxHeight: {
      control: 'number',
      description: 'Maximum height of the dropdown in pixels',
    },
    highlightedIndex: {
      control: 'number',
      description: 'Index of currently highlighted option',
    },
    searchInput: {
      action: 'searchInput',
      description: 'Event emitted when search input changes',
    },
    searchKeydown: {
      action: 'searchKeydown',
      description: 'Event emitted on search input keydown',
    },
    optionClicked: {
      action: 'optionClicked',
      description: 'Event emitted when an option is clicked',
    },
    optionEnterPressed: {
      action: 'optionEnterPressed',
      description: 'Event emitted when Enter is pressed on an option',
    },
    optionSpacePressed: {
      action: 'optionSpacePressed',
      description: 'Event emitted when Space is pressed on an option',
    },
    optionMouseEntered: {
      action: 'optionMouseEntered',
      description: 'Event emitted when mouse enters an option',
    },
  },
  args: {
    dropdownClass: 'select-dropdown',
    searchable: false,
    searchQuery: '',
    listboxId: 'listbox-1',
    isMultiple: false,
    maxHeight: 280,
    highlightedIndex: -1,
    options: [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
      { value: '3', label: 'Option 3' },
      { value: '4', label: 'Option 4' },
      { value: '5', label: 'Option 5' },
    ],
    isOptionSelected: (_option: SelectOption) => false,
  },
  // Use render to wrap in a container with proper positioning
  render: (args) => ({
    props: args,
    styles: [
      `
        .storybook-dropdown-wrapper {
          position: relative;
          width: 300px;
          min-height: 300px;
        }
        .storybook-dropdown-wrapper eb-select-dropdown .select-dropdown {
          position: relative;
          top: 0;
        }
      `,
    ],
    template: `
      <div class="storybook-dropdown-wrapper">
        <eb-select-dropdown
          [dropdownClass]="dropdownClass"
          [searchable]="searchable"
          [searchQuery]="searchQuery"
          [listboxId]="listboxId"
          [ariaLabel]="ariaLabel"
          [isMultiple]="isMultiple"
          [maxHeight]="maxHeight"
          [options]="options"
          [highlightedIndex]="highlightedIndex"
          [isOptionSelected]="isOptionSelected"
          (searchInput)="searchInput($event)"
          (searchKeydown)="searchKeydown($event)"
          (optionClicked)="optionClicked($event)"
          (optionEnterPressed)="optionEnterPressed($event)"
          (optionSpacePressed)="optionSpacePressed($event)"
          (optionMouseEntered)="optionMouseEntered($event)"
        />
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<SelectDropdownComponent>;

export const Default: Story = {
  args: {},
};

export const WithSearch: Story = {
  args: {
    searchable: true,
  },
};

export const WithSearchQuery: Story = {
  args: {
    searchable: true,
    searchQuery: 'test',
  },
};

export const MultipleSelect: Story = {
  args: {
    isMultiple: true,
  },
};

export const WithSelectedOption: Story = {
  args: {
    isOptionSelected: (option: SelectOption) => option.value === '2',
  },
};

export const MultipleWithSelectedOptions: Story = {
  args: {
    isMultiple: true,
    isOptionSelected: (option: SelectOption) => ['2', '4'].includes(option.value as string),
  },
};

export const WithHighlightedOption: Story = {
  args: {
    highlightedIndex: 1,
  },
};

export const WithDescriptions: Story = {
  args: {
    options: [
      { value: '1', label: 'Option 1', description: 'This is the first option' },
      { value: '2', label: 'Option 2', description: 'This is the second option' },
      { value: '3', label: 'Option 3', description: 'This is the third option' },
    ],
  },
};

export const WithDisabledOptions: Story = {
  args: {
    options: [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2 (disabled)', disabled: true },
      { value: '3', label: 'Option 3' },
      { value: '4', label: 'Option 4 (disabled)', disabled: true },
      { value: '5', label: 'Option 5' },
    ],
  },
};

export const EmptyState: Story = {
  args: {
    options: [],
  },
};

export const EmptyStateWithSearch: Story = {
  args: {
    searchable: true,
    searchQuery: 'no results',
    options: [],
  },
};

export const ManyOptions: Story = {
  args: {
    options: Array.from({ length: 20 }, (_, i) => ({
      value: String(i + 1),
      label: `Option ${String(i + 1)}`,
    })),
  },
};

export const ManyOptionsWithSearch: Story = {
  args: {
    searchable: true,
    options: Array.from({ length: 20 }, (_, i) => ({
      value: String(i + 1),
      label: `Option ${String(i + 1)}`,
      description: `Description for option ${String(i + 1)}`,
    })),
  },
};

export const CustomMaxHeight: Story = {
  args: {
    maxHeight: 150,
    options: Array.from({ length: 10 }, (_, i) => ({
      value: String(i + 1),
      label: `Option ${String(i + 1)}`,
    })),
  },
};

export const LargeMaxHeight: Story = {
  args: {
    maxHeight: 500,
    options: Array.from({ length: 15 }, (_, i) => ({
      value: String(i + 1),
      label: `Option ${String(i + 1)}`,
    })),
  },
};
