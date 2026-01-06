# Accessibility Guidelines

This document outlines accessibility standards, testing practices, and implementation patterns for the Angular Enterprise Blueprint.

## Compliance Target

**WCAG 2.1 Level AAA** for all shared components, with emphasis on:

- **Color Contrast**: 7:1 minimum for normal text, 4.5:1 for large text
- **Focus Indicators**: Visible focus rings on all interactive elements
- **Keyboard Navigation**: Full keyboard operability for all functionality
- **Screen Reader Support**: Proper ARIA attributes and semantic HTML

## Testing Strategy

### Automated Testing

#### Storybook Test Runner

`npm run test-storybook`

- Runs axe-core accessibility audits on all component stories
- Configured to fail on violations and inconclusive results
- Tests all 6 themes for color contrast compliance
- Configuration: [.storybook/test-runner.ts](../.storybook/test-runner.ts)

```typescript
// Key settings
checkA11y(page, '#storybook-root', {
  runOnly: {
    type: 'tag',
    values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
  },
});
```

#### Storybook A11y Addon

- Interactive accessibility panel in Storybook UI
- Real-time violation highlighting
- Per-story rule configuration via `parameters.a11y`

#### Lighthouse CI

`npm run lighthouse`

- Automated performance and accessibility audits
- Runs against production build
- Accessibility score threshold enforced in CI
- Reports generated for each build

### Manual Testing

- Tab through all interactive elements
- Test with screen reader (VoiceOver, NVDA, or JAWS)
- Verify reduced motion preferences respected
- Test high-contrast themes

## Component Patterns

### ARIA Labels

```html
<!-- Icon-only buttons REQUIRE aria-label -->
<eb-button iconLeft="heroTrash" [iconOnly]="true" ariaLabel="Delete item" />

<!-- Text buttons inherit accessible name from content -->
<eb-button>Submit Form</eb-button>
```

### Keyboard Navigation

| Pattern           | Keys                          | Usage                  |
| ----------------- | ----------------------------- | ---------------------- |
| Button activation | `Enter`, `Space`              | All buttons            |
| Dropdown toggle   | `Enter`, `Space`, `ArrowDown` | Select, Theme Picker   |
| List navigation   | `ArrowUp`, `ArrowDown`        | Dropdown options, Tabs |
| Dismiss/Close     | `Escape`                      | Modal, Dropdown, Toast |
| First/Last        | `Home`, `End`                 | Lists, Tabs            |

### Focus Management

```scss
// Standard focus indicator
&:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}
```

### Reduced Motion

```scss
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Theme Accessibility

| Theme               | Type          | Contrast Target |
| ------------------- | ------------- | --------------- |
| light-default       | Standard      | AA (4.5:1)      |
| light-warm          | Standard      | AA (4.5:1)      |
| dark-default        | Standard      | AA (4.5:1)      |
| dark-cool           | Standard      | AA (4.5:1)      |
| high-contrast-light | Accessibility | AAA (7:1)       |
| high-contrast-dark  | Accessibility | AAA (7:1)       |

High-contrast themes also include:

- Thicker borders (2-5px vs 1px)
- No transparency/opacity effects
- Maximum color separation

## Story Configuration

Disable rules for specific stories when needed:

```typescript
export const MyStory: Story = {
  parameters: {
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: false }, // Disable specific rule
        ],
      },
    },
  },
};
```

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [axe-core Rules](https://dequeuniversity.com/rules/axe/)

## Component Documentation

Each component README includes an **Accessibility** section with component-specific details:

- [Button](../src/app/shared/components/button/README.md#accessibility)
- [Modal](../src/app/shared/components/modal/README.md#accessibility)
- [Tabs](../src/app/shared/components/tabs/README.md#accessibility)
- [Select](../src/app/shared/components/select/README.md#accessibility)
- [Tooltip](../src/app/shared/components/tooltip/README.md#accessibility)
