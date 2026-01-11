import { provideIcons } from '@ng-icons/core';
import { heroArrowRightOnRectangle, heroUserCircle } from '@ng-icons/heroicons/outline';
import { Meta, StoryObj } from '@storybook/angular';

import { User } from '@core/auth';
import { UserMenuComponent } from './user-menu.component';

const meta: Meta<UserMenuComponent> = {
  title: 'Core/Layout/UserMenu',
  component: UserMenuComponent,
  tags: ['autodocs'],
  decorators: [
    (story) => ({
      ...story(),
      template: `<div style="display: flex; justify-content: flex-end; padding: 20px;">${story().template ?? ''}</div>`,
    }),
  ],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    user: {
      id: '1',
      username: 'johndoe',
      email: 'john.doe@example.com',
      roles: ['user'],
    } as User,
  },
};

export default meta;
type Story = StoryObj<UserMenuComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    moduleMetadata: {
      providers: [provideIcons({ heroUserCircle, heroArrowRightOnRectangle })],
    },
  }),
};

export const LongName: Story = {
  args: {
    user: {
      id: '2',
      username: 'Alexander The Great Of Macedon',
      email: 'alexander.the.great@macedon.empire.gov',
      roles: ['admin'],
    } as User,
  },
  render: (args) => ({
    props: args,
    moduleMetadata: {
      providers: [provideIcons({ heroUserCircle, heroArrowRightOnRectangle })],
    },
  }),
};
