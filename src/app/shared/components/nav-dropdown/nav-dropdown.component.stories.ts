import { provideRouter } from '@angular/router';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';

import type { NavItem } from '@core/layout/navigation.data';
import { NavDropdownComponent } from './nav-dropdown.component';

const mockItems: NavItem[] = [
  { labelKey: 'Modules', route: '/modules' },
  { labelKey: 'Architecture', route: '/architecture' },
  { labelKey: 'Component Library', route: '/storybook', external: true },
  { labelKey: 'Documentation', route: '/docs', external: true },
];

const meta: Meta<NavDropdownComponent> = {
  title: 'Shared/NavDropdown',
  component: NavDropdownComponent,
  decorators: [
    applicationConfig({
      providers: [provideRouter([])],
    }),
    moduleMetadata({
      imports: [NavDropdownComponent],
    }),
  ],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
The NavDropdown component provides a navigation dropdown menu for the application header.
It supports both internal routes (using Angular Router) and external links (opening in new tabs).

## Features
- CDK Overlay for proper positioning
- Keyboard navigation (Escape to close)
- Focus trapping for accessibility
- Support for internal routes and external links
- Animated chevron indicator
        `,
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Label displayed on the dropdown trigger button',
    },
    items: {
      control: 'object',
      description: 'Array of navigation items to display in the dropdown',
    },
  },
};

export default meta;
type Story = StoryObj<NavDropdownComponent>;

/**
 * Default dropdown with a mix of internal routes and external links.
 */
export const Default: Story = {
  args: {
    label: 'Resources',
    items: mockItems,
  },
};

/**
 * Dropdown with only internal routes.
 */
export const InternalOnly: Story = {
  args: {
    label: 'Navigation',
    items: [
      { labelKey: 'Dashboard', route: '/' },
      { labelKey: 'Profile', route: '/profile' },
      { labelKey: 'Settings', route: '/settings' },
    ],
  },
};

/**
 * Dropdown with only external links.
 */
export const ExternalOnly: Story = {
  args: {
    label: 'External Links',
    items: [
      { labelKey: 'GitHub', route: 'https://github.com', external: true },
      { labelKey: 'Documentation', route: 'https://angular.dev', external: true },
      { labelKey: 'Stack Overflow', route: 'https://stackoverflow.com', external: true },
    ],
  },
};

/**
 * Dropdown with a single item.
 */
export const SingleItem: Story = {
  args: {
    label: 'Help',
    items: [{ labelKey: 'Support', route: '/support' }],
  },
};

/**
 * Dropdown with many items.
 */
export const ManyItems: Story = {
  args: {
    label: 'All Features',
    items: [
      { labelKey: 'Dashboard', route: '/' },
      { labelKey: 'Modules', route: '/modules' },
      { labelKey: 'Architecture', route: '/architecture' },
      { labelKey: 'Blog', route: '/blog' },
      { labelKey: 'Profile', route: '/profile' },
      { labelKey: 'Settings', route: '/settings' },
      { labelKey: 'Help', route: '/help' },
      { labelKey: 'GitHub', route: 'https://github.com', external: true },
    ],
  },
};
