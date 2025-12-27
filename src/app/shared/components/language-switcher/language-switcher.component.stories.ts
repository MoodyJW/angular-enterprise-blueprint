import { TranslocoModule, provideTransloco } from '@jsverse/transloco';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, argsToTemplate, moduleMetadata } from '@storybook/angular';

import { provideHttpClient } from '@angular/common/http';
import { TranslocoHttpLoader } from '@core/i18n';
import { LanguageSwitcherComponent } from './language-switcher.component';

const meta: Meta<LanguageSwitcherComponent> = {
  title: 'Shared/LanguageSwitcher',
  component: LanguageSwitcherComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [TranslocoModule],
    }),
    applicationConfig({
      providers: [
        provideHttpClient(),
        provideTransloco({
          config: {
            availableLangs: ['en', 'es'],
            defaultLang: 'en',
            fallbackLang: 'en',
            reRenderOnLangChange: true,
            prodMode: false,
          },
          loader: TranslocoHttpLoader,
        }),
      ],
    }),
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: ['dropdown', 'inline'],
      description: 'Display variant of the language switcher',
      table: {
        type: { summary: 'LanguageSwitcherVariant' },
        defaultValue: { summary: 'dropdown' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: 'Size of the language switcher',
      table: {
        type: { summary: 'LanguageSwitcherSize' },
        defaultValue: { summary: 'md' },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Language switcher component for changing the application's active language. Supports dropdown and inline variants with keyboard navigation and localStorage persistence. AI-translated Spanish included.",
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'aria-required-attr',
            enabled: true,
          },
        ],
      },
    },
  },
};

export default meta;
type Story = StoryObj<LanguageSwitcherComponent>;

// Default Dropdown
export const Default: Story = {
  render: () => ({
    template: `
      <div style="padding: 20px;">
        <eb-language-switcher />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Default dropdown variant of the language switcher.',
      },
    },
  },
};

// Inline Variant
export const InlineVariant: Story = {
  render: () => ({
    template: `
      <div style="padding: 20px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 14px; color: var(--color-text-secondary);">Language:</span>
          <eb-language-switcher variant="inline" />
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Inline variant for compact language selection, ideal for settings bars or footers.',
      },
    },
  },
};

// All Variants Comparison
export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; padding: 20px;">
        <div>
          <h4 style="margin: 0 0 12px 0; font-size: 14px; color: var(--color-text-secondary);">Dropdown</h4>
          <eb-language-switcher variant="dropdown" />
        </div>

        <div>
          <h4 style="margin: 0 0 12px 0; font-size: 14px; color: var(--color-text-secondary);">Inline</h4>
          <eb-language-switcher variant="inline" />
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of both language switcher variants.',
      },
    },
  },
};

// All Sizes
export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; padding: 20px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="width: 80px; font-size: 14px; color: var(--color-text-secondary);">Small:</span>
          <eb-language-switcher size="sm" />
        </div>

        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="width: 80px; font-size: 14px; color: var(--color-text-secondary);">Medium:</span>
          <eb-language-switcher size="md" />
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'All available sizes of the language switcher.',
      },
    },
  },
};

// In Header Context
export const InHeaderContext: Story = {
  render: () => ({
    template: `
      <header style="display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; background: var(--color-surface); border-bottom: 1px solid var(--color-border);">
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 20px; font-weight: 600; color: var(--color-text);">My App</span>
        </div>

        <div style="display: flex; align-items: center; gap: 16px;">
          <nav style="display: flex; gap: 16px;">
            <a href="#" style="color: var(--color-text-secondary); text-decoration: none;">Dashboard</a>
            <a href="#" style="color: var(--color-text-secondary); text-decoration: none;">Settings</a>
          </nav>
          <eb-language-switcher size="sm" />
        </div>
      </header>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Language switcher integrated into a typical application header.',
      },
    },
  },
};

// In Settings Panel
export const InSettingsPanel: Story = {
  render: () => ({
    template: `
      <div style="max-width: 600px; padding: 24px; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 8px;">
        <h3 style="margin: 0 0 24px 0; font-size: 18px; color: var(--color-text);">Language Settings</h3>

        <div style="display: flex; flex-direction: column; gap: 24px;">
          <div>
            <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: var(--color-text);">
              Application Language
            </label>
            <p style="margin: 0 0 12px 0; font-size: 13px; color: var(--color-text-secondary);">
              Choose your preferred language for the application interface.
              <br /><em>Note: Spanish translations are AI-generated.</em>
            </p>
            <eb-language-switcher variant="inline" />
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Language switcher in a settings panel context with inline layout.',
      },
    },
  },
};

// Accessibility Demo
export const AccessibilityDemo: Story = {
  render: () => ({
    template: `
      <div style="max-width: 600px; padding: 20px;">
        <h4 style="margin: 0 0 16px 0;">Accessibility Features</h4>
        <ul style="font-size: 14px; line-height: 1.8; color: var(--color-text-secondary); margin: 0 0 24px 0; padding-left: 20px;">
          <li><strong>ARIA Labels:</strong> Descriptive labels for screen readers</li>
          <li><strong>Role:</strong> Uses listbox role for semantic meaning</li>
          <li><strong>Keyboard Navigation:</strong> Enter/Space to open, Escape to close</li>
          <li><strong>Focus Management:</strong> Visible focus indicators</li>
          <li><strong>Screen Reader:</strong> Announces current language selection</li>
        </ul>

        <h5 style="margin: 0 0 12px 0; font-size: 14px;">Keyboard Controls:</h5>
        <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border: 1px solid var(--color-border);"><kbd>Enter</kbd> / <kbd>Space</kbd></td>
            <td style="padding: 8px; border: 1px solid var(--color-border);">Open dropdown / Select language</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid var(--color-border);"><kbd>Escape</kbd></td>
            <td style="padding: 8px; border: 1px solid var(--color-border);">Close dropdown</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid var(--color-border);"><kbd>Tab</kbd></td>
            <td style="padding: 8px; border: 1px solid var(--color-border);">Close dropdown and move focus</td>
          </tr>
        </table>

        <div style="margin-top: 24px;">
          <eb-language-switcher />
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates accessibility features including keyboard navigation and ARIA attributes.',
      },
    },
  },
};

// Interactive Example
export const Interactive: Story = {
  args: {
    variant: 'dropdown',
    size: 'md',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 20px;">
        <eb-language-switcher ${argsToTemplate(args)} />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Interactive language switcher - use the controls below to customize all properties.',
      },
    },
  },
};
