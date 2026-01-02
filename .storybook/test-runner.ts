import type { TestRunnerConfig } from '@storybook/test-runner';
import { checkA11y, injectAxe } from 'axe-playwright';

/**
 * Get the theme to test from environment variable.
 * Defaults to 'light-default' if not specified.
 */
const theme = process.env['STORYBOOK_THEME'] ?? 'light-default';

/*
 * See https://storybook.js.org/docs/writing-tests/test-runner#test-hook-api
 * to learn more about the test-runner hooks API.
 */
const config: TestRunnerConfig = {
  async preVisit(page) {
    // Inject axe-core into the page for accessibility testing
    await injectAxe(page);
  },
  async postVisit(page) {
    // Set the theme before running accessibility checks
    await page.evaluate((themeValue: string) => {
      document.documentElement.setAttribute('data-theme', themeValue);
    }, theme);

    // Wait for any theme-related CSS transitions
    await page.waitForTimeout(100);

    // Run accessibility checks after each story renders
    await checkA11y(page, '#storybook-root', {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    });
  },
};

export default config;
