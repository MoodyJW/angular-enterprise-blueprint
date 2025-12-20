import { Component, inject } from '@angular/core';

import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, argsToTemplate } from '@storybook/angular';

import { ToastService } from '../../services/toast/toast.service';

import { ToastContainerComponent } from './toast-container.component';
import { ToastComponent } from './toast.component';

const meta: Meta<ToastComponent> = {
  title: 'Shared/Toast',
  component: ToastComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [
        {
          provide: ToastService,
          useClass: ToastService,
        },
      ],
    }),
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'error', 'warning', 'info'],
      description: 'Visual variant of the toast',
      table: {
        type: { summary: 'ToastVariant' },
        defaultValue: { summary: 'info' },
      },
    },
    message: {
      control: 'text',
      description: 'The message to display (REQUIRED)',
    },
    title: {
      control: 'text',
      description: 'Optional title for the toast',
    },
    duration: {
      control: 'number',
      description: 'Auto-dismiss duration in ms (0 = no auto-dismiss)',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '5000' },
      },
    },
    dismissible: {
      control: 'boolean',
      description: 'Whether the toast can be manually dismissed',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    position: {
      control: 'select',
      options: [
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
      ],
      description: 'Position of the toast on screen',
      table: {
        type: { summary: 'ToastPosition' },
        defaultValue: { summary: 'top-right' },
      },
    },
    isExiting: {
      control: 'boolean',
      description: 'Whether the toast is currently animating out',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Toast notification component for displaying temporary messages. Supports auto-dismiss, manual dismiss, and multiple variants (success, error, warning, info). Follows WCAG 2.1 AAA guidelines.',
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'region',
            enabled: true,
          },
        ],
      },
    },
  },
};

export default meta;
type Story = StoryObj<ToastComponent>;

// Success Toast
export const Success: Story = {
  args: {
    variant: 'success',
    message: 'Changes saved successfully!',
    title: 'Success',
  },
  render: (args) => ({
    props: args,
    template: `<eb-toast ${argsToTemplate(args)}></eb-toast>`,
  }),
};

// Error Toast
export const Error: Story = {
  args: {
    variant: 'error',
    message: 'Failed to save changes. Please try again.',
    title: 'Error',
  },
  render: (args) => ({
    props: args,
    template: `<eb-toast ${argsToTemplate(args)}></eb-toast>`,
  }),
};

// Warning Toast
export const Warning: Story = {
  args: {
    variant: 'warning',
    message: 'Your session will expire in 5 minutes.',
    title: 'Warning',
  },
  render: (args) => ({
    props: args,
    template: `<eb-toast ${argsToTemplate(args)}></eb-toast>`,
  }),
};

// Info Toast
export const Info: Story = {
  args: {
    variant: 'info',
    message: 'A new version of the app is available.',
    title: 'Info',
  },
  render: (args) => ({
    props: args,
    template: `<eb-toast ${argsToTemplate(args)}></eb-toast>`,
  }),
};

// All Variants
export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <eb-toast variant="success" message="Operation completed successfully!" title="Success"></eb-toast>
        <eb-toast variant="error" message="An error occurred while processing your request." title="Error"></eb-toast>
        <eb-toast variant="warning" message="This action cannot be undone." title="Warning"></eb-toast>
        <eb-toast variant="info" message="Here's some helpful information." title="Info"></eb-toast>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'All toast variants displayed together for comparison.',
      },
    },
  },
};

// Without Title
export const WithoutTitle: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <eb-toast variant="success" message="Changes saved successfully!"></eb-toast>
        <eb-toast variant="error" message="Something went wrong."></eb-toast>
        <eb-toast variant="warning" message="Please review your changes."></eb-toast>
        <eb-toast variant="info" message="New features available."></eb-toast>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Toasts without titles for simpler messages.',
      },
    },
  },
};

// Long Message
export const LongMessage: Story = {
  args: {
    variant: 'info',
    title: 'Important Notice',
    message:
      'This is a longer message that demonstrates how the toast component handles text wrapping and multi-line content. The component should gracefully handle messages of varying lengths while maintaining readability and accessibility.',
  },
  render: (args) => ({
    props: args,
    template: `<eb-toast ${argsToTemplate(args)}></eb-toast>`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Toast with a longer message demonstrating text wrapping.',
      },
    },
  },
};

// Not Dismissible
export const NotDismissible: Story = {
  args: {
    variant: 'warning',
    message: 'This notification cannot be dismissed manually.',
    title: 'System Alert',
    dismissible: false,
  },
  render: (args) => ({
    props: args,
    template: `<eb-toast ${argsToTemplate(args)}></eb-toast>`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Toast without a dismiss button. Useful for critical system messages.',
      },
    },
  },
};

// Interactive Example
export const Interactive: Story = {
  args: {
    variant: 'success',
    message: 'This is an interactive toast notification',
    title: 'Interactive Toast',
    duration: 5000,
    dismissible: true,
    position: 'top-right',
    isExiting: false,
  },
  render: (args) => ({
    props: args,
    template: `<eb-toast ${argsToTemplate(args)}></eb-toast>`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Interactive toast - use the controls below to customize all properties.',
      },
    },
  },
};

// Service Integration Demo
@Component({
  selector: 'eb-toast-demo',
  imports: [ToastContainerComponent],
  template: `
    <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 600px;">
      <h3 style="margin: 0; font-size: 18px;">Toast Service Demo</h3>
      <p style="font-size: 14px; color: var(--color-text-secondary); margin: 0;">
        Click the buttons below to trigger toast notifications using the ToastService. Toasts will
        appear in the top-right corner and auto-dismiss after 5 seconds.
      </p>

      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <button
          (click)="showSuccess()"
          style="padding: 8px 16px; background: var(--color-success); color: white; border: none; border-radius: 6px; cursor: pointer;"
        >
          Show Success
        </button>
        <button
          (click)="showError()"
          style="padding: 8px 16px; background: var(--color-error); color: white; border: none; border-radius: 6px; cursor: pointer;"
        >
          Show Error
        </button>
        <button
          (click)="showWarning()"
          style="padding: 8px 16px; background: var(--color-warning); color: white; border: none; border-radius: 6px; cursor: pointer;"
        >
          Show Warning
        </button>
        <button
          (click)="showInfo()"
          style="padding: 8px 16px; background: var(--color-info); color: white; border: none; border-radius: 6px; cursor: pointer;"
        >
          Show Info
        </button>
      </div>

      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <button
          (click)="showMultiple()"
          style="padding: 8px 16px; background: var(--color-primary); color: white; border: none; border-radius: 6px; cursor: pointer;"
        >
          Show Multiple
        </button>
        <button
          (click)="showAtPosition('bottom-center')"
          style="padding: 8px 16px; background: var(--color-primary); color: white; border: none; border-radius: 6px; cursor: pointer;"
        >
          Show Bottom Center
        </button>
        <button
          (click)="showPersistent()"
          style="padding: 8px 16px; background: var(--color-primary); color: white; border: none; border-radius: 6px; cursor: pointer;"
        >
          Show Persistent (No Auto-Dismiss)
        </button>
        <button
          (click)="dismissAll()"
          style="padding: 8px 16px; background: var(--color-surface); color: var(--color-text); border: 1px solid var(--color-border); border-radius: 6px; cursor: pointer;"
        >
          Dismiss All
        </button>
      </div>
    </div>

    <eb-toast-container />
  `,
})
class ToastDemoComponent {
  private readonly toastService = inject(ToastService);

  showSuccess(): void {
    this.toastService.success('Changes saved successfully!', {
      title: 'Success',
      duration: 5000,
    });
  }

  showError(): void {
    this.toastService.error('Failed to save changes. Please try again.', {
      title: 'Error',
      duration: 7000,
    });
  }

  showWarning(): void {
    this.toastService.warning('Your session will expire in 5 minutes.', {
      title: 'Warning',
      duration: 6000,
    });
  }

  showInfo(): void {
    this.toastService.info('A new version of the app is available.', {
      title: 'Info',
      duration: 5000,
    });
  }

  showMultiple(): void {
    this.toastService.success('First notification');
    window.setTimeout(() => {
      this.toastService.info('Second notification');
    }, 500);
    window.setTimeout(() => {
      this.toastService.warning('Third notification');
    }, 1000);
  }

  showAtPosition(position: 'bottom-center'): void {
    this.toastService.info('This toast appears at the bottom center!', {
      position,
      duration: 5000,
    });
  }

  showPersistent(): void {
    this.toastService.warning('This toast will not auto-dismiss. Close it manually.', {
      title: 'Persistent Toast',
      duration: 0,
    });
  }

  dismissAll(): void {
    this.toastService.dismissAll();
  }
}

export const ServiceIntegration: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [ToastDemoComponent],
    },
    template: '<eb-toast-demo />',
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates how to use the ToastService to trigger toast notifications. The service provides convenience methods: success(), error(), warning(), info(), and show() for custom toasts.',
      },
    },
  },
};

// Accessibility Features
export const AccessibilityFeatures: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 600px;">
        <h3 style="margin: 0; font-size: 18px;">Accessibility Features</h3>

        <div>
          <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">ARIA Live Regions</h4>
          <p style="font-size: 14px; color: var(--color-text-secondary); margin: 0 0 8px 0;">
            Error and warning toasts use <code>aria-live="assertive"</code> to interrupt screen readers.
            Success and info toasts use <code>aria-live="polite"</code> for non-disruptive announcements.
          </p>
          <eb-toast variant="error" message="Assertive announcement (interrupts)" title="Error"></eb-toast>
        </div>

        <div>
          <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">Keyboard Navigation</h4>
          <p style="font-size: 14px; color: var(--color-text-secondary); margin: 0 0 8px 0;">
            Dismiss button is keyboard accessible. Press Tab to focus, Enter to dismiss.
          </p>
          <eb-toast variant="info" message="Try pressing Tab to focus the dismiss button" title="Keyboard Test"></eb-toast>
        </div>

        <div>
          <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">Color Contrast (WCAG AAA)</h4>
          <p style="font-size: 14px; color: var(--color-text-secondary); margin: 0 0 8px 0;">
            All color combinations meet WCAG 2.1 AAA contrast requirements (7:1 minimum).
          </p>
          <eb-toast variant="success" message="High contrast ensures readability for all users" title="Contrast"></eb-toast>
        </div>

        <div>
          <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">Reduced Motion Support</h4>
          <p style="font-size: 14px; color: var(--color-text-secondary); margin: 0;">
            Respects <code>prefers-reduced-motion</code>. Animations are simplified or removed for users who prefer less motion.
          </p>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Overview of accessibility features including ARIA live regions, keyboard navigation, color contrast, and reduced motion support.',
      },
    },
  },
};
