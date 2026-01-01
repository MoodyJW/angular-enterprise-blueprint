import { ICON_NAMES } from '@shared/constants';
import type { Meta, StoryObj } from '@storybook/angular';

import { TabButtonComponent } from './tab-button.component';

const meta: Meta<TabButtonComponent> = {
  title: 'Shared/Tabs/TabButton',
  component: TabButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'The label text for the tab button',
    },
    tabId: {
      control: 'text',
      description: 'Unique identifier for the tab',
    },
    isActive: {
      control: 'boolean',
      description: 'Whether the tab is currently active',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the tab is disabled',
    },
    ariaControls: {
      control: 'text',
      description: 'ID of the panel controlled by this tab',
    },
    ariaSelected: {
      control: 'boolean',
      description: 'ARIA selected state',
    },
    tabindex: {
      control: 'number',
      description: 'Tab index for keyboard navigation',
    },
    icon: {
      control: 'select',
      options: [undefined, ...Object.values(ICON_NAMES)],
      description: 'Optional icon to display',
    },
    clicked: {
      action: 'clicked',
      description: 'Event emitted when tab is clicked',
    },
  },
};

export default meta;
type Story = StoryObj<TabButtonComponent>;

export const Default: Story = {
  args: {
    label: 'Tab Label',
    tabId: 'tab-1',
    isActive: false,
    disabled: false,
    ariaControls: 'panel-1',
    ariaSelected: false,
    tabindex: -1,
  },
};

export const Active: Story = {
  args: {
    label: 'Active Tab',
    tabId: 'tab-active',
    isActive: true,
    disabled: false,
    ariaControls: 'panel-active',
    ariaSelected: true,
    tabindex: 0,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Tab',
    tabId: 'tab-disabled',
    isActive: false,
    disabled: true,
    ariaControls: 'panel-disabled',
    ariaSelected: false,
    tabindex: -1,
  },
};

export const WithIcon: Story = {
  args: {
    label: 'Home',
    tabId: 'tab-home',
    icon: ICON_NAMES.HOME,
    isActive: false,
    disabled: false,
    ariaControls: 'panel-home',
    ariaSelected: false,
    tabindex: -1,
  },
};

export const WithIconActive: Story = {
  args: {
    label: 'Settings',
    tabId: 'tab-settings',
    icon: ICON_NAMES.SETTINGS,
    isActive: true,
    disabled: false,
    ariaControls: 'panel-settings',
    ariaSelected: true,
    tabindex: 0,
  },
};

export const WithIconDisabled: Story = {
  args: {
    label: 'Projects',
    tabId: 'tab-projects',
    icon: ICON_NAMES.FOLDER,
    isActive: false,
    disabled: true,
    ariaControls: 'panel-projects',
    ariaSelected: false,
    tabindex: -1,
  },
};

export const LongLabel: Story = {
  args: {
    label: 'This is a very long tab label to test wrapping',
    tabId: 'tab-long',
    isActive: false,
    disabled: false,
    ariaControls: 'panel-long',
    ariaSelected: false,
    tabindex: -1,
  },
};

export const ShortLabel: Story = {
  args: {
    label: 'A',
    tabId: 'tab-short',
    isActive: false,
    disabled: false,
    ariaControls: 'panel-short',
    ariaSelected: false,
    tabindex: -1,
  },
};

export const AllStates: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; gap: 8px; border-bottom: 2px solid var(--color-border);">
          <eb-tab-button
            label="Default"
            tabId="tab-1"
            ariaControls="panel-1"
            [isActive]="false"
            [disabled]="false"
            [ariaSelected]="false"
            [tabindex]="-1"
          />
          <eb-tab-button
            label="Active"
            tabId="tab-2"
            ariaControls="panel-2"
            [isActive]="true"
            [disabled]="false"
            [ariaSelected]="true"
            [tabindex]="0"
          />
          <eb-tab-button
            label="Disabled"
            tabId="tab-3"
            ariaControls="panel-3"
            [isActive]="false"
            [disabled]="true"
            [ariaSelected]="false"
            [tabindex]="-1"
          />
        </div>
        <div style="display: flex; gap: 8px; border-bottom: 2px solid var(--color-border);">
          <eb-tab-button
            label="Home"
            tabId="tab-4"
            icon="${ICON_NAMES.HOME}"
            ariaControls="panel-4"
            [isActive]="false"
            [disabled]="false"
            [ariaSelected]="false"
            [tabindex]="-1"
          />
          <eb-tab-button
            label="Settings"
            tabId="tab-5"
            icon="${ICON_NAMES.SETTINGS}"
            ariaControls="panel-5"
            [isActive]="true"
            [disabled]="false"
            [ariaSelected]="true"
            [tabindex]="0"
          />
          <eb-tab-button
            label="Projects"
            tabId="tab-6"
            icon="${ICON_NAMES.FOLDER}"
            ariaControls="panel-6"
            [isActive]="false"
            [disabled]="true"
            [ariaSelected]="false"
            [tabindex]="-1"
          />
        </div>
      </div>
    `,
  }),
};
