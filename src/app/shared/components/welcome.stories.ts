import type { Meta, StoryObj } from '@storybook/angular';

/**
 * Welcome placeholder story.
 * This file ensures Storybook has at least one story to build.
 * Replace with real component stories as the design system is implemented.
 */
const meta: Meta = {
  title: 'Welcome',
};

export default meta;
type Story = StoryObj;

export const Introduction: Story = {
  render: () => ({
    template: `
      <div style="padding: 2rem; font-family: system-ui, sans-serif;">
        <h1>Angular Enterprise Blueprint</h1>
        <p>Welcome to the component library. Add your component stories here.</p>
      </div>
    `,
  }),
};
