# ADR-003: Component Library Architecture

## Status

Accepted

## Date

2025-12-16

## Context

The Angular Enterprise Blueprint requires a reusable component library that:

- Provides consistent UI across the application
- Follows accessibility standards (WCAG 2.1 AA)
- Supports theming and customization
- Is well-documented and testable

### Options Considered

1. **Angular Material** - Google's official component library
2. **PrimeNG** - Feature-rich commercial-quality components
3. **Custom Component Library** - Built from scratch with project-specific needs
4. **NG-Bootstrap** - Bootstrap port for Angular

## Decision

We chose to build a **Custom Component Library** using standalone components with BEM CSS methodology.

### Rationale

1. **Learning Showcase**: Demonstrates component architecture skills for portfolio
2. **Full Control**: Complete control over accessibility, theming, and behavior
3. **Minimal Dependencies**: No external component library dependencies
4. **Storybook Integration**: Each component documented with interactive examples

## Implementation

### Component Structure

```
src/app/shared/components/{component}/
├── {component}.component.ts      # Component class
├── {component}.component.html    # Template
├── {component}.component.scss    # BEM styles
├── {component}.component.spec.ts # Unit tests
├── {component}.component.stories.ts # Storybook
└── index.ts                      # Barrel export
```

### Design Principles

1. **Standalone Components**: All components use `standalone: true`
2. **Signal Inputs**: Use `input()` and `output()` signal APIs
3. **OnPush Change Detection**: All components use `ChangeDetectionStrategy.OnPush`
4. **BEM Naming**: `.block__element--modifier` CSS structure

### Accessibility Features

```typescript
@Component({
  selector: 'eb-button',
  host: {
    '[attr.role]': 'role()',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-disabled]': 'disabled()',
  },
})
export class ButtonComponent {
  readonly ariaLabel = input<string>();
  readonly disabled = input(false);
}
```

### Shared Components

| Component               | Purpose                        |
| ----------------------- | ------------------------------ |
| `eb-badge`              | Status indicators and labels   |
| `eb-breadcrumb`         | Navigation path display        |
| `eb-button`             | Actions with loading states    |
| `eb-button-content`     | Internal button content layout |
| `eb-card`               | Content containers             |
| `eb-checkbox`           | Boolean form inputs            |
| `eb-checkbox-checkmark` | Internal checkmark icon        |
| `eb-container`          | Page-level content wrapper     |
| `eb-divider`            | Visual separator               |
| `eb-form-field`         | Form field wrapper with labels |
| `eb-grid`               | Responsive grid layout         |
| `eb-icon`               | SVG icon wrapper               |
| `eb-input`              | Text inputs with validation    |
| `eb-input-footer`       | Input hint/error messages      |
| `eb-input-label`        | Input label element            |
| `eb-loading-spinner`    | Loading state indicator        |
| `eb-modal`              | Dialog/modal windows           |
| `eb-page-not-found`     | 404 error page                 |
| `eb-radio`              | Radio button inputs            |
| `eb-select`             | Dropdown selection             |
| `eb-skeleton`           | Content loading placeholder    |
| `eb-stack`              | Vertical/horizontal layout     |
| `eb-tab-button`         | Individual tab trigger         |
| `eb-tabs`               | Tabbed content navigation      |
| `eb-textarea`           | Multi-line text inputs         |
| `eb-theme-picker`       | Theme selection control        |
| `eb-toast`              | Notification messages          |

## Consequences

### Positive

- Complete control over component behavior and styling
- Demonstrates frontend architecture skills
- Optimized bundle size (only what's needed)
- 100% test coverage achievable

### Negative

- Significant development time investment
- Missing advanced features of mature libraries
- Ongoing maintenance responsibility

### Neutral

- Requires Storybook for documentation
- Learning curve for project contributors

## References

- [BEM Methodology](https://getbem.com/)
- [Angular Standalone Components](https://angular.dev/guide/components/standalone)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
