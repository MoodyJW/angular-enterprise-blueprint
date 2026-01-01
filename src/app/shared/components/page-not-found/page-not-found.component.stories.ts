import { provideRouter } from '@angular/router';
import { provideTransloco } from '@jsverse/transloco';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';

import { TranslocoHttpLoader } from '@core/i18n/transloco-loader';
import { PageNotFoundComponent } from './page-not-found.component';

const meta: Meta<PageNotFoundComponent> = {
  title: 'Shared/PageNotFound',
  component: PageNotFoundComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [
        provideRouter([]),
        provideTransloco({
          config: {
            availableLangs: ['en'],
            defaultLang: 'en',
            reRenderOnLangChange: true,
            prodMode: false,
          },
          loader: TranslocoHttpLoader,
        }),
      ],
    }),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A 404 error page component displayed when users navigate to a non-existent route. Features a prominent error code, friendly message, and a call-to-action button to return home.',
      },
    },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'heading-order', enabled: true },
        ],
      },
    },
  },
};

export default meta;
type Story = StoryObj<PageNotFoundComponent>;

/**
 * Default 404 page with error code, title, message, and navigation button.
 */
export const Default: Story = {
  render: () => ({
    template: `<eb-page-not-found />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'The standard 404 page as it appears when users navigate to a non-existent route.',
      },
    },
  },
};

/**
 * The 404 page shown within a container to demonstrate how it centers itself.
 */
export const InContainer: Story = {
  render: () => ({
    template: `
      <div style="height: 100vh; background: var(--color-background);">
        <eb-page-not-found />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how the component centers itself within a full-height container.',
      },
    },
  },
};
