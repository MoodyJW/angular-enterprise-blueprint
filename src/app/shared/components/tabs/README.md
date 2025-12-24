# Tabs Component

> **Last Updated**: December 4, 2025
> **Status**: Production Ready
> **Test Coverage**: >95%

Accessible tabs component with keyboard navigation following WAI-ARIA tabs pattern for organizing content into sections.

## Features

- ✅ **Four Variants**: Default, Pills, Underline, Boxed
- ✅ **Two Orientations**: Horizontal and Vertical
- ✅ **Three Sizes**: Small, Medium, Large
- ✅ **Full Width Option**: Distribute tabs evenly
- ✅ **Disabled Tabs**: Individual tabs can be disabled
- ✅ **Icon Support**: Optional icons in tab labels
- ✅ **Keyboard Navigation**: Full arrow key navigation
- ✅ **Two-way Binding**: Signal-based [(activeTabId)] binding
- ✅ **Accessible**: WCAG 2.1 AAA compliant, follows WAI-ARIA tabs pattern
- ✅ **Theme Integration**: Uses CSS variables
- ✅ **Signal-based**: Modern Angular signals API

## Usage

### Basic Examples

```typescript
import { Component, signal } from '@angular/core';
import { TabsComponent, TabComponent } from '@shared/components';

@Component({
  selector: 'eb-example',
  imports: [TabsComponent, TabComponent],
  template: `
    <!-- Basic tabs -->
    <eb-tabs [(activeTabId)]="selectedTab" ariaLabel="Content sections">
      <eb-tab tabId="overview" label="Overview">
        <p>Overview content...</p>
      </eb-tab>
      <eb-tab tabId="details" label="Details">
        <p>Details content...</p>
      </eb-tab>
      <eb-tab tabId="settings" label="Settings">
        <p>Settings content...</p>
      </eb-tab>
    </eb-tabs>

    <!-- Pills variant -->
    <eb-tabs variant="pills" ariaLabel="Navigation">
      <eb-tab tabId="tab1" label="Tab 1">Content 1</eb-tab>
      <eb-tab tabId="tab2" label="Tab 2">Content 2</eb-tab>
      <eb-tab tabId="tab3" label="Tab 3">Content 3</eb-tab>
    </eb-tabs>

    <!-- Underline variant -->
    <eb-tabs variant="underline" ariaLabel="Sections">
      <eb-tab tabId="tab1" label="Tab 1">Content 1</eb-tab>
      <eb-tab tabId="tab2" label="Tab 2">Content 2</eb-tab>
    </eb-tabs>

    <!-- Boxed variant -->
    <eb-tabs variant="boxed" ariaLabel="Views">
      <eb-tab tabId="tab1" label="Tab 1">Content 1</eb-tab>
      <eb-tab tabId="tab2" label="Tab 2">Content 2</eb-tab>
    </eb-tabs>

    <!-- Large size -->
    <eb-tabs size="lg" ariaLabel="Large tabs">
      <eb-tab tabId="tab1" label="Tab 1">Content 1</eb-tab>
      <eb-tab tabId="tab2" label="Tab 2">Content 2</eb-tab>
    </eb-tabs>

    <!-- Full width -->
    <eb-tabs [fullWidth]="true" ariaLabel="Full width tabs">
      <eb-tab tabId="tab1" label="Tab 1">Content 1</eb-tab>
      <eb-tab tabId="tab2" label="Tab 2">Content 2</eb-tab>
      <eb-tab tabId="tab3" label="Tab 3">Content 3</eb-tab>
    </eb-tabs>
  `,
})
export class ExampleComponent {
  selectedTab = signal('overview');
}
```

### With Disabled Tabs

```typescript
@Component({
  template: `
    <eb-tabs ariaLabel="Settings tabs">
      <eb-tab tabId="general" label="General">
        <p>General settings...</p>
      </eb-tab>
      <eb-tab tabId="security" label="Security">
        <p>Security settings...</p>
      </eb-tab>
      <eb-tab tabId="billing" label="Billing" [disabled]="true">
        <p>Billing settings (disabled)...</p>
      </eb-tab>
    </eb-tabs>
  `,
})
export class DisabledExample {}
```

### With Icons

```typescript
@Component({
  template: `
    <eb-tabs ariaLabel="Profile tabs">
      <eb-tab tabId="profile" label="Profile" [icon]="ICON_NAMES.USER">
        <p>Profile information...</p>
      </eb-tab>
      <eb-tab tabId="notifications" label="Notifications" [icon]="ICON_NAMES.BELL">
        <p>Notification settings...</p>
      </eb-tab>
      <eb-tab tabId="security" label="Security" [icon]="ICON_NAMES.LOCK_CLOSED">
        <p>Security settings...</p>
      </eb-tab>
    </eb-tabs>
  `,
})
export class IconsExample {
  readonly ICON_NAMES = ICON_NAMES;
}
```

### Vertical Tabs

```typescript
@Component({
  template: `
    <eb-tabs orientation="vertical" ariaLabel="Vertical navigation">
      <eb-tab tabId="dashboard" label="Dashboard">
        <h2>Dashboard</h2>
        <p>Dashboard content...</p>
      </eb-tab>
      <eb-tab tabId="users" label="Users">
        <h2>Users</h2>
        <p>User management...</p>
      </eb-tab>
      <eb-tab tabId="analytics" label="Analytics">
        <h2>Analytics</h2>
        <p>Analytics data...</p>
      </eb-tab>
    </eb-tabs>
  `,
  styles: [
    `
      eb-tabs {
        display: grid;
        grid-template-columns: 200px 1fr;
        gap: 1rem;
      }
    `,
  ],
})
export class VerticalExample {}
```

### With Events

```typescript
@Component({
  template: `
    <eb-tabs
      [(activeTabId)]="activeTab"
      ariaLabel="Event tabs"
      (activeTabIdChange)="handleTabChange($event)"
      (tabChanged)="handleTabChanged($event)"
    >
      <eb-tab tabId="tab1" label="Tab 1">Content 1</eb-tab>
      <eb-tab tabId="tab2" label="Tab 2">Content 2</eb-tab>
      <eb-tab tabId="tab3" label="Tab 3">Content 3</eb-tab>
    </eb-tabs>

    <p>Active tab: {{ activeTab() }}</p>
  `,
})
export class EventsExample {
  activeTab = signal('tab1');

  handleTabChange(tabId: string) {
    console.log('Tab changed to:', tabId);
  }

  handleTabChanged(event: { tabId: string; index: number }) {
    console.log('Tab changed:', event);
  }
}
```

## Component API

### Tabs Component Inputs

| Input         | Type                                             | Default        | Description                                                                                   |
| ------------- | ------------------------------------------------ | -------------- | --------------------------------------------------------------------------------------------- |
| `variant`     | `'default' \| 'pills' \| 'underline' \| 'boxed'` | `'default'`    | Visual variant                                                                                |
| `orientation` | `'horizontal' \| 'vertical'`                     | `'horizontal'` | Tabs orientation                                                                              |
| `size`        | `'sm' \| 'md' \| 'lg'`                           | `'md'`         | Size of tabs                                                                                  |
| `activeTabId` | `string`                                         | `''`           | ID of active tab (two-way bindable)                                                           |
| `fullWidth`   | `boolean`                                        | `false`        | Whether tabs fill container width                                                             |
| `ariaLabel`   | `string`                                         | **REQUIRED**   | ARIA label for the tab list. Required to identify the tab navigation region to screen readers |

### Tabs Component Outputs

| Output              | Type                                           | Description                        |
| ------------------- | ---------------------------------------------- | ---------------------------------- |
| `activeTabIdChange` | `EventEmitter<string>`                         | Emitted when active tab changes    |
| `tabChanged`        | `EventEmitter<{tabId: string, index: number}>` | Emitted on tab change with details |

### Tab Component Inputs

| Input      | Type                    | Description                      |
| ---------- | ----------------------- | -------------------------------- |
| `tabId`    | `string`                | **REQUIRED** - Unique identifier |
| `label`    | `string`                | **REQUIRED** - Tab button label  |
| `icon`     | `IconName \| undefined` | Optional icon                    |
| `disabled` | `boolean`               | Whether tab is disabled          |

### Size Specifications

| Size | Padding | Font Size |
| ---- | ------- | --------- |
| `sm` | 12px    | 14px      |
| `md` | 16px    | 16px      |
| `lg` | 20px    | 18px      |

## Keyboard Navigation

### Horizontal Tabs

- **ArrowLeft**: Move to previous tab
- **ArrowRight**: Move to next tab
- **Home**: Move to first tab
- **End**: Move to last tab
- **Enter/Space**: Activate focused tab

### Vertical Tabs

- **ArrowUp**: Move to previous tab
- **ArrowDown**: Move to next tab
- **Home**: Move to first tab
- **End**: Move to last tab
- **Enter/Space**: Activate focused tab

## Accessibility

### WAI-ARIA Pattern

Follows the WAI-ARIA tabs pattern:

- `role="tablist"` on tab container with `aria-label`
- `role="tab"` on each tab button
- `role="tabpanel"` on each tab panel
- `aria-selected` indicates active tab
- `aria-controls` associates tab with panel
- `tabindex` management for keyboard navigation

**ARIA Label for Tab List:**
The `ariaLabel` prop is **required** and applies to the entire tab list (`role="tablist"`), not individual tabs. It identifies the tab navigation region:

```html
<!-- Good: Describes the tab group -->
<eb-tabs ariaLabel="Account settings sections">
  <eb-tab tabId="profile" label="Profile">...</eb-tab>
  <eb-tab tabId="security" label="Security">...</eb-tab>
</eb-tabs>

<!-- Individual tabs get their accessible names from the label prop -->
<eb-tab tabId="profile" label="Profile">
  <!-- "Profile" is the accessible name for this tab -->
</eb-tab>
```

**Individual Tab Labels:**
Each `<eb-tab>` component uses its `label` prop as the accessible name for the tab button. No additional `ariaLabel` is needed for individual tabs.

### Screen Reader Support

- Tab list announced with label
- Tab count announced
- Active tab state announced
- Panel content associated with tab

## Styling

Uses BEM methodology with theme integration:

```scss
.tabs {
  &__list {
    display: flex;
    border-bottom: 1px solid var(--color-border);

    &--vertical {
      flex-direction: column;
      border-bottom: none;
      border-right: 1px solid var(--color-border);
    }

    &--pills {
      border-bottom: none;
      gap: var(--space-1);
    }
  }

  &__button {
    padding: var(--tab-padding);
    border: none;
    background: transparent;
    cursor: pointer;
    transition: all var(--transition-fast);

    &--active {
      color: var(--color-primary);
      border-bottom: 2px solid var(--color-primary);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &:focus-visible {
      outline: 2px solid var(--color-focus-ring);
      outline-offset: 2px;
    }
  }
}
```

## Common Patterns

### Settings Page

```html
<eb-tabs ariaLabel="Settings">
  <eb-tab tabId="profile" label="Profile">
    <eb-form-field label="Name">
      <input type="text" />
    </eb-form-field>
  </eb-tab>
  <eb-tab tabId="security" label="Security">
    <eb-form-field label="Password">
      <input type="password" />
    </eb-form-field>
  </eb-tab>
</eb-tabs>
```

### Product Details

```html
<eb-tabs variant="underline" ariaLabel="Product information">
  <eb-tab tabId="description" label="Description">
    <p>{{ product.description }}</p>
  </eb-tab>
  <eb-tab tabId="specs" label="Specifications">
    <ul>
      <li *ngFor="let spec of product.specs">{{ spec }}</li>
    </ul>
  </eb-tab>
  <eb-tab tabId="reviews" label="Reviews">
    <div *ngFor="let review of product.reviews">{{ review.text }}</div>
  </eb-tab>
</eb-tabs>
```

## Testing

Run tests:

```bash
npm test -- tabs.component
```

## Architecture

```
tabs/
├── tabs.component.ts
├── tabs.component.html
├── tabs.component.scss
├── tabs.component.spec.ts
├── tabs.component.stories.ts
├── tab.component.ts             # Individual tab
├── index.ts
└── README.md

tab-button/                      # Internal tab button
└── ...
```

## Dependencies

- `@angular/common`: CommonModule
- `@angular/core`: Core functionality
- `tab-button`: Internal button component

## Best Practices

1. **Unique IDs**: Use unique `tabId` for each tab
2. **ARIA labels**: Always provide descriptive `ariaLabel`
3. **Content structure**: Keep tab content organized
4. **Disabled state**: Disable tabs that aren't available
5. **Initial state**: Set initial `activeTabId` for default tab

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## License

Part of the MoodyJW Portfolio project.
