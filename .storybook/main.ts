import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: [
    // Focus on shared components (Design System)
    '../src/app/shared/**/*.mdx',
    '../src/app/shared/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs', '@storybook/addon-onboarding'],
  framework: '@storybook/angular',
  docs: {
    autodocs: true,
  },
};

export default config;
