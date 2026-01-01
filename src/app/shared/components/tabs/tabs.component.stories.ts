import { provideIcons } from '@ng-icons/core';
import {
  heroBeaker,
  heroBell,
  heroChartBar,
  heroCheckCircle,
  heroCog6Tooth,
  heroEye,
  heroHome,
  heroInformationCircle,
  heroListBullet,
  heroUser,
  heroUserGroup,
} from '@ng-icons/heroicons/outline';
import { ICON_NAMES } from '@shared/constants';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';

import { TabComponent } from './tab.component';
import { TabsComponent } from './tabs.component';

const meta: Meta<TabsComponent> = {
  title: 'Shared/Tabs',
  component: TabsComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [
        provideIcons({
          heroBeaker,
          heroBell,
          heroChartBar,
          heroCheckCircle,
          heroCog6Tooth,
          heroEye,
          heroHome,
          heroInformationCircle,
          heroListBullet,
          heroUser,
          heroUserGroup,
        }),
      ],
    }),
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'pills', 'underline', 'boxed'],
      description: 'Visual variant of the tabs',
      table: {
        type: { summary: 'TabsVariant' },
        defaultValue: { summary: 'default' },
      },
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Orientation of the tabs',
      table: {
        type: { summary: 'TabsOrientation' },
        defaultValue: { summary: 'horizontal' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the tabs',
      table: {
        type: { summary: 'TabsSize' },
        defaultValue: { summary: 'md' },
      },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether tabs fill the full width',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    ariaLabel: {
      control: 'text',
      description: 'ARIA label for accessibility (REQUIRED)',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Accessible tabs component with keyboard navigation. Follows WAI-ARIA tabs pattern and WCAG 2.1 AAA guidelines. Supports arrow key navigation, Home/End keys, and proper focus management.',
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
type Story = StoryObj<TabsComponent>;

// Basic Tabs
export const Basic: Story = {
  render: () => ({
    props: {},
    template: `
      <eb-tabs ariaLabel="Basic tabs example">
        <eb-tab tabId="overview" label="Overview">
          <h3>Overview</h3>
          <p>This is the overview tab content. It contains general information about the topic.</p>
        </eb-tab>
        <eb-tab tabId="details" label="Details">
          <h3>Details</h3>
          <p>This tab contains detailed information with more specifics.</p>
        </eb-tab>
        <eb-tab tabId="settings" label="Settings">
          <h3>Settings</h3>
          <p>Configure your preferences in this tab.</p>
        </eb-tab>
      </eb-tabs>
    `,
    moduleMetadata: {
      imports: [TabsComponent, TabComponent],
    },
  }),
};

// All Variants
export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 3rem;">
        <div>
          <h4 style="margin: 0 0 1rem 0;">Default</h4>
          <eb-tabs variant="default" ariaLabel="Default variant tabs">
            <eb-tab tabId="default-1" label="Tab 1"><p>Content for tab 1</p></eb-tab>
            <eb-tab tabId="default-2" label="Tab 2"><p>Content for tab 2</p></eb-tab>
            <eb-tab tabId="default-3" label="Tab 3"><p>Content for tab 3</p></eb-tab>
          </eb-tabs>
        </div>

        <div>
          <h4 style="margin: 0 0 1rem 0;">Pills</h4>
          <eb-tabs variant="pills" ariaLabel="Pills variant tabs">
            <eb-tab tabId="pills-1" label="Tab 1"><p>Content for tab 1</p></eb-tab>
            <eb-tab tabId="pills-2" label="Tab 2"><p>Content for tab 2</p></eb-tab>
            <eb-tab tabId="pills-3" label="Tab 3"><p>Content for tab 3</p></eb-tab>
          </eb-tabs>
        </div>

        <div>
          <h4 style="margin: 0 0 1rem 0;">Underline</h4>
          <eb-tabs variant="underline" ariaLabel="Underline variant tabs">
            <eb-tab tabId="underline-1" label="Tab 1"><p>Content for tab 1</p></eb-tab>
            <eb-tab tabId="underline-2" label="Tab 2"><p>Content for tab 2</p></eb-tab>
            <eb-tab tabId="underline-3" label="Tab 3"><p>Content for tab 3</p></eb-tab>
          </eb-tabs>
        </div>

        <div>
          <h4 style="margin: 0 0 1rem 0;">Boxed</h4>
          <eb-tabs variant="boxed" ariaLabel="Boxed variant tabs">
            <eb-tab tabId="boxed-1" label="Tab 1"><p>Content for tab 1</p></eb-tab>
            <eb-tab tabId="boxed-2" label="Tab 2"><p>Content for tab 2</p></eb-tab>
            <eb-tab tabId="boxed-3" label="Tab 3"><p>Content for tab 3</p></eb-tab>
          </eb-tabs>
        </div>
      </div>
    `,
    moduleMetadata: {
      imports: [TabsComponent, TabComponent],
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'All available tab variants: default, pills, underline, and boxed.',
      },
    },
  },
};

// All Sizes
export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 3rem;">
        <div>
          <h4 style="margin: 0 0 1rem 0;">Small</h4>
          <eb-tabs size="sm" ariaLabel="Small tabs">
            <eb-tab tabId="sm-1" label="Tab 1"><p>Small tab content</p></eb-tab>
            <eb-tab tabId="sm-2" label="Tab 2"><p>Small tab content</p></eb-tab>
            <eb-tab tabId="sm-3" label="Tab 3"><p>Small tab content</p></eb-tab>
          </eb-tabs>
        </div>

        <div>
          <h4 style="margin: 0 0 1rem 0;">Medium (Default)</h4>
          <eb-tabs size="md" ariaLabel="Medium tabs">
            <eb-tab tabId="md-1" label="Tab 1"><p>Medium tab content</p></eb-tab>
            <eb-tab tabId="md-2" label="Tab 2"><p>Medium tab content</p></eb-tab>
            <eb-tab tabId="md-3" label="Tab 3"><p>Medium tab content</p></eb-tab>
          </eb-tabs>
        </div>

        <div>
          <h4 style="margin: 0 0 1rem 0;">Large</h4>
          <eb-tabs size="lg" ariaLabel="Large tabs">
            <eb-tab tabId="lg-1" label="Tab 1"><p>Large tab content</p></eb-tab>
            <eb-tab tabId="lg-2" label="Tab 2"><p>Large tab content</p></eb-tab>
            <eb-tab tabId="lg-3" label="Tab 3"><p>Large tab content</p></eb-tab>
          </eb-tabs>
        </div>
      </div>
    `,
    moduleMetadata: {
      imports: [TabsComponent, TabComponent],
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'All available tab sizes: small, medium (default), and large.',
      },
    },
  },
};

// With Icons
export const WithIcons: Story = {
  render: () => ({
    template: `
      <eb-tabs variant="pills" ariaLabel="Tabs with icons">
        <eb-tab tabId="home" label="Home" [icon]="'${ICON_NAMES.HOME}'">
          <h3>Home</h3>
          <p>Welcome to the home tab!</p>
        </eb-tab>
        <eb-tab tabId="profile" label="Profile" [icon]="'${ICON_NAMES.USER}'">
          <h3>Profile</h3>
          <p>View and edit your profile information.</p>
        </eb-tab>
        <eb-tab tabId="settings" label="Settings" [icon]="'${ICON_NAMES.SETTINGS}'">
          <h3>Settings</h3>
          <p>Manage your account settings.</p>
        </eb-tab>
        <eb-tab tabId="notifications" label="Notifications" [icon]="'${ICON_NAMES.NOTIFICATION}'">
          <h3>Notifications</h3>
          <p>View your recent notifications.</p>
        </eb-tab>
      </eb-tabs>
    `,
    moduleMetadata: {
      imports: [TabsComponent, TabComponent],
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Tabs with icons for better visual identification.',
      },
    },
  },
};

// Vertical Tabs
export const VerticalTabs: Story = {
  render: () => ({
    template: `
      <div style="height: 400px;">
        <eb-tabs orientation="vertical" ariaLabel="Vertical tabs">
          <eb-tab tabId="account" label="Account" [icon]="'${ICON_NAMES.USER}'">
            <h3>Account Settings</h3>
            <p>Manage your account details and preferences.</p>
          </eb-tab>
          <eb-tab tabId="security" label="Security" [icon]="'${ICON_NAMES.SUCCESS}'">
            <h3>Security</h3>
            <p>Update your password and security settings.</p>
          </eb-tab>
          <eb-tab tabId="privacy" label="Privacy" [icon]="'${ICON_NAMES.EYE}'">
            <h3>Privacy</h3>
            <p>Control your privacy settings and data sharing.</p>
          </eb-tab>
          <eb-tab tabId="notifications-v" label="Notifications" [icon]="'${ICON_NAMES.NOTIFICATION}'">
            <h3>Notifications</h3>
            <p>Customize your notification preferences.</p>
          </eb-tab>
        </eb-tabs>
      </div>
    `,
    moduleMetadata: {
      imports: [TabsComponent, TabComponent],
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Tabs arranged vertically, useful for settings pages or navigation.',
      },
    },
  },
};

// Full Width Tabs
export const FullWidth: Story = {
  render: () => ({
    template: `
      <eb-tabs [fullWidth]="true" variant="pills" ariaLabel="Full width tabs">
        <eb-tab tabId="one" label="One">
          <p>First tab with equal width distribution.</p>
        </eb-tab>
        <eb-tab tabId="two" label="Two">
          <p>Second tab with equal width distribution.</p>
        </eb-tab>
        <eb-tab tabId="three" label="Three">
          <p>Third tab with equal width distribution.</p>
        </eb-tab>
      </eb-tabs>
    `,
    moduleMetadata: {
      imports: [TabsComponent, TabComponent],
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Tabs that fill the full width of their container with equal distribution.',
      },
    },
  },
};

// With Disabled Tab
export const WithDisabledTab: Story = {
  render: () => ({
    template: `
      <eb-tabs ariaLabel="Tabs with disabled state">
        <eb-tab tabId="available" label="Available">
          <p>This tab is available and can be selected.</p>
        </eb-tab>
        <eb-tab tabId="disabled" label="Disabled" [disabled]="true">
          <p>This content won't be accessible because the tab is disabled.</p>
        </eb-tab>
        <eb-tab tabId="also-available" label="Also Available">
          <p>This tab is also available for selection.</p>
        </eb-tab>
      </eb-tabs>
    `,
    moduleMetadata: {
      imports: [TabsComponent, TabComponent],
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Tabs can be disabled to prevent user interaction.',
      },
    },
  },
};

// Complex Content
export const ComplexContent: Story = {
  render: () => ({
    template: `
      <eb-tabs variant="underline" size="lg" ariaLabel="Project dashboard tabs">
        <eb-tab tabId="dashboard" label="Dashboard" [icon]="'${ICON_NAMES.CHART}'">
          <h3>Project Dashboard</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem;">
            <div style="padding: 1rem; border: 1px solid #ddd; border-radius: 4px;">
              <h4 style="margin: 0 0 0.5rem 0;">Active Tasks</h4>
              <p style="font-size: 2rem; margin: 0; color: var(--color-primary);">24</p>
            </div>
            <div style="padding: 1rem; border: 1px solid #ddd; border-radius: 4px;">
              <h4 style="margin: 0 0 0.5rem 0;">Completed</h4>
              <p style="font-size: 2rem; margin: 0; color: var(--color-success);">156</p>
            </div>
            <div style="padding: 1rem; border: 1px solid #ddd; border-radius: 4px;">
              <h4 style="margin: 0 0 0.5rem 0;">Team Members</h4>
              <p style="font-size: 2rem; margin: 0; color: var(--color-info);">12</p>
            </div>
          </div>
        </eb-tab>
        <eb-tab tabId="tasks" label="Tasks" [icon]="'${ICON_NAMES.LIST}'">
          <h3>Task List</h3>
          <ul style="list-style: none; padding: 0;">
            <li style="padding: 0.75rem; border-bottom: 1px solid #eee;">Design homepage layout</li>
            <li style="padding: 0.75rem; border-bottom: 1px solid #eee;">Implement authentication</li>
            <li style="padding: 0.75rem; border-bottom: 1px solid #eee;">Write unit tests</li>
            <li style="padding: 0.75rem; border-bottom: 1px solid #eee;">Deploy to staging</li>
          </ul>
        </eb-tab>
        <eb-tab tabId="team" label="Team" [icon]="'${ICON_NAMES.USER_GROUP}'">
          <h3>Team Members</h3>
          <div style="display: grid; gap: 1rem; margin-top: 1rem;">
            <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; border: 1px solid #eee; border-radius: 4px;">
              <div style="width: 40px; height: 40px; border-radius: var(--border-radius-half); background: var(--color-primary); display: flex; align-items: center; justify-content: center; color: white;">JD</div>
              <div>
                <strong>John Doe</strong>
                <p style="margin: 0; font-size: 0.875rem; color: #666;">Lead Developer</p>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; border: 1px solid #eee; border-radius: 4px;">
              <div style="width: 40px; height: 40px; border-radius: var(--border-radius-half); background: var(--color-success); display: flex; align-items: center; justify-content: center; color: white;">JS</div>
              <div>
                <strong>Jane Smith</strong>
                <p style="margin: 0; font-size: 0.875rem; color: #666;">UI/UX Designer</p>
              </div>
            </div>
          </div>
        </eb-tab>
      </eb-tabs>
    `,
    moduleMetadata: {
      imports: [TabsComponent, TabComponent],
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Tabs with complex content including cards, lists, and layouts.',
      },
    },
  },
};

// Keyboard Navigation Demo
export const KeyboardNavigation: Story = {
  render: () => ({
    template: `
      <div style="max-width: 600px;">
        <h4 style="margin: 0 0 16px 0;">Keyboard Navigation</h4>
        <ul style="font-size: 14px; line-height: 1.8; color: var(--color-text-secondary); margin-bottom: 1.5rem;">
          <li><strong>Tab:</strong> Move focus into/out of tab list</li>
          <li><strong>Arrow Left/Right:</strong> Navigate between tabs (horizontal)</li>
          <li><strong>Arrow Up/Down:</strong> Navigate between tabs (vertical)</li>
          <li><strong>Home:</strong> Jump to first tab</li>
          <li><strong>End:</strong> Jump to last tab</li>
          <li><strong>Enter/Space:</strong> Activate focused tab</li>
        </ul>

        <eb-tabs ariaLabel="Keyboard navigation demo">
          <eb-tab tabId="first" label="First Tab">
            <p>Try using arrow keys to navigate between tabs!</p>
          </eb-tab>
          <eb-tab tabId="second" label="Second Tab">
            <p>Press Home to jump to the first tab, or End to jump to the last.</p>
          </eb-tab>
          <eb-tab tabId="third" label="Third Tab">
            <p>Keyboard navigation makes tabs accessible to all users.</p>
          </eb-tab>
        </eb-tabs>
      </div>
    `,
    moduleMetadata: {
      imports: [TabsComponent, TabComponent],
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates full keyboard navigation support following WAI-ARIA patterns.',
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
        <ul style="font-size: 14px; line-height: 1.8; color: var(--color-text-secondary); margin-bottom: 1.5rem;">
          <li><strong>WAI-ARIA Pattern:</strong> Uses proper tab/tabpanel roles and associations</li>
          <li><strong>Keyboard Navigation:</strong> Full keyboard support with arrow keys</li>
          <li><strong>Focus Management:</strong> Proper focus indicators and tabindex management</li>
          <li><strong>Screen Reader Support:</strong> ARIA labels and live regions</li>
          <li><strong>Color Contrast:</strong> All variants meet WCAG AAA standards</li>
        </ul>

        <eb-tabs variant="pills" ariaLabel="Accessibility demo tabs">
          <eb-tab tabId="a11y-1" label="Overview" [icon]="'${ICON_NAMES.INFO}'">
            <h3>Accessibility Overview</h3>
            <p>This tabs component follows WAI-ARIA authoring practices for tabs.</p>
          </eb-tab>
          <eb-tab tabId="a11y-2" label="Features" [icon]="'${ICON_NAMES.SUCCESS}'">
            <h3>Accessibility Features</h3>
            <p>Full keyboard navigation, screen reader support, and WCAG AAA compliance.</p>
          </eb-tab>
          <eb-tab tabId="a11y-3" label="Testing" [icon]="'${ICON_NAMES.BEAKER}'">
            <h3>Testing</h3>
            <p>Tested with NVDA, JAWS, and VoiceOver screen readers.</p>
          </eb-tab>
        </eb-tabs>
      </div>
    `,
    moduleMetadata: {
      imports: [TabsComponent, TabComponent],
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates comprehensive accessibility features and WCAG 2.1 AAA compliance.',
      },
    },
  },
};
