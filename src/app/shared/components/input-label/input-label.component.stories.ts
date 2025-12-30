import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';

import { InputLabelComponent } from './input-label.component';

const meta: Meta<InputLabelComponent> = {
  title: 'Shared/InputLabel',
  component: InputLabelComponent,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text', description: 'The label text to display' },
    forId: { control: 'text', description: 'The ID of the associated input element' },
    required: { control: 'boolean', description: 'Whether the field is required' },
    labelClass: { control: 'text', description: 'Additional CSS classes for the label' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Reusable label component for form inputs. Supports required indicator and custom classes.',
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
    },
  },
};

export default meta;
type Story = StoryObj<InputLabelComponent>;

export const Default: Story = {
  args: {
    label: 'Email Address',
    forId: 'email',
    required: false,
    labelClass: 'input-label',
  },
  render: (args) => ({
    props: args,
    template: `<eb-input-label ${argsToTemplate(args)}></eb-input-label>`,
  }),
};

export const Required: Story = {
  args: {
    label: 'First Name',
    forId: 'firstName',
    required: true,
  },
  render: (args) => ({
    props: args,
    template: `<eb-input-label ${argsToTemplate(args)}></eb-input-label>`,
  }),
};

export const CustomClass: Story = {
  args: {
    label: 'Username',
    forId: 'username',
    required: false,
    labelClass: 'input-label input-label--custom',
  },
  render: (args) => ({
    props: args,
    template: `<eb-input-label ${argsToTemplate(args)}></eb-input-label>`,
  }),
};
