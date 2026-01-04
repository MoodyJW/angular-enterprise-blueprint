import type { TestRunnerConfig } from '@storybook/test-runner';
import type { AxeResults, Result } from 'axe-core';
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

    // Get full axe results including incomplete (inconclusive) checks
    const axeResults = await getAxeResults(page, '#storybook-root');

    // Check and report both violations and inconclusive results
    checkAccessibility(axeResults, context.id, theme);
  },
};

export default config;
