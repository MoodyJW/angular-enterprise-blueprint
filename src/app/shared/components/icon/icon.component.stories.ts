import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, argsToTemplate } from '@storybook/angular';

import { ICON_NAMES } from '@shared/constants';
import { IconComponent } from './icon.component';

const meta: Meta<IconComponent> = {
  title: 'Shared/Icon',
  component: IconComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [],
    }),
  ],
  argTypes: {
    name: {
      control: 'select',
      options: Object.values(ICON_NAMES),
      description: 'Icon name from the icon registry',
      table: {
        type: { summary: 'IconName' },
      },
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Size of the icon',
      table: {
        type: { summary: 'IconSize' },
        defaultValue: { summary: 'md' },
      },
    },
    color: {
      control: 'select',
      options: ['current', 'primary', 'secondary', 'success', 'warning', 'error', 'info'],
      description: 'Color of the icon',
      table: {
        type: { summary: 'IconColor' },
        defaultValue: { summary: 'current' },
      },
    },
    decorative: {
      control: 'boolean',
      description: 'Whether the icon is purely decorative (hides from screen readers)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    ariaLabel: {
      control: 'text',
      description: 'ARIA label for accessibility (REQUIRED if not decorative)',
    },
    spin: {
      control: 'boolean',
      description: 'Whether the icon should spin continuously',
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
          'Accessible icon component using ng-icons (Heroicons). Provides size variants, color options, and full accessibility support following WCAG 2.1 AAA guidelines.',
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
type Story = StoryObj<IconComponent>;

// Basic Icon
export const Basic: Story = {
  args: {
    name: ICON_NAMES.HOME,
    ariaLabel: 'Home',
    color: 'primary',
  },
};

// All Sizes
export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 2rem; align-items: center; flex-wrap: wrap;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <eb-icon name="${ICON_NAMES.HOME}" size="xs" ariaLabel="Extra small home icon" color="primary" />
          <span style="font-size: 12px; color: #666;">xs (12px)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <eb-icon name="${ICON_NAMES.HOME}" size="sm" ariaLabel="Small home icon" color="primary" />
          <span style="font-size: 12px; color: #666;">sm (16px)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <eb-icon name="${ICON_NAMES.HOME}" size="md" ariaLabel="Medium home icon" color="primary" />
          <span style="font-size: 12px; color: #666;">md (20px)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <eb-icon name="${ICON_NAMES.HOME}" size="lg" ariaLabel="Large home icon" color="primary" />
          <span style="font-size: 12px; color: #666;">lg (24px)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <eb-icon name="${ICON_NAMES.HOME}" size="xl" ariaLabel="Extra large home icon" color="primary" />
          <span style="font-size: 12px; color: #666;">xl (32px)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <eb-icon name="${ICON_NAMES.HOME}" size="2xl" ariaLabel="2x large home icon" color="primary" />
          <span style="font-size: 12px; color: #666;">2xl (40px)</span>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'All available icon sizes from xs (12px) to 2xl (40px).',
      },
    },
  },
};

// All Colors
export const AllColors: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 2rem; align-items: center; flex-wrap: wrap;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <eb-icon name="${ICON_NAMES.HEART}" size="xl" color="current" ariaLabel="Current color" />
          <span style="font-size: 12px; color: #666;">current</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <eb-icon name="${ICON_NAMES.HEART}" size="xl" color="primary" ariaLabel="Primary color" />
          <span style="font-size: 12px; color: #666;">primary</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <eb-icon name="${ICON_NAMES.HEART}" size="xl" color="secondary" ariaLabel="Secondary color" />
          <span style="font-size: 12px; color: #666;">secondary</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <eb-icon name="${ICON_NAMES.HEART}" size="xl" color="success" ariaLabel="Success color" />
          <span style="font-size: 12px; color: #666;">success</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <eb-icon name="${ICON_NAMES.HEART}" size="xl" color="warning" ariaLabel="Warning color" />
          <span style="font-size: 12px; color: #666;">warning</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <eb-icon name="${ICON_NAMES.HEART}" size="xl" color="error" ariaLabel="Error color" />
          <span style="font-size: 12px; color: #666;">error</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <eb-icon name="${ICON_NAMES.HEART}" size="xl" color="info" ariaLabel="Info color" />
          <span style="font-size: 12px; color: #666;">info</span>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'All available color variants integrated with the theme system.',
      },
    },
  },
};

// Common Icons
export const CommonIcons: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 1.5rem;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <eb-icon name="${ICON_NAMES.HOME}" size="lg" ariaLabel="Home" color="primary" />
          <span style="font-size: 12px; color: #666; text-align: center;">Home</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <eb-icon name="${ICON_NAMES.USER}" size="lg" ariaLabel="User" color="primary" />
          <span style="font-size: 12px; color: #666; text-align: center;">User</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <eb-icon name="${ICON_NAMES.EMAIL}" size="lg" ariaLabel="Email" color="primary" />
          <span style="font-size: 12px; color: #666; text-align: center;">Email</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <eb-icon name="${ICON_NAMES.SEARCH}" size="lg" ariaLabel="Search" color="primary" />
          <span style="font-size: 12px; color: #666; text-align: center;">Search</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <eb-icon name="${ICON_NAMES.SETTINGS}" size="lg" ariaLabel="Settings" color="primary" />
          <span style="font-size: 12px; color: #666; text-align: center;">Settings</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <eb-icon name="${ICON_NAMES.NOTIFICATION}" size="lg" ariaLabel="Notifications" color="primary" />
          <span style="font-size: 12px; color: #666; text-align: center;">Notification</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <eb-icon name="${ICON_NAMES.HEART}" size="lg" ariaLabel="Heart" color="primary" />
          <span style="font-size: 12px; color: #666; text-align: center;">Heart</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <eb-icon name="${ICON_NAMES.STAR}" size="lg" ariaLabel="Star" color="primary" />
          <span style="font-size: 12px; color: #666; text-align: center;">Star</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <eb-icon name="${ICON_NAMES.CART}" size="lg" ariaLabel="Shopping cart" color="primary" />
          <span style="font-size: 12px; color: #666; text-align: center;">Cart</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <eb-icon name="${ICON_NAMES.MENU}" size="lg" ariaLabel="Menu" color="primary" />
          <span style="font-size: 12px; color: #666; text-align: center;">Menu</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <eb-icon name="${ICON_NAMES.CLOSE}" size="lg" ariaLabel="Close" color="primary" />
          <span style="font-size: 12px; color: #666; text-align: center;">Close</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <eb-icon name="${ICON_NAMES.CHECK}" size="lg" ariaLabel="Check" color="primary" />
          <span style="font-size: 12px; color: #666; text-align: center;">Check</span>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Commonly used icons in the application.',
      },
    },
  },
};

// Status Icons
export const StatusIcons: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 3rem; align-items: center; flex-wrap: wrap;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <eb-icon name="${ICON_NAMES.SUCCESS}" size="2xl" color="success" ariaLabel="Success" />
          <span style="font-size: 12px; color: #666;">Success</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <eb-icon name="${ICON_NAMES.WARNING}" size="2xl" color="warning" ariaLabel="Warning" />
          <span style="font-size: 12px; color: #666;">Warning</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <eb-icon name="${ICON_NAMES.ERROR}" size="2xl" color="error" ariaLabel="Error" />
          <span style="font-size: 12px; color: #666;">Error</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <eb-icon name="${ICON_NAMES.INFO}" size="2xl" color="info" ariaLabel="Information" />
          <span style="font-size: 12px; color: #666;">Info</span>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Status icons with appropriate colors for feedback.',
      },
    },
  },
};

// Spinning Icon
export const SpinningIcon: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 2rem; align-items: center;">
        <eb-icon name="${ICON_NAMES.REFRESH}" size="xl" [spin]="true" ariaLabel="Loading" color="primary" />
        <span style="font-size: 14px;">Loading...</span>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Icon with spinning animation for loading states.',
      },
    },
  },
};

// Icons in Buttons
export const InButtons: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <button style="display: flex; align-items: center; gap: 0.5rem; padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; background: white; cursor: pointer;">
          <eb-icon name="${ICON_NAMES.HOME}" size="sm" [decorative]="true" color="primary" />
          Home
        </button>
        <button style="display: flex; align-items: center; gap: 0.5rem; padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; background: white; cursor: pointer;">
          <eb-icon name="${ICON_NAMES.SEARCH}" size="sm" [decorative]="true" color="primary" />
          Search
        </button>
        <button style="display: flex; align-items: center; gap: 0.5rem; padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; background: white; cursor: pointer;">
          <eb-icon name="${ICON_NAMES.SETTINGS}" size="sm" [decorative]="true" color="primary" />
          Settings
        </button>
        <button style="display: flex; align-items: center; gap: 0.5rem; padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; background: white; cursor: pointer;">
          Download
          <eb-icon name="${ICON_NAMES.DOWNLOAD}" size="sm" [decorative]="true" color="primary" />
        </button>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Icons used inside buttons. Note: decorative=true since button text provides context.',
      },
    },
  },
};

// Theme Icons
export const ThemeIcons: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 2rem; align-items: center;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <eb-icon name="${ICON_NAMES.SUN}" size="xl" color="warning" ariaLabel="Light mode" />
          <span style="font-size: 12px; color: #666;">Light Mode</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <eb-icon name="${ICON_NAMES.MOON}" size="xl" color="primary" ariaLabel="Dark mode" />
          <span style="font-size: 12px; color: #666;">Dark Mode</span>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Theme toggle icons.',
      },
    },
  },
};

// Navigation Icons
export const NavigationIcons: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 2rem; align-items: center; flex-wrap: wrap;">
        <eb-icon name="${ICON_NAMES.ARROW_LEFT}" size="lg" ariaLabel="Go back" color="primary" />
        <eb-icon name="${ICON_NAMES.ARROW_RIGHT}" size="lg" ariaLabel="Go forward" color="primary" />
        <eb-icon name="${ICON_NAMES.ARROW_UP}" size="lg" ariaLabel="Go up" color="primary" />
        <eb-icon name="${ICON_NAMES.ARROW_DOWN}" size="lg" ariaLabel="Go down" color="primary" />
        <eb-icon name="${ICON_NAMES.CHEVRON_LEFT}" size="lg" ariaLabel="Previous" color="primary" />
        <eb-icon name="${ICON_NAMES.CHEVRON_RIGHT}" size="lg" ariaLabel="Next" color="primary" />
        <eb-icon name="${ICON_NAMES.CHEVRON_UP}" size="lg" ariaLabel="Collapse" color="primary" />
        <eb-icon name="${ICON_NAMES.CHEVRON_DOWN}" size="lg" ariaLabel="Expand" color="primary" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Navigation and directional icons.',
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
          <li><strong>ARIA Labels:</strong> Non-decorative icons require aria-label</li>
          <li><strong>Decorative Icons:</strong> Set decorative=true for icons that are purely visual</li>
          <li><strong>Role="img":</strong> Icons use img role for semantic meaning</li>
          <li><strong>Color Contrast:</strong> All color variants meet WCAG AAA standards</li>
          <li><strong>Reduced Motion:</strong> Spinning animations respect prefers-reduced-motion</li>
        </ul>

        <div style="margin-top: 20px; display: flex; gap: 1rem; flex-direction: column;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <eb-icon name="${ICON_NAMES.SUCCESS}" color="success" ariaLabel="Task completed successfully" />
            <span>With aria-label (announced by screen readers)</span>
          </div>

          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <eb-icon name="${ICON_NAMES.STAR}" [decorative]="true" color="secondary" />
            <span>Decorative icon (hidden from screen readers)</span>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates accessibility features including ARIA labels and decorative icons.',
      },
    },
  },
};

// Interactive Example
export const Interactive: Story = {
  args: {
    name: ICON_NAMES.HOME,
    size: 'xl',
    color: 'primary',
    decorative: false,
    ariaLabel: 'Home icon',
    spin: false,
  },
  render: (args) => ({
    props: args,
    template: `<eb-icon ${argsToTemplate(args)} />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Interactive icon - use the controls below to customize all properties.',
      },
    },
  },
};
