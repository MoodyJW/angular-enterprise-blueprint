# UserMenu Component

A dropdown menu component for authenticated users, displaying user details and providing a logout action.

## Usage

```html
<eb-user-menu [user]="currentUser" (logout)="onLogout()" />
```

## Inputs

| Input  | Type   | Required | Description                        |
| ------ | ------ | -------- | ---------------------------------- |
| `user` | `User` | Yes      | The authenticated user to display. |

## Outputs

| Output   | Type   | Description                                |
| -------- | ------ | ------------------------------------------ |
| `logout` | `void` | Emitted when the logout action is clicked. |

## Features

- **CDK Overlay**: Menu is positioned using Angular CDK for proper viewport handling.
- **Focus Trap**: Focus is trapped within the menu when open for keyboard accessibility.
- **Backdrop Close**: Clicking outside the menu closes it.
- **Keyboard Navigation**: Tab, Enter, and Escape work as expected.

## Accessibility

- `aria-haspopup="menu"` on the trigger button.
- `aria-expanded` reflects the open/closed state.
- Focus is trapped within the menu when open.
- Backdrop click and Escape key close the menu.
