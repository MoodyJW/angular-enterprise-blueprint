# NavDropdown Component

A navigation dropdown menu component for the application header, supporting both internal routes and external links.

## Features

- **CDK Overlay Positioning**: Uses Angular CDK for proper dropdown positioning
- **Keyboard Navigation**: Escape key closes the dropdown
- **Focus Trapping**: Maintains focus within the dropdown for accessibility
- **Internal Routes**: Supports Angular Router links with active state
- **External Links**: Opens in new tab with proper security attributes
- **Animated Indicator**: Chevron rotates when dropdown is open

## Usage

```html
<eb-nav-dropdown [label]="'Resources'" [items]="resourceItems" />
```

```typescript
const resourceItems: NavItem[] = [
  { labelKey: 'Modules', route: '/modules' },
  { labelKey: 'Architecture', route: '/architecture' },
  { labelKey: 'Storybook', route: '/storybook', external: true },
  { labelKey: 'Documentation', route: '/docs', external: true },
];
```

## API

### Inputs

| Input   | Type        | Required | Description                           |
| ------- | ----------- | -------- | ------------------------------------- |
| `label` | `string`    | Yes      | Label displayed on the trigger button |
| `items` | `NavItem[]` | Yes      | Navigation items for the dropdown     |

### NavItem Interface

```typescript
interface NavItem {
  labelKey: string; // Display text (or translation key)
  route?: string; // Route path or external URL
  external?: boolean; // If true, opens in new tab
  icon?: string; // Optional icon name
  children?: NavItem[]; // Nested items (for sub-menus)
}
```

## Accessibility

- `aria-expanded` indicates dropdown state
- `aria-haspopup="menu"` indicates menu behavior
- `role="menu"` on dropdown container
- `role="menuitem"` on each item
- Focus is trapped within dropdown when open
- Escape key closes the dropdown

## Styling

The component uses BEM naming conventions with the `.nav-dropdown` block:

- `.nav-dropdown__trigger` - The button that opens the dropdown
- `.nav-dropdown__trigger--open` - Applied when dropdown is open
- `.nav-dropdown__label` - The text label
- `.nav-dropdown__chevron` - The chevron icon
- `.nav-dropdown__chevron--open` - Rotated state
- `.nav-dropdown__menu` - The dropdown panel
- `.nav-dropdown__item` - Individual menu items
- `.nav-dropdown__item--active` - Active route state
- `.nav-dropdown__item--external` - External link styling
