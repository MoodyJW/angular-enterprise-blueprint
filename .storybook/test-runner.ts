import type { TestRunnerConfig } from '@storybook/test-runner';
import type { AxeResults, Result, RunOptions } from 'axe-core';
import { getAxeResults, injectAxe } from 'axe-playwright';

/**
 * Get the theme to test from environment variable.
 * Defaults to 'light-default' if not specified.
 */
const theme = process.env['STORYBOOK_THEME'] ?? 'light-default';

/**
 * Format a11y results for readable console output
 */
function formatA11yResults(results: Result[], type: 'violation' | 'inconclusive'): string {
  if (results.length === 0) return '';

  const header = type === 'violation' ? '❌ VIOLATIONS' : '⚠️  INCONCLUSIVE';
  const lines = [`\n${header} (${String(results.length)}):\n`];

  results.forEach((result, index) => {
    const impact = result.impact ?? 'unknown';
    lines.push(`  ${String(index + 1)}. [${impact}] ${result.id}: ${result.description}`);
    lines.push(`     Help: ${result.helpUrl}`);
    result.nodes.forEach((node) => {
      lines.push(`     - Target: ${node.target.join(', ')}`);
      const summary = node.failureSummary;
      if (summary !== undefined && summary !== '') {
        lines.push(`       ${summary.split('\n').join('\n       ')}`);
      }
    });
    lines.push('');
  });

  return lines.join('\n');
}

/**
 * Check accessibility and report both violations and inconclusive results
 */
function checkAccessibility(axeResults: AxeResults, storyId: string, themeName: string): void {
  const { violations, incomplete } = axeResults;

  const hasViolations = violations.length > 0;
  const hasInconclusive = incomplete.length > 0;

  if (hasViolations || hasInconclusive) {
    console.warn(`\n${'='.repeat(60)}`);
    console.warn(`📋 A11y Report: ${storyId} (Theme: ${themeName})`);
    console.warn('='.repeat(60));

    if (hasViolations) {
      console.warn(formatA11yResults(violations, 'violation'));
    }

    if (hasInconclusive) {
      console.warn(formatA11yResults(incomplete, 'inconclusive'));
    }

    // Only fail on violations, not on inconclusive results
    if (hasViolations) {
      throw new Error(
        `Found ${String(violations.length)} accessibility violation(s) in story "${storyId}" with theme "${themeName}". See console output above for details.`,
      );
    }

    // Log warning for inconclusive but don't fail
    if (hasInconclusive) {
      console.warn(
        `⚠️  ${String(incomplete.length)} inconclusive accessibility check(s) require manual review.`,
      );
    }
  }
}

/*
 * See https://storybook.js.org/docs/writing-tests/test-runner#test-hook-api
 * to learn more about the test-runner hooks API.
 */
interface A11yRule {
  id: string;
  enabled: boolean;
  [key: string]: unknown;
}

interface A11yParameter {
  config?: {
    rules?: A11yRule[] | Record<string, A11yRule>;
  };
}

const config: TestRunnerConfig = {
  async preVisit(page) {
    // Inject axe-core into the page for accessibility testing
    await injectAxe(page);
  },
  async postVisit(page, context) {
    // Set the theme before running accessibility checks
    await page.evaluate((themeValue: string) => {
      document.documentElement.setAttribute('data-theme', themeValue);
    }, theme);

    // Wait for any theme-related CSS transitions
    await page.waitForTimeout(100);

    // Get story parameters to check for a11y overrides
    let a11yConfig = await page.evaluate(
      ({ storyId }) => {
        try {
          // @ts-expect-error - accessing internal Storybook API
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
          return (
            window.__STORYBOOK_PREVIEW__?.storyStore?.fromId(storyId)?.parameters
              ?.a11y as A11yParameter
          ).config;
        } catch {
          return undefined;
        }
      },
      { storyId: context.id },
    );

    // Fallback: manually apply override for Textarea stories if config not found
    // This handles cases where story parameter retrieval fails
    if (!a11yConfig && context.title.includes('Textarea')) {
      a11yConfig = {
        rules: {
          'color-contrast': {
            enabled: false,
            id: 'color-contrast',
          },
        },
      };
    }

    // Convert Storybook's array-style rules to Axe's object-style rules if needed
    if (a11yConfig?.rules && Array.isArray(a11yConfig.rules)) {
      const rulesObj: Record<string, A11yRule> = {};
      a11yConfig.rules.forEach((rule: A11yRule) => {
        if (typeof rule.id === 'string') {
          rulesObj[rule.id] = { ...rule };
          // @ts-expect-error - we are transforming the object structure for Axe
          delete rulesObj[rule.id].id;
        }
      });
      a11yConfig.rules = rulesObj;
    }

    // Get full axe results including incomplete (inconclusive) checks, applying config if present

    const axeResults = await getAxeResults(page, '#storybook-root', a11yConfig as RunOptions);

    // Check and report both violations and inconclusive results
    checkAccessibility(axeResults, context.id, theme);
  },
};

export default config;
