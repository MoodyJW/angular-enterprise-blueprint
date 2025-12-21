import type { Meta, StoryObj } from '@storybook/angular';

import type { SelectOption } from './select.component';
import { SelectComponent } from './select.component';

const meta: Meta<SelectComponent> = {
  title: 'Shared/Select',
  component: SelectComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
The Select component provides an accessible dropdown selection interface with support for single and multiple selection modes.

## Features
- Single and multiple selection modes
- Searchable/filterable options
- Keyboard navigation (Arrow keys, Home, End, Enter, Space, Escape)
- Clearable selections
- Validation states (success, warning, error)
- Three visual variants (default, filled, outlined)
- Three size options (sm, md, lg)
- Disabled options support
- Option descriptions
- Full WCAG 2.1 AAA compliance

## Accessibility
- Full keyboard navigation support
- ARIA attributes (aria-expanded, aria-selected, aria-multiselectable)
- Focus management and visual indicators
- Screen reader announcements
- WCAG AAA color contrast ratios
- Touch target sizes (44px minimum on mobile)
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'filled', 'outlined'],
      description: 'Visual variant of the select',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the select',
    },
    validationState: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error'],
      description: 'Validation state',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the select is disabled',
    },
    required: {
      control: 'boolean',
      description: 'Whether the select is required',
    },
    multiple: {
      control: 'boolean',
      description: 'Whether multiple options can be selected',
    },
    searchable: {
      control: 'boolean',
      description: 'Whether to show search input',
    },
    clearable: {
      control: 'boolean',
      description: 'Whether to show clear button',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether select takes full width',
    },
  },
};

export default meta;
type Story = StoryObj<SelectComponent>;

const countryOptions: SelectOption<string>[] = [
  { label: 'United States', value: 'us' },
  { label: 'Canada', value: 'ca' },
  { label: 'United Kingdom', value: 'uk' },
  { label: 'Germany', value: 'de' },
  { label: 'France', value: 'fr' },
  { label: 'Japan', value: 'jp' },
  { label: 'Australia', value: 'au' },
  { label: 'Brazil', value: 'br' },
];

const colorOptions: SelectOption<string>[] = [
  { label: 'Red', value: 'red' },
  { label: 'Blue', value: 'blue' },
  { label: 'Green', value: 'green' },
  { label: 'Yellow', value: 'yellow' },
  { label: 'Purple', value: 'purple' },
  { label: 'Orange', value: 'orange' },
];

const priorityOptions: SelectOption<string>[] = [
  { label: 'Low', value: 'low', description: 'Can be addressed later' },
  { label: 'Medium', value: 'medium', description: 'Should be addressed soon' },
  { label: 'High', value: 'high', description: 'Needs immediate attention' },
  { label: 'Critical', value: 'critical', description: 'Drop everything and fix this' },
];

const statusOptions: SelectOption<string>[] = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive', disabled: true },
  { label: 'Pending', value: 'pending' },
  { label: 'Archived', value: 'archived', disabled: true },
];

/**
 * Default select with basic configuration
 */
export const Default: Story = {
  args: {
    options: countryOptions,
    ariaLabel: 'Select a country',
    placeholder: 'Select a country',
    label: 'Country',
  },
};

/**
 * Select with pre-selected value
 */
export const WithValue: Story = {
  args: {
    options: countryOptions,
    ariaLabel: 'Select a country',
    placeholder: 'Select a country',
    label: 'Country',
    value: 'us',
  },
};

/**
 * Required select field
 */
export const Required: Story = {
  args: {
    options: countryOptions,
    ariaLabel: 'Select a country',
    placeholder: 'Select a country',
    label: 'Country',
    required: true,
    helperText: 'This field is required',
  },
};

/**
 * Disabled select
 */
export const Disabled: Story = {
  args: {
    options: countryOptions,
    ariaLabel: 'Select a country',
    placeholder: 'Select a country',
    label: 'Country',
    value: 'us',
    disabled: true,
  },
};

/**
 * Select with clearable value
 */
export const Clearable: Story = {
  args: {
    options: colorOptions,
    ariaLabel: 'Select a color',
    placeholder: 'Select a color',
    label: 'Favorite Color',
    value: 'blue',
    clearable: true,
    helperText: 'Click the X to clear your selection',
  },
};

/**
 * Select with search functionality
 */
export const Searchable: Story = {
  args: {
    options: countryOptions,
    ariaLabel: 'Select a country',
    placeholder: 'Select a country',
    label: 'Country',
    searchable: true,
    helperText: 'Type to filter options',
  },
};

/**
 * Multiple selection mode
 */
export const Multiple: Story = {
  args: {
    options: colorOptions,
    ariaLabel: 'Select colors',
    placeholder: 'Select one or more colors',
    label: 'Favorite Colors',
    multiple: true,
    value: ['red', 'blue'],
    helperText: 'You can select multiple options',
  },
};

/**
 * Multiple selection with search
 */
export const MultipleSearchable: Story = {
  args: {
    options: countryOptions,
    ariaLabel: 'Select countries',
    placeholder: 'Select countries',
    label: 'Countries Visited',
    multiple: true,
    searchable: true,
    clearable: true,
    helperText: 'Search and select multiple countries',
  },
};

/**
 * Select with option descriptions
 */
export const WithDescriptions: Story = {
  args: {
    options: priorityOptions,
    ariaLabel: 'Select priority',
    placeholder: 'Select priority level',
    label: 'Priority',
    helperText: 'Choose the appropriate priority level',
  },
};

/**
 * Select with disabled options
 */
export const WithDisabledOptions: Story = {
  args: {
    options: statusOptions,
    ariaLabel: 'Select status',
    placeholder: 'Select status',
    label: 'Status',
    helperText: 'Some options are disabled',
  },
};

/**
 * Success validation state
 */
export const ValidationSuccess: Story = {
  args: {
    options: colorOptions,
    ariaLabel: 'Select a color',
    placeholder: 'Select a color',
    label: 'Color',
    value: 'green',
    validationState: 'success',
    helperText: 'Great choice!',
  },
};

/**
 * Warning validation state
 */
export const ValidationWarning: Story = {
  args: {
    options: colorOptions,
    ariaLabel: 'Select a color',
    placeholder: 'Select a color',
    label: 'Color',
    value: 'yellow',
    validationState: 'warning',
    helperText: 'This color might not work well',
  },
};

/**
 * Error validation state
 */
export const ValidationError: Story = {
  args: {
    options: colorOptions,
    ariaLabel: 'Select a color',
    placeholder: 'Select a color',
    label: 'Color',
    validationState: 'error',
    helperText: 'Please select a color',
    required: true,
  },
};

/**
 * Small size variant
 */
export const SizeSmall: Story = {
  args: {
    options: colorOptions,
    ariaLabel: 'Select a color',
    placeholder: 'Select a color',
    label: 'Color',
    size: 'sm',
  },
};

/**
 * Medium size variant (default)
 */
export const SizeMedium: Story = {
  args: {
    options: colorOptions,
    ariaLabel: 'Select a color',
    placeholder: 'Select a color',
    label: 'Color',
    size: 'md',
  },
};

/**
 * Large size variant
 */
export const SizeLarge: Story = {
  args: {
    options: colorOptions,
    ariaLabel: 'Select a color',
    placeholder: 'Select a color',
    label: 'Color',
    size: 'lg',
  },
};

/**
 * Filled visual variant
 */
export const VariantFilled: Story = {
  args: {
    options: colorOptions,
    ariaLabel: 'Select a color',
    placeholder: 'Select a color',
    label: 'Color',
    variant: 'filled',
  },
};

/**
 * Outlined visual variant
 */
export const VariantOutlined: Story = {
  args: {
    options: colorOptions,
    ariaLabel: 'Select a color',
    placeholder: 'Select a color',
    label: 'Color',
    variant: 'outlined',
  },
};

/**
 * Full width select
 */
export const FullWidth: Story = {
  args: {
    options: countryOptions,
    ariaLabel: 'Select a country',
    placeholder: 'Select a country',
    label: 'Country',
    fullWidth: true,
  },
};

/**
 * Form example with multiple selects
 */
export const FormExample: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 600px; display: flex; flex-direction: column; gap: 24px;">
        <eb-select
          [options]="countryOptions"
          ariaLabel="Select your country"
          placeholder="Select your country"
          label="Country"
          [required]="true"
          [fullWidth]="true"
        />

        <eb-select
          [options]="priorityOptions"
          ariaLabel="Select priority"
          placeholder="Select priority level"
          label="Priority"
          [fullWidth]="true"
        />

        <eb-select
          [options]="colorOptions"
          ariaLabel="Select favorite colors"
          placeholder="Select your favorite colors"
          label="Favorite Colors"
          [multiple]="true"
          [searchable]="true"
          [clearable]="true"
          [fullWidth]="true"
          helperText="You can select multiple colors"
        />
      </div>
    `,
  }),
  args: {
    countryOptions,
    priorityOptions,
    colorOptions,
  } as never,
};

/**
 * All size variants comparison
 */
export const AllSizes: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; max-width: 400px;">
        <eb-select
          [options]="colorOptions"
          ariaLabel="Small select"
          placeholder="Small (sm)"
          label="Small"
          size="sm"
          [fullWidth]="true"
        />

        <eb-select
          [options]="colorOptions"
          ariaLabel="Medium select"
          placeholder="Medium (md)"
          label="Medium"
          size="md"
          [fullWidth]="true"
        />

        <eb-select
          [options]="colorOptions"
          ariaLabel="Large select"
          placeholder="Large (lg)"
          label="Large"
          size="lg"
          [fullWidth]="true"
        />
      </div>
    `,
  }),
  args: {
    colorOptions,
  } as never,
};

/**
 * All variants comparison
 */
export const AllVariants: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; max-width: 400px;">
        <eb-select
          [options]="colorOptions"
          ariaLabel="Default variant"
          placeholder="Select a color"
          label="Default"
          variant="default"
          [fullWidth]="true"
        />

        <eb-select
          [options]="colorOptions"
          ariaLabel="Filled variant"
          placeholder="Select a color"
          label="Filled"
          variant="filled"
          [fullWidth]="true"
        />

        <eb-select
          [options]="colorOptions"
          ariaLabel="Outlined variant"
          placeholder="Select a color"
          label="Outlined"
          variant="outlined"
          [fullWidth]="true"
        />
      </div>
    `,
  }),
  args: {
    colorOptions,
  } as never,
};

/**
 * All validation states comparison
 */
export const AllValidationStates: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; max-width: 400px;">
        <eb-select
          [options]="colorOptions"
          ariaLabel="Default state"
          placeholder="Select a color"
          label="Default"
          validationState="default"
          [fullWidth]="true"
          helperText="No validation state"
        />

        <eb-select
          [options]="colorOptions"
          ariaLabel="Success state"
          placeholder="Select a color"
          label="Success"
          validationState="success"
          [value]="'green'"
          [fullWidth]="true"
          helperText="Valid selection"
        />

        <eb-select
          [options]="colorOptions"
          ariaLabel="Warning state"
          placeholder="Select a color"
          label="Warning"
          validationState="warning"
          [value]="'yellow'"
          [fullWidth]="true"
          helperText="This might cause issues"
        />

        <eb-select
          [options]="colorOptions"
          ariaLabel="Error state"
          placeholder="Select a color"
          label="Error"
          validationState="error"
          [fullWidth]="true"
          helperText="This field is required"
        />
      </div>
    `,
  }),
  args: {
    colorOptions,
  } as never,
};
