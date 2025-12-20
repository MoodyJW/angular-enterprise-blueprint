import type { Meta, StoryObj } from '@storybook/angular';

import { InputFooterComponent } from './input-footer.component';

const meta: Meta<InputFooterComponent> = {
  title: 'Shared/Input/Footer',
  component: InputFooterComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Footer area for input components. Shows helper text and optional character count when enabled.',
      },
    },
  },
  argTypes: {
    helperText: { control: 'text', description: 'Helper text shown under the input' },
    showCharCount: { control: 'boolean', description: 'Toggle character count display' },
    maxLength: { control: 'number', description: 'Maximum length used to compute char count' },
    charCountText: { control: 'text', description: 'Computed character count text (e.g. 3/10)' },
  },
};

export default meta;
type Story = StoryObj<InputFooterComponent>;

export const Default: Story = {
  args: {
    helperText: 'This is helper text',
    helperTextId: 'helper-1',
    helperTextClasses: 'input-helper-text',
    showCharCount: true,
    maxLength: 20,
    charCountText: '5/20',
  },
};

export const HelperOnly: Story = {
  args: {
    helperText: 'Only helper text shown here',
    helperTextId: 'helper-2',
    helperTextClasses: 'input-helper-text',
    showCharCount: false,
    maxLength: undefined,
    charCountText: '',
  },
};

export const CharCountOnly: Story = {
  args: {
    helperText: '',
    helperTextId: undefined,
    helperTextClasses: 'input-helper-text',
    showCharCount: true,
    maxLength: 50,
    charCountText: '12/50',
  },
};
