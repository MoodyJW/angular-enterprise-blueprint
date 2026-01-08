import { provideIcons } from '@ng-icons/core';
import { matRadioButtonChecked, matRadioButtonUnchecked } from '@ng-icons/material-icons/baseline';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

import { ICON_NAMES } from '@shared/constants';

import { RadioButtonIconComponent } from './radio-button-icon.component';

const meta: Meta<RadioButtonIconComponent> = {
  title: 'Shared/Components/Radio/RadioButtonIcon',
  component: RadioButtonIconComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [RadioButtonIconComponent],
      providers: [
        provideIcons({
          [ICON_NAMES.RADIO_UNCHECKED]: matRadioButtonUnchecked,
          [ICON_NAMES.RADIO_CHECKED]: matRadioButtonChecked,
        }),
      ],
    }),
  ],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the radio button icon is in checked state',
      defaultValue: { summary: 'false' },
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<RadioButtonIconComponent>;

export const Unchecked: Story = {
  args: {
    checked: false,
  },
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

/**
 * Variation showing the checked state with the primary color from the theme.
 */
export const CheckedStyled: Story = {
  args: {
    checked: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="color: var(--color-primary);">
        <eb-radio-button-icon [checked]="checked" />
      </div>
    `,
  }),
};

/**
 * Variation showing the radio button icon in a disabled-like state (reduced opacity).
 */
export const Disabled: Story = {
  args: {
    checked: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="opacity: 0.5; cursor: not-allowed;">
        <eb-radio-button-icon [checked]="checked" />
      </div>
    `,
  }),
};
