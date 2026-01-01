import { provideIcons } from '@ng-icons/core';
import * as heroIcons from '@ng-icons/heroicons/outline';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';

import { ICON_NAMES } from '@shared/constants';
import { ButtonContentComponent } from './button-content.component';

const meta: Meta<ButtonContentComponent> = {
  title: 'Shared/Button/ButtonContent',
  component: ButtonContentComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [provideIcons(heroIcons)],
    }),
  ],
  argTypes: {
    loading: {
      control: 'boolean',
      description: 'Whether the button is in loading state (shows spinner)',
    },
    iconLeft: {
      control: 'select',
      options: [undefined, ...Object.values(ICON_NAMES)],
      description: 'Icon identifier for left position',
    },
    iconRight: {
      control: 'select',
      options: [undefined, ...Object.values(ICON_NAMES)],
      description: 'Icon identifier for right position',
    },
    iconOnly: {
      control: 'boolean',
      description: 'Whether this is an icon-only button (hides text content)',
    },
  },
};

export default meta;
type Story = StoryObj<ButtonContentComponent>;

export const Default: Story = {
  args: {
    loading: false,
    iconLeft: undefined,
    iconRight: undefined,
    iconOnly: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="btn btn--primary btn--md">
        <eb-button-content
          [loading]="loading"
          [iconLeft]="iconLeft"
          [iconRight]="iconRight"
          [iconOnly]="iconOnly"
        >
          Click me
        </eb-button-content>
      </div>
    `,
  }),
};

export const WithLeftIcon: Story = {
  args: {
    loading: false,
    iconLeft: ICON_NAMES.ARROW_LEFT,
    iconRight: undefined,
    iconOnly: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="btn btn--primary btn--md">
        <eb-button-content
          [loading]="loading"
          [iconLeft]="iconLeft"
          [iconRight]="iconRight"
          [iconOnly]="iconOnly"
        >
          Back
        </eb-button-content>
      </div>
    `,
  }),
};

export const WithRightIcon: Story = {
  args: {
    loading: false,
    iconLeft: undefined,
    iconRight: ICON_NAMES.ARROW_RIGHT,
    iconOnly: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="btn btn--secondary btn--md">
        <eb-button-content
          [loading]="loading"
          [iconLeft]="iconLeft"
          [iconRight]="iconRight"
          [iconOnly]="iconOnly"
        >
          Next
        </eb-button-content>
      </div>
    `,
  }),
};

export const WithBothIcons: Story = {
  args: {
    loading: false,
    iconLeft: ICON_NAMES.ARROW_LEFT,
    iconRight: ICON_NAMES.ARROW_RIGHT,
    iconOnly: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="btn btn--tertiary btn--md">
        <eb-button-content
          [loading]="loading"
          [iconLeft]="iconLeft"
          [iconRight]="iconRight"
          [iconOnly]="iconOnly"
        >
          Navigate
        </eb-button-content>
      </div>
    `,
  }),
};

export const IconOnly: Story = {
  args: {
    loading: false,
    iconLeft: ICON_NAMES.CLOSE,
    iconRight: undefined,
    iconOnly: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="btn btn--ghost btn--md btn--icon-only">
        <eb-button-content
          [loading]="loading"
          [iconLeft]="iconLeft"
          [iconRight]="iconRight"
          [iconOnly]="iconOnly"
        >
          Close
        </eb-button-content>
      </div>
    `,
  }),
};

export const Loading: Story = {
  args: {
    loading: true,
    iconLeft: undefined,
    iconRight: undefined,
    iconOnly: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="btn btn--primary btn--md btn--loading">
        <eb-button-content
          [loading]="loading"
          [iconLeft]="iconLeft"
          [iconRight]="iconRight"
          [iconOnly]="iconOnly"
        >
          Saving...
        </eb-button-content>
      </div>
    `,
  }),
};

export const LoadingWithIcons: Story = {
  args: {
    loading: true,
    iconLeft: ICON_NAMES.ARROW_LEFT,
    iconRight: ICON_NAMES.ARROW_RIGHT,
    iconOnly: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="btn btn--secondary btn--md btn--loading">
        <eb-button-content
          [loading]="loading"
          [iconLeft]="iconLeft"
          [iconRight]="iconRight"
          [iconOnly]="iconOnly"
        >
          Loading...
        </eb-button-content>
      </div>
    `,
  }),
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <div class="btn btn--primary btn--sm">
          <eb-button-content iconLeft="${ICON_NAMES.STAR}">
            Small
          </eb-button-content>
        </div>
        <div class="btn btn--primary btn--md">
          <eb-button-content iconLeft="${ICON_NAMES.STAR}">
            Medium
          </eb-button-content>
        </div>
        <div class="btn btn--primary btn--lg">
          <eb-button-content iconLeft="${ICON_NAMES.STAR}">
            Large
          </eb-button-content>
        </div>
      </div>
    `,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; flex-direction: column;">
        <div class="btn btn--primary btn--md">
          <eb-button-content iconLeft="${ICON_NAMES.CHECK}">
            Primary
          </eb-button-content>
        </div>
        <div class="btn btn--secondary btn--md">
          <eb-button-content iconLeft="${ICON_NAMES.CHECK}">
            Secondary
          </eb-button-content>
        </div>
        <div class="btn btn--tertiary btn--md">
          <eb-button-content iconLeft="${ICON_NAMES.CHECK}">
            Tertiary
          </eb-button-content>
        </div>
        <div class="btn btn--ghost btn--md">
          <eb-button-content iconLeft="${ICON_NAMES.CHECK}">
            Ghost
          </eb-button-content>
        </div>
        <div class="btn btn--danger btn--md">
          <eb-button-content iconLeft="${ICON_NAMES.WARNING}">
            Danger
          </eb-button-content>
        </div>
      </div>
    `,
  }),
};
