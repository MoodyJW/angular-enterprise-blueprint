import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, argsToTemplate } from '@storybook/angular';

import { BadgeComponent } from './badge.component';

const meta: Meta<BadgeComponent> = {
  title: 'Shared/Badge',
  component: BadgeComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [],
    }),
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'info'],
      description: 'Visual variant of the badge',
      table: {
        type: { summary: 'BadgeVariant' },
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the badge',
      table: {
        type: { summary: 'BadgeSize' },
        defaultValue: { summary: 'md' },
      },
    },
    position: {
      control: 'select',
      options: ['top-right', 'top-left', 'bottom-right', 'bottom-left'],
      description: 'Position of the badge relative to its parent',
      table: {
        type: { summary: 'BadgePosition' },
        defaultValue: { summary: 'top-right' },
      },
    },
    content: {
      control: 'text',
      description: 'Content to display in the badge (number or string)',
    },
    max: {
      control: 'number',
      description: 'Maximum number to display before showing "+"',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '99' },
      },
    },
    dot: {
      control: 'boolean',
      description: 'Show badge as a dot (no content)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    hideWhenZero: {
      control: 'boolean',
      description: 'Hide badge when content is 0 or falsy',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    ariaLabel: {
      control: 'text',
      description: 'ARIA label for accessibility (REQUIRED)',
    },
    ariaDescribedBy: {
      control: 'text',
      description: 'ID of element describing the badge',
    },
    ariaLive: {
      control: 'select',
      options: ['off', 'polite', 'assertive'],
      description: 'Whether the badge updates should be announced',
      table: {
        type: { summary: "'off' | 'polite' | 'assertive'" },
        defaultValue: { summary: 'polite' },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Accessible badge component following WCAG 2.1 AAA guidelines. Used to display item counts, notifications, or status indicators overlaying content.',
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
            id: 'aria-required-attr',
            enabled: true,
          },
        ],
      },
    },
  },
};

export default meta;
type Story = StoryObj<BadgeComponent>;

// Primary Badge with Count
export const Primary: Story = {
  render: () => ({
    template: `
      <div style="position: relative; display: inline-block; padding: 20px;">
        <button style="padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; background: white;">
          Messages
        </button>
        <eb-badge [content]="5" ariaLabel="5 unread messages" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Primary badge showing a count overlay on a button.',
      },
    },
  },
};

// All Variants
export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 2rem; flex-wrap: wrap; align-items: center;">
        <div style="position: relative; display: inline-block;">
          <button style="padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; background: white;">Primary</button>
          <eb-badge variant="primary" [content]="5" ariaLabel="5 notifications" />
        </div>
        <div style="position: relative; display: inline-block;">
          <button style="padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; background: white;">Secondary</button>
          <eb-badge variant="secondary" [content]="3" ariaLabel="3 notifications" />
        </div>
        <div style="position: relative; display: inline-block;">
          <button style="padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; background: white;">Success</button>
          <eb-badge variant="success" [content]="8" ariaLabel="8 notifications" />
        </div>
        <div style="position: relative; display: inline-block;">
          <button style="padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; background: white;">Warning</button>
          <eb-badge variant="warning" [content]="2" ariaLabel="2 warnings" />
        </div>
        <div style="position: relative; display: inline-block;">
          <button style="padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; background: white;">Error</button>
          <eb-badge variant="error" [content]="12" ariaLabel="12 errors" />
        </div>
        <div style="position: relative; display: inline-block;">
          <button style="padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; background: white;">Info</button>
          <eb-badge variant="info" [content]="7" ariaLabel="7 info items" />
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'All badge variants displayed together for comparison.',
      },
    },
  },
};

// All Sizes
export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 2rem; flex-wrap: wrap; align-items: center;">
        <div style="position: relative; display: inline-block;">
          <button style="padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; background: white;">Small</button>
          <eb-badge size="sm" [content]="3" ariaLabel="3 items" />
        </div>
        <div style="position: relative; display: inline-block;">
          <button style="padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; background: white;">Medium</button>
          <eb-badge size="md" [content]="5" ariaLabel="5 items" />
        </div>
        <div style="position: relative; display: inline-block;">
          <button style="padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; background: white;">Large</button>
          <eb-badge size="lg" [content]="8" ariaLabel="8 items" />
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'All badge sizes: Small (16px), Medium (20px), Large (24px).',
      },
    },
  },
};

// All Positions
export const AllPositions: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 3rem; flex-wrap: wrap; align-items: center;">
        <div style="position: relative; display: inline-block;">
          <button style="padding: 16px 24px; border: 1px solid #ccc; border-radius: 4px; background: white;">Top Right</button>
          <eb-badge position="top-right" [content]="5" ariaLabel="5 items top right" />
        </div>
        <div style="position: relative; display: inline-block;">
          <button style="padding: 16px 24px; border: 1px solid #ccc; border-radius: 4px; background: white;">Top Left</button>
          <eb-badge position="top-left" [content]="3" ariaLabel="3 items top left" />
        </div>
        <div style="position: relative; display: inline-block;">
          <button style="padding: 16px 24px; border: 1px solid #ccc; border-radius: 4px; background: white;">Bottom Right</button>
          <eb-badge position="bottom-right" [content]="7" ariaLabel="7 items bottom right" />
        </div>
        <div style="position: relative; display: inline-block;">
          <button style="padding: 16px 24px; border: 1px solid #ccc; border-radius: 4px; background: white;">Bottom Left</button>
          <eb-badge position="bottom-left" [content]="9" ariaLabel="9 items bottom left" />
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Badge positioned at different corners of the parent element.',
      },
    },
  },
};

// Dot Badge (No Content)
export const DotBadge: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 2rem; flex-wrap: wrap; align-items: center;">
        <div style="position: relative; display: inline-block;">
          <button style="padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; background: white;">Notifications</button>
          <eb-badge [dot]="true" ariaLabel="Has notifications" />
        </div>
        <div style="position: relative; display: inline-block;">
          <button style="padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; background: white;">Alert</button>
          <eb-badge variant="error" [dot]="true" ariaLabel="Has alert" />
        </div>
        <div style="position: relative; display: inline-block;">
          <button style="padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; background: white;">Success</button>
          <eb-badge variant="success" [dot]="true" size="lg" ariaLabel="Success status" />
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Dot badges (no content) used for simple notification indicators.',
      },
    },
  },
};

// Max Number Display
export const MaxNumber: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 2rem; flex-wrap: wrap; align-items: center;">
        <div style="position: relative; display: inline-block;">
          <button style="padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; background: white;">Messages</button>
          <eb-badge [content]="99" [max]="99" ariaLabel="99 messages" />
        </div>
        <div style="position: relative; display: inline-block;">
          <button style="padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; background: white;">Notifications</button>
          <eb-badge [content]="150" [max]="99" ariaLabel="150 notifications" />
        </div>
        <div style="position: relative; display: inline-block;">
          <button style="padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; background: white;">Items</button>
          <eb-badge [content]="1500" [max]="999" ariaLabel="1500 items" />
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Badges with max number limits show "+" when content exceeds the limit.',
      },
    },
  },
};

// String Content
export const StringContent: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 2rem; flex-wrap: wrap; align-items: center;">
        <div style="position: relative; display: inline-block;">
          <button style="padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; background: white;">Features</button>
          <eb-badge variant="success" content="NEW" ariaLabel="New features available" />
        </div>
        <div style="position: relative; display: inline-block;">
          <button style="padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; background: white;">Beta</button>
          <eb-badge variant="warning" content="β" size="lg" ariaLabel="Beta version" />
        </div>
        <div style="position: relative; display: inline-block;">
          <button style="padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; background: white;">Status</button>
          <eb-badge variant="info" content="!" ariaLabel="Important status update" />
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Badges can display text content instead of numbers.',
      },
    },
  },
};

// On Different Elements
export const OnDifferentElements: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 2rem; flex-wrap: wrap; align-items: flex-start;">
        <div style="position: relative; display: inline-block;">
          <button style="padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; background: white;">
            Button
          </button>
          <eb-badge [content]="5" ariaLabel="5 items" />
        </div>

        <div style="position: relative; display: inline-block;">
          <span style="padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; background: white; display: inline-block;">
            Text Span
          </span>
          <eb-badge variant="error" [content]="3" ariaLabel="3 errors" />
        </div>

        <div style="position: relative; display: inline-block;">
          <div style="width: 40px; height: 40px; border-radius: var(--border-radius-half); background: #ddd; display: flex; align-items: center; justify-content: center;">
            👤
          </div>
          <eb-badge variant="success" [content]="12" ariaLabel="12 profile updates" />
        </div>

        <div style="position: relative; display: inline-block;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <eb-badge variant="error" [dot]="true" ariaLabel="Has new notifications" />
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Badges can be attached to various elements: buttons, text, icons, avatars.',
      },
    },
  },
};

// Hide When Zero
export const HideWhenZero: Story = {
  render: () => ({
    template: `
      <div style="background-color: var(--color-surface); padding: 20px; border-radius: 8px; display: flex; gap: 2rem; flex-wrap: wrap; align-items: center;">
        <div>
          <h4 style="margin: 0 0 8px 0; font-size: 14px;">hideWhenZero=true (default)</h4>
          <div style="position: relative; display: inline-block;">
            <button style="padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; background: white;">Messages</button>
            <eb-badge [content]="0" [hideWhenZero]="true" ariaLabel="No messages" />
          </div>
          <p style="font-size: 12px; color: var(--color-text-muted); margin: 4px 0 0 0;">Badge is hidden</p>
        </div>

        <div>
          <h4 style="margin: 0 0 8px 0; font-size: 14px;">hideWhenZero=false</h4>
          <div style="position: relative; display: inline-block;">
            <button style="padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; background: white;">Messages</button>
            <eb-badge [content]="0" [hideWhenZero]="false" ariaLabel="No messages" />
          </div>
          <p style="font-size: 12px; color: var(--color-text-muted); margin: 4px 0 0 0;">Badge shows "0"</p>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Control whether badges are hidden when the content is zero.',
      },
    },
  },
};

// Real-World Example: Shopping Cart
export const ShoppingCart: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 2rem; flex-wrap: wrap; align-items: center;">
        <div style="position: relative; display: inline-block;">
          <button style="padding: 12px 20px; border: 1px solid #ccc; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; gap: 8px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            Cart
          </button>
          <eb-badge variant="error" [content]="3" ariaLabel="3 items in cart" />
        </div>

        <div style="position: relative; display: inline-block;">
          <button style="padding: 12px 20px; border: 1px solid #ccc; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; gap: 8px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            Notifications
          </button>
          <eb-badge variant="primary" [content]="12" ariaLabel="12 notifications" />
        </div>

        <div style="position: relative; display: inline-block;">
          <button style="padding: 12px 20px; border: 1px solid #ccc; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; gap: 8px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            Messages
          </button>
          <eb-badge variant="success" [content]="99" [max]="99" ariaLabel="99+ messages" />
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Real-world example showing badges on common UI elements like cart, notifications, and messages.',
      },
    },
  },
};

// Accessibility Demo
export const AccessibilityDemo: Story = {
  render: () => ({
    template: `
      <div style="max-width: 600px;">
        <h4 style="margin: 0 0 16px 0;">Accessibility Features</h4>
        <ul style="font-size: 14px; line-height: 1.8; color: var(--color-text-secondary);">
          <li><strong>ARIA Labels:</strong> All badges require aria-label for screen readers</li>
          <li><strong>Role="status":</strong> Badges use status role for semantic meaning</li>
          <li><strong>Live Regions:</strong> Updates can be announced with aria-live (polite/assertive)</li>
          <li><strong>Color Contrast:</strong> All variants meet WCAG AAA standards (7:1+ contrast)</li>
          <li><strong>No Pointer Events:</strong> Badges don't interfere with parent element interactions</li>
        </ul>

        <div style="display: flex; gap: 2rem; margin-top: 20px;">
          <div style="position: relative; display: inline-block;">
            <button style="padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; background: white;">
              Notifications
            </button>
            <eb-badge
              [content]="5"
              ariaLabel="5 unread notifications"
              ariaLive="assertive"
            />
          </div>

          <div style="position: relative; display: inline-block;">
            <button style="padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; background: white;">
              Messages
            </button>
            <eb-badge
              variant="error"
              [content]="3"
              ariaLabel="3 unread messages requiring attention"
              ariaLive="polite"
            />
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates accessibility features including ARIA labels, live regions, and keyboard support.',
      },
    },
  },
};

// Interactive Example
export const Interactive: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    position: 'top-right',
    content: 5,
    max: 99,
    dot: false,
    hideWhenZero: true,
    ariaLabel: '5 notifications',
    ariaLive: 'polite',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="position: relative; display: inline-block; padding: 20px;">
        <button style="padding: 12px 24px; border: 1px solid #ccc; border-radius: 4px; background: white; cursor: pointer;">
          Interactive Badge
        </button>
        <eb-badge ${argsToTemplate(args)} />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Interactive badge - use the controls below to customize all properties.',
      },
    },
  },
};
