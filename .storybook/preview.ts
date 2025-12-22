import { setCompodocJson } from '@storybook/addon-docs/angular';
import type { Preview } from '@storybook/angular';
import docJson from '../documentation.json';
setCompodocJson(docJson);

const preview: Preview = {
  parameters: {
    backgrounds: {
      options: {
        // 👇 Default options
        dark: { name: 'Dark', value: '#333' },
        light: { name: 'Light', value: '#F7F9F2' },
        // 👇 Add your own
        maroon: { name: 'Maroon', value: '#400' },
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
