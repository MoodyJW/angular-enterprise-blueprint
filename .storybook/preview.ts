import { setCompodocJson } from '@storybook/addon-docs/angular';
import type { Decorator, Preview } from '@storybook/angular';
import docJson from '../documentation.json';
setCompodocJson(docJson);

/**
 * Theme definitions matching the application's theme system
 */
const THEMES = [
  { value: 'light-default', title: 'Light Default (Daylight)', icon: 'sun' },
  { value: 'light-warm', title: 'Light Warm (Sunrise)', icon: 'sun' },
  { value: 'dark-default', title: 'Dark Default (Midnight)', icon: 'moon' },
  { value: 'dark-cool', title: 'Dark Cool (Twilight)', icon: 'moon' },
  { value: 'high-contrast-light', title: 'High Contrast Light', icon: 'accessibility' },
  { value: 'high-contrast-dark', title: 'High Contrast Dark', icon: 'accessibility' },
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
        items: THEMES.map((t) => ({ value: t.value, title: t.title, icon: t.icon })),
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
  },
};

export default preview;
