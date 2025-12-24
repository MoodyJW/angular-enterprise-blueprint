# Select Component

> **Last Updated**: December 4, 2025
> **Status**: Production Ready
> **Test Coverage**: >95%

Accessible dropdown select component with search, multiple selection, and comprehensive features.

## Features

- ✅ **Three Variants**: Default, Filled, Outlined
- ✅ **Three Sizes**: Small (sm), Medium (md), Large (lg)
- ✅ **Validation States**: Default, Success, Warning, Error
- ✅ **Multiple Selection**: Single or multi-select mode
- ✅ **Searchable**: Optional search/filter functionality
- ✅ **Clearable**: Optional clear button
- ✅ **Helper Text**: Instructions and validation messages
- ✅ **Keyboard Navigation**: Full arrow key navigation
- ✅ **Two-way Binding**: Signal-based [(value)] binding
- ✅ **Accessible**: WCAG 2.1 AAA compliant, follows WAI-ARIA combobox pattern
- ✅ **Theme Integration**: Uses CSS variables for theming

## Usage

### Basic Examples

```typescript
import { Component, signal } from '@angular/core';
import { SelectComponent, type SelectOption } from '@shared/components';

@Component({
  selector: 'eb-example',
  imports: [SelectComponent],
  template: `
    <!-- Basic select -->
    <eb-select
      label="Country"
      [(value)]="selectedCountry"
      [options]="countries"
      ariaLabel="Select your country"
    />

    <!-- Select with validation -->
    <eb-select
      label="Category"
      [(value)]="category"
      [options]="categories"
      validationState="error"
      helperText="Please select a category"
      [required]="true"
      ariaLabel="Select a category"
    />

    <!-- Multiple select -->
    <eb-select
      label="Tags"
      [(value)]="tags"
      [options]="tagOptions"
      [multiple]="true"
      ariaLabel="Select tags"
    />

    <!-- Searchable select -->
    <eb-select
      label="City"
      [(value)]="city"
      [options]="cities"
      [searchable]="true"
      placeholder="Search cities..."
      ariaLabel="Select a city"
    />

    <!-- Clearable select -->
    <eb-select
      label="Department"
      [(value)]="department"
      [options]="departments"
      [clearable]="true"
      ariaLabel="Select department"
    />

    <!-- Disabled select -->
    <eb-select
      label="Status"
      [(value)]="status"
      [options]="statuses"
      [disabled]="true"
      ariaLabel="Select status"
    />
  `,
})
export class ExampleComponent {
  selectedCountry = signal<string | null>(null);
  category = signal<string | null>(null);
  tags = signal<string[]>([]);
  city = signal<string | null>(null);
  department = signal<string | null>(null);
  status = signal<string | null>('active');

  countries: SelectOption[] = [
    { label: 'United States', value: 'us' },
    { label: 'Canada', value: 'ca' },
    { label: 'United Kingdom', value: 'uk' },
  ];

  categories: SelectOption[] = [
    { label: 'Technology', value: 'tech' },
    { label: 'Design', value: 'design' },
    { label: 'Marketing', value: 'marketing' },
  ];

  tagOptions: SelectOption[] = [
    { label: 'Angular', value: 'angular' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'RxJS', value: 'rxjs' },
  ];

  cities: SelectOption[] = [
    { label: 'New York', value: 'ny' },
    { label: 'Los Angeles', value: 'la' },
    { label: 'Chicago', value: 'chi' },
    // ... many more cities
  ];

  departments: SelectOption[] = [
    { label: 'Engineering', value: 'eng' },
    { label: 'Sales', value: 'sales' },
    { label: 'Marketing', value: 'mkt' },
  ];

  statuses: SelectOption[] = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];
}
```

### With Descriptions

```typescript
@Component({
  template: `
    <eb-select label="Plan" [(value)]="selectedPlan" [options]="plans" ariaLabel="Select a plan" />
  `,
})
export class PlanSelectExample {
  selectedPlan = signal<string | null>(null);

  plans: SelectOption[] = [
    {
      label: 'Free',
      value: 'free',
      description: 'Perfect for getting started',
    },
    {
      label: 'Pro',
      value: 'pro',
      description: 'For professional use',
    },
    {
      label: 'Enterprise',
      value: 'enterprise',
      description: 'For large organizations',
    },
  ];
}
```

### With Disabled Options

```typescript
@Component({
  template: `
    <eb-select
      label="Features"
      [(value)]="feature"
      [options]="features"
      ariaLabel="Select a feature"
    />
  `,
})
export class DisabledOptionsExample {
  feature = signal<string | null>(null);

  features: SelectOption[] = [
    { label: 'Basic Features', value: 'basic' },
    {
      label: 'Advanced Features',
      value: 'advanced',
      disabled: true,
      description: 'Requires Pro plan',
    },
    {
      label: 'Enterprise Features',
      value: 'enterprise',
      disabled: true,
      description: 'Requires Enterprise plan',
    },
  ];
}
```

### With Event Handling

```typescript
@Component({
  template: `
    <eb-select
      label="Priority"
      [(value)]="priority"
      [options]="priorities"
      ariaLabel="Select priority"
      (valueChange)="handleChange($event)"
      (opened)="handleOpened()"
      (closed)="handleClosed()"
    />
  `,
})
export class EventExample {
  priority = signal<string | null>(null);

  priorities: SelectOption[] = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
  ];

  handleChange(value: string | string[] | null) {
    console.log('Value changed:', value);
  }

  handleOpened() {
    console.log('Dropdown opened');
  }

  handleClosed() {
    console.log('Dropdown closed');
  }
}
```

## Component API

### Inputs

| Input               | Type                                             | Default                               | Description                                                                                                              |
| ------------------- | ------------------------------------------------ | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `variant`           | `'default' \| 'filled' \| 'outlined'`            | `'default'`                           | Visual variant                                                                                                           |
| `size`              | `'sm' \| 'md' \| 'lg'`                           | `'md'`                                | Size of the select                                                                                                       |
| `value`             | `T \| T[] \| null`                               | `null`                                | Current value (two-way bindable)                                                                                         |
| `options`           | `SelectOption<T>[]`                              | **REQUIRED**                          | Array of options                                                                                                         |
| `label`             | `string`                                         | `''`                                  | Label text above select                                                                                                  |
| `placeholder`       | `string`                                         | `'Select an option'`                  | Placeholder text                                                                                                         |
| `helperText`        | `string`                                         | `''`                                  | Helper text below select                                                                                                 |
| `validationState`   | `'default' \| 'success' \| 'warning' \| 'error'` | `'default'`                           | Validation state                                                                                                         |
| `disabled`          | `boolean`                                        | `false`                               | Whether disabled                                                                                                         |
| `required`          | `boolean`                                        | `false`                               | Whether required                                                                                                         |
| `multiple`          | `boolean`                                        | `false`                               | Multiple selection mode                                                                                                  |
| `searchable`        | `boolean`                                        | `false`                               | Show search input                                                                                                        |
| `clearable`         | `boolean`                                        | `false`                               | Show clear button                                                                                                        |
| `maxVisibleOptions` | `number`                                         | `10`                                  | Max items before scroll                                                                                                  |
| `fullWidth`         | `boolean`                                        | `false`                               | Full width of container                                                                                                  |
| `ariaLabel`         | `string`                                         | **OPTIONAL when `label` is provided** | ARIA label for the select. Optional when a visible `label` is present, as the label element provides the accessible name |
| `ariaDescribedBy`   | `string \| undefined`                            | `undefined`                           | Described by element ID                                                                                                  |
| `ariaInvalid`       | `boolean`                                        | `false`                               | Whether value is invalid                                                                                                 |

### Outputs

| Output        | Type                             | Description     |
| ------------- | -------------------------------- | --------------- |
| `valueChange` | `EventEmitter<T \| T[] \| null>` | Value changed   |
| `opened`      | `EventEmitter<void>`             | Dropdown opened |
| `closed`      | `EventEmitter<void>`             | Dropdown closed |
| `focused`     | `EventEmitter<FocusEvent>`       | Received focus  |
| `blurred`     | `EventEmitter<FocusEvent>`       | Lost focus      |

### SelectOption Interface

```typescript
interface SelectOption<T = unknown> {
  label: string; // Display label
  value: T; // Option value
  disabled?: boolean; // Whether disabled
  description?: string; // Optional description/subtitle
}
```

### Methods

| Method    | Return Type | Description      |
| --------- | ----------- | ---------------- |
| `focus()` | `void`      | Focus the select |
| `blur()`  | `void`      | Blur the select  |

## Keyboard Navigation

- **Enter/Space**: Open dropdown or select highlighted option
- **ArrowDown**: Navigate to next option
- **ArrowUp**: Navigate to previous option
- **Home**: Jump to first option
- **End**: Jump to last option
- **Escape**: Close dropdown
- **Tab**: Close dropdown and move focus
- **Type**: Search/filter options (when searchable)

## Accessibility

### ARIA Attributes

The `ariaLabel` input is **optional when a visible `label` is provided**, since the label is properly associated and provides the accessible name.

Follows WAI-ARIA combobox pattern with proper:

- `role="combobox"`
- `aria-expanded`
- `aria-controls`
- `aria-activedescendant`
- `aria-labelledby` (when label is present)

```html
<!-- Good: Label provides accessible name -->
<eb-select label="Country" [(value)]="country" [options]="countries" />

<!-- Good: ariaLabel provides additional context -->
<eb-select
  label="Country"
  [(value)]="country"
  [options]="countries"
  ariaLabel="Select your country of residence"
/>

<!-- Required: No visible label, ariaLabel needed -->
<eb-select [(value)]="filter" [options]="filterOptions" ariaLabel="Filter results" />
```

### Screen Reader Support

- Announces selected options
- Announces option count in multiple mode
- Announces filtering results
- Live regions for dynamic updates

## Testing

Run tests:

```bash
npm test -- select.component
```

## Architecture

```
select/
├── select.component.ts
├── select.component.html
├── select.component.scss
├── select.component.spec.ts
├── select.component.stories.ts
├── select-button/              # Internal button component
├── select-dropdown/            # Internal dropdown component
├── select-option/              # Internal option component
├── index.ts
└── README.md
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## License

Part of the MoodyJW Portfolio project.
