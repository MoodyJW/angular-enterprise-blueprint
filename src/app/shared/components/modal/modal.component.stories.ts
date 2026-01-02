import { signal } from '@angular/core';

import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { expect, waitFor, within } from 'storybook/test';

import { ButtonComponent } from '@shared/components/button';

import { ModalComponent } from './modal.component';

const meta: Meta<ModalComponent> = {
  title: 'Shared/Modal',
  component: ModalComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [ModalComponent, ButtonComponent],
    }),
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'fullscreen', 'dialog', 'sidebar'],
      description: 'Visual variant of the modal',
      table: {
        type: { summary: 'ModalVariant' },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Size of the modal (not used for fullscreen variant)',
      table: {
        type: { summary: 'ModalSize' },
        defaultValue: { summary: 'md' },
      },
    },
    open: {
      control: 'boolean',
      description: 'Whether the modal is open',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    closeOnBackdropClick: {
      control: 'boolean',
      description: 'Whether clicking the backdrop should close the modal',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'Whether pressing ESC should close the modal',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    showCloseButton: {
      control: 'boolean',
      description: 'Whether to show the close button',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    preventBodyScroll: {
      control: 'boolean',
      description: 'Whether to prevent body scroll when modal is open',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    ariaLabel: {
      control: 'text',
      description: 'ARIA label for the modal (required)',
      table: {
        type: { summary: 'string' },
      },
    },
    ariaDescribedBy: {
      control: 'text',
      description: 'ID of element that describes the modal',
    },
    ariaLabelledBy: {
      control: 'text',
      description: 'ID of element that labels the modal',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
### Accessible Modal/Dialog Component

A WCAG 2.1 AAA compliant modal component with:
- Focus trapping (CDK A11y)
- Keyboard navigation (ESC to close, Tab trapping)
- Screen reader support
- Backdrop with configurable click-to-close
- Multiple variants and sizes
- Animations that respect prefers-reduced-motion
- Body scroll lock
- Content projection slots (header, body, footer)

#### Accessibility Features
- **Focus Management**: Auto-focuses modal on open, traps focus within modal, restores focus on close
- **Keyboard Support**: ESC to close, Tab/Shift+Tab to navigate
- **ARIA**: Proper role="dialog", aria-modal, and labeling
- **Screen Readers**: Announced when opened, clear semantic structure

#### Usage Notes
- Always provide an \`ariaLabel\` for accessibility
- Use \`ariaLabelledBy\` when modal has a visible heading
- The modal prevents body scroll by default
- Backdrop click and ESC key close the modal by default
        `,
      },
    },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'focus-order', enabled: true },
          { id: 'aria-required-attr', enabled: true },
        ],
      },
    },
  },
};

export default meta;
type Story = StoryObj<ModalComponent>;

/**
 * Default modal with header, body, and footer.
 * Click "Open Modal" button to view the modal.
 */
export const Default: Story = {
  args: {
    variant: 'default',
    size: 'md',
    open: false,
    closeOnBackdropClick: true,
    closeOnEscape: true,
    showCloseButton: true,
    preventBodyScroll: true,
    ariaLabel: 'Example modal dialog',
  },
  render: (args) => {
    const isOpenSignal = signal(false);
    return {
      props: {
        ...args,
        isOpen: isOpenSignal,
        openModal() {
          isOpenSignal.set(true);
        },
        closeModal() {
          isOpenSignal.set(false);
        },
      },
      template: `
      <eb-button
        variant="primary"
        ariaLabel="Open modal dialog"
        (clicked)="openModal()">
        Open Modal
      </eb-button>

      <eb-modal
        [open]="isOpen()"
        [variant]="variant"
        [size]="size"
        [closeOnBackdropClick]="closeOnBackdropClick"
        [closeOnEscape]="closeOnEscape"
        [showCloseButton]="showCloseButton"
        [preventBodyScroll]="preventBodyScroll"
        [ariaLabel]="ariaLabel"
        (closed)="closeModal()">

        <div modal-header>
          <h2 style="margin: 0; font-size: 1.5rem; font-weight: 600;">Modal Title</h2>
        </div>

        <div modal-body>
          <p style="margin: 0 0 1rem 0;">
            This is a default modal dialog with header, body, and footer sections.
            It demonstrates the basic structure and functionality.
          </p>
          <p style="margin: 0;">
            You can close this modal by clicking the X button, clicking the backdrop,
            pressing the ESC key, or clicking the Cancel button.
          </p>
        </div>

        <div modal-footer>
          <eb-button
            variant="secondary"
            ariaLabel="Cancel"
            (clicked)="closeModal()">
            Cancel
          </eb-button>
          <eb-button
            variant="primary"
            ariaLabel="Confirm"
            (clicked)="closeModal()">
            Confirm
          </eb-button>
        </div>
      </eb-modal>
    `,
    };
  },
};

/**
 * Small modal for confirmations and alerts.
 */
export const SmallSize: Story = {
  args: {
    ...Default.args,
    size: 'sm',
    ariaLabel: 'Delete confirmation dialog',
  },
  render: (args) => {
    const isOpenSignal = signal(false);
    return {
      props: {
        ...args,
        isOpen: isOpenSignal,
        openModal() {
          isOpenSignal.set(true);
        },
        closeModal() {
          isOpenSignal.set(false);
        },
      },
      template: `
      <eb-button
        variant="danger"
        ariaLabel="Delete item"
        (clicked)="openModal()">
        Delete Item
      </eb-button>

      <eb-modal
        [open]="isOpen()"
        [size]="size"
        [ariaLabel]="ariaLabel"
        (closed)="closeModal()">

        <div modal-header>
          <h2 style="margin: 0; font-size: 1.25rem; font-weight: 600;">Confirm Delete</h2>
        </div>

        <div modal-body>
          <p style="margin: 0;">
            Are you sure you want to delete this item? This action cannot be undone.
          </p>
        </div>

        <div modal-footer>
          <eb-button
            variant="secondary"
            ariaLabel="Cancel deletion"
            (clicked)="closeModal()">
            Cancel
          </eb-button>
          <eb-button
            variant="danger"
            ariaLabel="Confirm deletion"
            (clicked)="closeModal()">
            Delete
          </eb-button>
        </div>
      </eb-modal>
    `,
    };
  },
};

/**
 * Large modal for complex forms or detailed content.
 */
export const LargeSize: Story = {
  args: {
    ...Default.args,
    size: 'lg',
    ariaLabel: 'User profile settings',
  },
  render: (args) => {
    const isOpenSignal = signal(false);
    return {
      props: {
        ...args,
        isOpen: isOpenSignal,
        openModal() {
          isOpenSignal.set(true);
        },
        closeModal() {
          isOpenSignal.set(false);
        },
      },
      template: `
      <eb-button
        variant="primary"
        ariaLabel="Open settings"
        (clicked)="openModal()">
        Open Settings
      </eb-button>

      <eb-modal
        [open]="isOpen()"
        [size]="size"
        [ariaLabel]="ariaLabel"
        (closed)="closeModal()">

        <div modal-header>
          <h2 style="margin: 0; font-size: 1.5rem; font-weight: 600;">User Profile Settings</h2>
        </div>

        <div modal-body>
          <div style="margin-bottom: 1.5rem;">
            <h3 style="margin: 0 0 0.5rem 0; font-size: 1.125rem;">Personal Information</h3>
            <p style="margin: 0; color: var(--color-text-secondary);">
              Update your personal details and preferences.
            </p>
          </div>
          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Full Name</label>
            <input
              type="text"
              value="John Doe"
              style="width: 100%; padding: 0.5rem; border: 1px solid var(--color-border); border-radius: 4px;"
              aria-label="Full name">
          </div>
          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Email</label>
            <input
              type="email"
              value="john@example.com"
              style="width: 100%; padding: 0.5rem; border: 1px solid var(--color-border); border-radius: 4px;"
              aria-label="Email address">
          </div>
          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Bio</label>
            <textarea
              rows="4"
              style="width: 100%; padding: 0.5rem; border: 1px solid var(--color-border); border-radius: 4px;"
              aria-label="Bio">Software developer and designer...</textarea>
          </div>
        </div>

        <div modal-footer>
          <eb-button
            variant="secondary"
            ariaLabel="Cancel changes"
            (clicked)="closeModal()">
            Cancel
          </eb-button>
          <eb-button
            variant="primary"
            ariaLabel="Save changes"
            (clicked)="closeModal()">
            Save Changes
          </eb-button>
        </div>
      </eb-modal>
    `,
    };
  },
};

/**
 * Extra large modal for galleries or extensive content.
 */
export const ExtraLargeSize: Story = {
  args: {
    ...Default.args,
    size: 'xl',
    ariaLabel: 'Image gallery',
  },
  render: (args) => {
    const isOpenSignal = signal(false);
    return {
      props: {
        ...args,
        isOpen: isOpenSignal,
        openModal() {
          isOpenSignal.set(true);
        },
        closeModal() {
          isOpenSignal.set(false);
        },
      },
      template: `
      <eb-button
        variant="primary"
        ariaLabel="View gallery"
        (clicked)="openModal()">
        View Gallery
      </eb-button>

      <eb-modal
        [open]="isOpen()"
        [size]="size"
        [ariaLabel]="ariaLabel"
        (closed)="closeModal()">

        <div modal-header>
          <h2 style="margin: 0; font-size: 1.5rem; font-weight: 600;">Project Gallery</h2>
        </div>

        <div modal-body>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;">
            ${Array.from(
              { length: 6 },
              (_, i) => `
              <div style="aspect-ratio: 16/9; background: var(--color-border); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <span style="color: var(--color-text-secondary);">Image ${String(i + 1)}</span>
              </div>
            `,
            ).join('')}
          </div>
        </div>

        <div modal-footer>
          <eb-button
            variant="secondary"
            ariaLabel="Close gallery"
            (clicked)="closeModal()">
            Close
          </eb-button>
        </div>
      </eb-modal>
    `,
    };
  },
};

/**
 * Fullscreen modal that takes the entire viewport.
 * Useful for mobile experiences or immersive content.
 */
export const Fullscreen: Story = {
  args: {
    ...Default.args,
    variant: 'fullscreen',
    ariaLabel: 'Fullscreen content viewer',
  },
  render: (args) => {
    const isOpenSignal = signal(false);
    return {
      props: {
        ...args,
        isOpen: isOpenSignal,
        openModal() {
          isOpenSignal.set(true);
        },
        closeModal() {
          isOpenSignal.set(false);
        },
      },
      template: `
      <eb-button
        variant="primary"
        ariaLabel="Open fullscreen"
        (clicked)="openModal()">
        Open Fullscreen
      </eb-button>

      <eb-modal
        [open]="isOpen()"
        [variant]="variant"
        [ariaLabel]="ariaLabel"
        (closed)="closeModal()">

        <div modal-header>
          <h2 style="margin: 0; font-size: 1.5rem; font-weight: 600;">Fullscreen Modal</h2>
        </div>

        <div modal-body>
          <p style="margin: 0 0 1rem 0;">
            This modal takes up the entire viewport, perfect for mobile experiences
            or when you need to show immersive content.
          </p>
          <p style="margin: 0;">
            The modal will automatically switch to fullscreen on mobile devices
            even when using the default variant.
          </p>
        </div>

        <div modal-footer>
          <eb-button
            variant="primary"
            ariaLabel="Close fullscreen"
            (clicked)="closeModal()">
            Close
          </eb-button>
        </div>
      </eb-modal>
    `,
    };
  },
};

/**
 * Sidebar modal that slides in from the right.
 * Great for filters, settings, or navigation.
 */
export const Sidebar: Story = {
  args: {
    ...Default.args,
    variant: 'sidebar',
    ariaLabel: 'Filters sidebar',
  },
  render: (args) => {
    const isOpenSignal = signal(false);
    return {
      props: {
        ...args,
        isOpen: isOpenSignal,
        openModal() {
          isOpenSignal.set(true);
        },
        closeModal() {
          isOpenSignal.set(false);
        },
      },
      template: `
      <eb-button
        variant="secondary"
        ariaLabel="Open filters"
        (clicked)="openModal()">
        Open Filters
      </eb-button>

      <eb-modal
        [open]="isOpen()"
        [variant]="variant"
        [ariaLabel]="ariaLabel"
        (closed)="closeModal()">

        <div modal-header>
          <h2 style="margin: 0; font-size: 1.25rem; font-weight: 600;">Filters</h2>
        </div>

        <div modal-body>
          <div style="margin-bottom: 1.5rem;">
            <h3 style="margin: 0 0 0.75rem 0; font-size: 0.875rem; font-weight: 600; text-transform: uppercase; color: var(--color-text-secondary);">Category</h3>
            <label style="display: flex; align-items: center; margin-bottom: 0.5rem;">
              <input type="checkbox" style="margin-right: 0.5rem;" aria-label="Technology filter">
              <span>Technology</span>
            </label>
            <label style="display: flex; align-items: center; margin-bottom: 0.5rem;">
              <input type="checkbox" style="margin-right: 0.5rem;" aria-label="Design filter">
              <span>Design</span>
            </label>
            <label style="display: flex; align-items: center;">
              <input type="checkbox" style="margin-right: 0.5rem;" aria-label="Business filter">
              <span>Business</span>
            </label>
          </div>
          <div>
            <h3 style="margin: 0 0 0.75rem 0; font-size: 0.875rem; font-weight: 600; text-transform: uppercase; color: var(--color-text-secondary);">Price Range</h3>
            <input
              type="range"
              min="0"
              max="100"
              value="50"
              style="width: 100%;"
              aria-label="Price range">
          </div>
        </div>

        <div modal-footer>
          <eb-button
            variant="secondary"
            ariaLabel="Clear filters"
            (clicked)="closeModal()">
            Clear
          </eb-button>
          <eb-button
            variant="primary"
            ariaLabel="Apply filters"
            (clicked)="closeModal()">
            Apply
          </eb-button>
        </div>
      </eb-modal>
    `,
    };
  },
};

/**
 * Dialog variant for simple confirmations.
 */
export const Dialog: Story = {
  args: {
    ...Default.args,
    variant: 'dialog',
    ariaLabel: 'Success notification',
  },
  render: (args) => {
    const isOpenSignal = signal(false);
    return {
      props: {
        ...args,
        isOpen: isOpenSignal,
        openModal() {
          isOpenSignal.set(true);
        },
        closeModal() {
          isOpenSignal.set(false);
        },
      },
      template: `
      <eb-button
        variant="primary"
        ariaLabel="Show success"
        (clicked)="openModal()">
        Show Success
      </eb-button>

      <eb-modal
        [open]="isOpen()"
        [variant]="variant"
        [ariaLabel]="ariaLabel"
        (closed)="closeModal()">

        <div modal-body style="text-align: center; padding: 2rem;">
          <div style="width: 64px; height: 64px; margin: 0 auto 1rem; background: var(--color-success); border-radius: var(--border-radius-half); display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem;">
            ✓
          </div>
          <h2 style="margin: 0 0 0.5rem 0; font-size: 1.25rem; font-weight: 600;">Success!</h2>
          <p style="margin: 0; color: var(--color-text-secondary);">
            Your changes have been saved successfully.
          </p>
        </div>

        <div modal-footer style="justify-content: center;">
          <eb-button
            variant="primary"
            ariaLabel="Close success dialog"
            (clicked)="closeModal()">
            OK
          </eb-button>
        </div>
      </eb-modal>
    `,
    };
  },
};

/**
 * Modal without close button.
 * User must use action buttons to close.
 */
export const NoCloseButton: Story = {
  args: {
    ...Default.args,
    showCloseButton: false,
    closeOnBackdropClick: false,
    closeOnEscape: false,
    ariaLabel: 'Important notice',
  },
  render: (args) => {
    const isOpenSignal = signal(false);
    return {
      props: {
        ...args,
        isOpen: isOpenSignal,
        openModal() {
          isOpenSignal.set(true);
        },
        closeModal() {
          isOpenSignal.set(false);
        },
      },
      template: `
      <eb-button
        variant="primary"
        ariaLabel="Show notice"
        (clicked)="openModal()">
        Show Important Notice
      </eb-button>

      <eb-modal
        [open]="isOpen()"
        [showCloseButton]="showCloseButton"
        [closeOnBackdropClick]="closeOnBackdropClick"
        [closeOnEscape]="closeOnEscape"
        [ariaLabel]="ariaLabel"
        (closed)="closeModal()">

        <div modal-header>
          <h2 style="margin: 0; font-size: 1.5rem; font-weight: 600;">Important Notice</h2>
        </div>

        <div modal-body>
          <p style="margin: 0 0 1rem 0;">
            Please read and acknowledge this important information before proceeding.
          </p>
          <p style="margin: 0;">
            This modal cannot be dismissed by clicking outside or pressing ESC.
            You must click the "I Understand" button to continue.
          </p>
        </div>

        <div modal-footer>
          <eb-button
            variant="primary"
            ariaLabel="Acknowledge and close"
            (clicked)="closeModal()">
            I Understand
          </eb-button>
        </div>
      </eb-modal>
    `,
    };
  },
};

/**
 * Modal with scrollable content.
 */
export const LongContent: Story = {
  args: {
    ...Default.args,
    ariaLabel: 'Terms and conditions',
  },
  render: (args) => {
    const isOpenSignal = signal(false);
    return {
      props: {
        ...args,
        isOpen: isOpenSignal,
        openModal() {
          isOpenSignal.set(true);
        },
        closeModal() {
          isOpenSignal.set(false);
        },
      },
      template: `
      <eb-button
        variant="secondary"
        ariaLabel="View terms"
        (clicked)="openModal()">
        View Terms & Conditions
      </eb-button>

      <eb-modal
        [open]="isOpen()"
        [ariaLabel]="ariaLabel"
        (closed)="closeModal()">

        <div modal-header>
          <h2 style="margin: 0; font-size: 1.5rem; font-weight: 600;">Terms & Conditions</h2>
        </div>

        <div modal-body>
          ${Array.from(
            { length: 10 },
            (_, i) => `
            <h3 style="margin: ${
              i === 0 ? '0' : '1.5rem'
            } 0 0.5rem 0; font-size: 1.125rem;">Section ${String(i + 1)}</h3>
            <p style="margin: 0 0 1rem 0; line-height: 1.6;">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
              quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          `,
          ).join('')}
        </div>

        <div modal-footer>
          <eb-button
            variant="secondary"
            ariaLabel="Decline terms"
            (clicked)="closeModal()">
            Decline
          </eb-button>
          <eb-button
            variant="primary"
            ariaLabel="Accept terms"
            (clicked)="closeModal()">
            Accept
          </eb-button>
        </div>
      </eb-modal>
    `,
    };
  },
};

/**
 * Modal demonstrating keyboard navigation and accessibility.
 * Try using Tab, Shift+Tab, and ESC keys.
 */
export const KeyboardNavigation: Story = {
  args: {
    ...Default.args,
    ariaLabel: 'Keyboard navigation demo',
  },
  render: (args) => {
    const isOpenSignal = signal(false);
    return {
      props: {
        ...args,
        isOpen: isOpenSignal,
        openModal() {
          isOpenSignal.set(true);
        },
        closeModal() {
          isOpenSignal.set(false);
        },
      },
      template: `
      <eb-button
        variant="primary"
        ariaLabel="Open keyboard demo"
        (clicked)="openModal()">
        Try Keyboard Navigation
      </eb-button>

      <eb-modal
        [open]="isOpen()"
        [ariaLabel]="ariaLabel"
        (closed)="closeModal()">

        <div modal-header>
          <h2 style="margin: 0; font-size: 1.5rem; font-weight: 600;">Keyboard Navigation Demo</h2>
        </div>

        <div modal-body>
          <p style="margin: 0 0 1rem 0;">
            This modal demonstrates full keyboard accessibility:
          </p>
          <ul style="margin: 0 0 1rem 0; padding-left: 1.5rem;">
            <li><strong>Tab</strong>: Move to next focusable element (trapped within modal)</li>
            <li><strong>Shift + Tab</strong>: Move to previous focusable element</li>
            <li><strong>ESC</strong>: Close the modal</li>
            <li><strong>Enter/Space</strong>: Activate buttons</li>
          </ul>
          <div>
            <input
              type="text"
              placeholder="Try tabbing through these fields"
              style="width: 100%; padding: 0.5rem; margin-bottom: 0.5rem; border: 1px solid var(--color-border); border-radius: 4px;"
              aria-label="First input field">
            <input
              type="text"
              placeholder="Focus is trapped in this modal"
              style="width: 100%; padding: 0.5rem; border: 1px solid var(--color-border); border-radius: 4px;"
              aria-label="Second input field">
          </div>
        </div>

        <div modal-footer>
          <eb-button
            variant="secondary"
            ariaLabel="Cancel"
            (clicked)="closeModal()">
            Cancel
          </eb-button>
          <eb-button
            variant="primary"
            ariaLabel="Submit"
            (clicked)="closeModal()">
            Submit
          </eb-button>
        </div>
      \u003c/eb-modal\u003e
    `,
    };
  },
};

/**
 * Interactive test story demonstrating automated user interactions.
 * Click the "Play" button in the Storybook toolbar to run the interaction test.
 */
export const InteractionTest: Story = {
  args: {
    ...Default.args,
    ariaLabel: 'Interaction test modal',
  },
  render: (args) => {
    const isOpenSignal = signal(false);
    return {
      props: {
        ...args,
        isOpen: isOpenSignal,
        openModal() {
          isOpenSignal.set(true);
        },
        closeModal() {
          isOpenSignal.set(false);
        },
      },
      template: `
      <eb-button
        variant="primary"
        ariaLabel="Open modal"
        data-testid="open-modal-btn"
        (clicked)="openModal()">
        Open Modal
      </eb-button>

      <eb-modal
        [open]="isOpen()"
        [ariaLabel]="ariaLabel"
        data-testid="modal"
        (closed)="closeModal()">

        <div modal-header>
          <h2 style="margin: 0; font-size: 1.5rem; font-weight: 600;" data-testid="modal-title">Interactive Test Modal</h2>
        </div>

        <div modal-body>
          <p data-testid="modal-content">This story demonstrates Storybook interaction tests.</p>
        </div>

        <div modal-footer>
          <eb-button
            variant="secondary"
            ariaLabel="Cancel"
            data-testid="cancel-btn"
            (clicked)="closeModal()">
            Cancel
          </eb-button>
          <eb-button
            variant="primary"
            ariaLabel="Confirm"
            data-testid="confirm-btn"
            (clicked)="closeModal()">
            Confirm
          </eb-button>
        </div>
      </eb-modal>
    `,
    };
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const doc = canvasElement.ownerDocument;

    // Step 1: Verify the "Open Modal" button is visible
    const openButton = canvas.getByTestId('open-modal-btn');
    await expect(openButton).toBeVisible();

    // Step 2: Click the button to open the modal using native click
    // Note: We target the actual button element inside our custom component
    const nativeButton = openButton.querySelector('button') ?? openButton;
    nativeButton.click();

    // Step 3: Wait for Angular change detection and modal animation
    await waitFor(
      async () => {
        const modalTitle = doc.querySelector('[data-testid="modal-title"]');
        await expect(modalTitle).not.toBeNull();
      },
      { timeout: 3000, interval: 100 },
    );

    // Step 4: Verify modal content is displayed
    const modalContent = doc.querySelector('[data-testid="modal-content"]');
    await expect(modalContent).toHaveTextContent(
      'This story demonstrates Storybook interaction tests.',
    );

    // Step 5: Verify action buttons are present
    const cancelBtn = doc.querySelector('[data-testid="cancel-btn"]');
    const confirmBtn = doc.querySelector('[data-testid="confirm-btn"]');
    await expect(cancelBtn).not.toBeNull();
    await expect(confirmBtn).not.toBeNull();

    // Step 6: Click the Cancel button to close the modal
    const cancelNativeBtn = (cancelBtn as HTMLElement).querySelector('button') ?? cancelBtn;
    (cancelNativeBtn as HTMLElement).click();

    // Step 7: Wait for modal to close (animation + change detection)
    await waitFor(
      async () => {
        const modalTitle = doc.querySelector('[data-testid="modal-title"]');
        await expect(modalTitle).toBeNull();
      },
      { timeout: 3000, interval: 100 },
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
This story includes automated interaction tests using Storybook's play function.

**Test steps:**
1. ✅ Verify "Open Modal" button is visible
2. ✅ Click button to open modal
3. ✅ Wait for modal to appear
4. ✅ Verify modal title and content
5. ✅ Verify Cancel and Confirm buttons are present
6. ✅ Click Cancel to close modal
7. ✅ Verify modal closes

Click the **Play** button in the Storybook toolbar to run these interaction tests.
        `,
      },
    },
  },
};
