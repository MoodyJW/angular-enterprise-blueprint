import { setCompodocJson } from '@storybook/addon-docs/angular';
import type { Decorator, Preview } from '@storybook/angular';
import docJson from '../documentation.json';
setCompodocJson(docJson);

/**
 * Theme definitions matching the application's theme system
 * Uses valid Storybook icon names compatible with v10.2.0+
 */
const THEMES = [
  { value: 'light-default', title: 'Light Default (Daylight)', icon: 'circlehollow' as const },
  { value: 'light-warm', title: 'Light Warm (Sunrise)', icon: 'circlehollow' as const },
  { value: 'dark-default', title: 'Dark Default (Midnight)', icon: 'circle' as const },
  { value: 'dark-cool', title: 'Dark Cool (Twilight)', icon: 'circle' as const },
  { value: 'high-contrast-light', title: 'High Contrast Light', icon: 'eye' as const },
  { value: 'high-contrast-dark', title: 'High Contrast Dark', icon: 'eye' as const },
];

/**
 * Decorator that applies the selected theme to the document root
 */
const withThemeProvider: Decorator = (storyFn, context) => {
  const theme = (context.globals['theme'] as string | undefined) ?? 'light-default';
  document.documentElement.setAttribute('data-theme', theme);
  return storyFn();
};

const preview: Preview = {
  decorators: [withThemeProvider],
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: THEMES,
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light-default',
  },
  parameters: {
    backgrounds: { disable: true }, // Disable backgrounds addon since themes handle this
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['Shared', '*'],
        locales: 'en-US',
      },
    },
    a11y: {
      config: {
        rules: [
          // Disabled: Stories are isolated components without page context.
          // The 'region' rule requires content to be in landmark elements
          // (<main>, <nav>, etc.), which is a page-level concern, not component.
          { id: 'region', enabled: false },
        ],
      },
    },
  },
};

export default preview;
