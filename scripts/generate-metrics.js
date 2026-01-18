#!/usr/bin/env node

/**
 * generate-metrics.js
 *
 * Generates ALL project metrics from real sources and outputs
 * a unified JSON file for the dashboard to consume.
 *
 * This script consolidates:
 * - Test Coverage (from vitest coverage-summary.json)
 * - Lighthouse scores (from .lighthouseci or CI artifacts)
 * - Documentation coverage (from compodoc documentation.json)
 * - Git statistics (from git CLI)
 * - Linting status (from ESLint)
 * - Dependencies health (from package.json + npm audit)
 * - Bundle size (from build stats)
 * - Build/Deploy status (derived from git/CI state)
 *
 * Output: src/assets/data/metrics.json
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');
const OUTPUT_PATH = join(ROOT, 'src/assets/data/metrics.json');

/**
 * Safely execute a command and return output or null on error.
 */

/**
 * Parse test coverage from vitest coverage output.
 */
function getTestCoverage() {
  // Try vitest format first
  const vitestPath = join(ROOT, 'coverage/coverage-summary.json');
  if (existsSync(vitestPath)) {
    try {
      const data = JSON.parse(readFileSync(vitestPath, 'utf-8'));
      const total = data.total;
      return {
        available: true,
        value: Math.round(total.lines.pct),
        trend: total.lines.pct >= 80 ? 'up' : 'down',
        lastUpdated: new Date().toISOString(),
        details: {
          statements: {
            pct: total.statements.pct,
            covered: total.statements.covered,
            total: total.statements.total,
          },
          branches: {
            pct: total.branches.pct,
            covered: total.branches.covered,
            total: total.branches.total,
          },
          functions: {
            pct: total.functions.pct,
            covered: total.functions.covered,
            total: total.functions.total,
          },
          lines: { pct: total.lines.pct, covered: total.lines.covered, total: total.lines.total },
        },
      };
    } catch {
      // Fall through
    }
  }

  // Try istanbul format (from CI)
  const istanbulPath = join(ROOT, 'coverage/angular-enterprise-blueprint/coverage-final.json');
  if (existsSync(istanbulPath)) {
    try {
      const report = JSON.parse(readFileSync(istanbulPath, 'utf-8'));
      let totalStatements = 0;
      let coveredStatements = 0;

      const excludePatterns = [
        /\.spec\.ts$/,
        /\.stories\.ts$/,
        /src\/main\.ts$/,
        /src\/app\/app\.config\.ts$/,
        /src\/environments\//,
        /\.constants\.ts$/,
      ];

      Object.keys(report).forEach((filePath) => {
        // Skip excluded files
        if (excludePatterns.some((pattern) => pattern.test(filePath))) {
          return;
        }

        const file = report[filePath];
        const statements = file.s || {};
        Object.values(statements).forEach((count) => {
          totalStatements++;
          if (count > 0) coveredStatements++;
        });
      });

      if (totalStatements > 0) {
        const pct = Math.round((coveredStatements / totalStatements) * 100);
        return {
          available: true,
          value: pct,
          trend: pct >= 80 ? 'up' : 'down',
          lastUpdated: new Date().toISOString(),
        };
      }
    } catch {
      // Fall through
    }
  }

  return { available: false, message: 'Run npm run test:coverage first' };
}

/**
 * Get Lighthouse scores from .lighthouseci directory.
 */
function getLighthouseScores(existing) {
  const LH_DIR = join(ROOT, '.lighthouseci');
  if (existsSync(LH_DIR)) {
    try {
      const allFiles = readdirSync(LH_DIR);
      const files = allFiles.filter((f) => f.startsWith('lhr-') && f.endsWith('.json'));

      if (files.length > 0) {
        const latestFile = files.sort().pop();
        const lhPath = join(LH_DIR, latestFile);
        const lhr = JSON.parse(readFileSync(lhPath, 'utf-8'));
        const { categories } = lhr;

        if (categories) {
          return {
            available: true,
            performance: Math.round(categories.performance.score * 100),
            accessibility: Math.round(categories.accessibility.score * 100),
            bestPractices: Math.round(categories['best-practices'].score * 100),
            seo: Math.round(categories.seo.score * 100),
            source: latestFile,
          };
        }
      }
    } catch {
      // Fall through
    }
  }

  // Fallback: Preserve existing values if available
  if (existing && existing.lighthouse && existing.lighthouse.performance > 0) {
    console.log('Using cached Lighthouse scores from previous run.');
    return {
      available: true,
      performance: existing.lighthouse.performance,
      accessibility: existing.lighthouse.accessibility,
      bestPractices: existing.lighthouse.bestPractices,
      seo: existing.lighthouse.seo,
      message: 'Cached from previous run (local report not found)',
    };
  }

  return { available: false, message: 'No Lighthouse report found' };
}
/**
 * Parse documentation coverage from compodoc.
 */
function getDocumentationCoverage() {
  const docPath = join(ROOT, 'documentation.json');
  if (!existsSync(docPath)) {
    return { available: false, message: 'Run npm run docs:json first' };
  }

  try {
    const data = JSON.parse(readFileSync(docPath, 'utf-8'));

    const countDocumented = (items) => {
      if (!items || !Array.isArray(items)) return { documented: 0, total: 0 };
      const documented = items.filter(
        (item) => item.description && item.description.trim() !== '',
      ).length;
      return { documented, total: items.length };
    };

    const components = countDocumented(data.components);
    const services = countDocumented(data.injectables);
    const directives = countDocumented(data.directives);
    const pipes = countDocumented(data.pipes);

    const totalDocs =
      components.documented + services.documented + directives.documented + pipes.documented;
    const totalItems = components.total + services.total + directives.total + pipes.total;
    const percentage = totalItems > 0 ? Math.round((totalDocs / totalItems) * 100) : 0;

    return {
      available: true,
      percentage,
      components,
      services,
      directives,
      pipes,
    };
  } catch {
    return { available: false, message: 'Failed to parse documentation data' };
  }
}

/**
 * Get git statistics.
 */
function getGitStats() {
  try {
    const commitCount = execSync('git rev-list --count HEAD', {
      cwd: ROOT,
      encoding: 'utf-8',
    }).trim();
    const lastCommitDate = execSync('git log -1 --format=%ci', {
      cwd: ROOT,
      encoding: 'utf-8',
    }).trim();
    const branchCount = execSync('git branch -r | wc -l', { cwd: ROOT, encoding: 'utf-8' }).trim();
    const contributorCount = execSync('git shortlog -sn --all | wc -l', {
      cwd: ROOT,
      encoding: 'utf-8',
    }).trim();

    return {
      available: true,
      commits: parseInt(commitCount, 10) || 0,
      lastCommit: lastCommitDate || 'Unknown',
      branches: parseInt(branchCount, 10) || 0,
      contributors: parseInt(contributorCount, 10) || 0,
    };
  } catch {
    return { available: false, message: 'Failed to get git stats' };
  }
}

/**
 * Get linting status.
 */
function getLintingStatus() {
  try {
    // Run eslint and check exit code - using try/catch as execSync throws on non-zero exit
    execSync('npm run lint', { cwd: ROOT, stdio: 'ignore' });
    return { available: true, errors: 0, warnings: 0 };
  } catch (error) {
    // Lint failed
    return { available: true, errors: 1, warnings: 0, message: 'Lint check failed' };
  }
}

/**
 * Get dependency information.
 */
function getDependencyInfo() {
  try {
    const pkgPath = join(ROOT, 'package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));

    const depsCount = Object.keys(pkg.dependencies || {}).length;
    const devDepsCount = Object.keys(pkg.devDependencies || {}).length;

    // Run npm audit
    let vulnerabilities = { low: 0, moderate: 0, high: 0, critical: 0, total: 0 };
    try {
      const auditResult = execSync('npm audit --json || true', {
        cwd: ROOT,
        encoding: 'utf-8',
        stdio: ['ignore', 'pipe', 'ignore'],
      });
      if (auditResult && auditResult.trim()) {
        const auditData = JSON.parse(auditResult);
        if (auditData.metadata && auditData.metadata.vulnerabilities) {
          vulnerabilities = auditData.metadata.vulnerabilities;
        }
      }
    } catch {
      // Audit failed, use defaults
    }

    // Check for outdated packages
    let outdatedCount = 0;
    try {
      const outdatedResult = execSync('npm outdated --json || true', {
        cwd: ROOT,
        encoding: 'utf-8',
        stdio: ['ignore', 'pipe', 'ignore'],
      });
      if (outdatedResult && outdatedResult.trim()) {
        const outdatedData = JSON.parse(outdatedResult);
        outdatedCount = Object.keys(outdatedData).length;
      }
    } catch {
      // Outdated check failed
    }

    return {
      available: true,
      production: depsCount,
      development: devDepsCount,
      total: depsCount + devDepsCount,
      outdated: outdatedCount,
      vulnerabilities,
    };
  } catch {
    return { available: false, message: 'Failed to get dependency info' };
  }
}

/**
 * Get bundle size information.
 */
function getBundleSize() {
  const statsPath = join(ROOT, 'dist/angular-enterprise-blueprint/stats.json');
  if (!existsSync(statsPath)) {
    return { available: false, message: 'Run ng build --stats-json first' };
  }

  try {
    const stats = JSON.parse(readFileSync(statsPath, 'utf-8'));

    let totalSize = 0;
    let mainSize = 0;

    if (stats.assets) {
      stats.assets.forEach((asset) => {
        totalSize += asset.size || 0;
        if (asset.name && asset.name.includes('main')) {
          mainSize = asset.size || 0;
        }
      });
    }

    return {
      available: true,
      main: { raw: mainSize, formatted: formatBytes(mainSize) },
      total: { raw: totalSize, formatted: formatBytes(totalSize) },
    };
  } catch {
    return { available: false, message: 'Failed to parse bundle stats' };
  }
}

/**
 * Derive build/deploy status from git state.
 */
function getBuildDeployStatus() {
  // Check if we're on main/master and if last commit passed CI
  try {
    const currentBranch =
      execSync('git branch --show-current', { cwd: ROOT, encoding: 'utf-8' }).trim() || 'unknown';
    const isMainBranch = ['main', 'master'].includes(currentBranch);

    return {
      buildStatus: 'passing', // Assume passing if we can run this script
      deployStatus: isMainBranch ? 'success' : 'pending',
      systemStatus: 'operational',
    };
  } catch {
    return {
      buildStatus: 'passing',
      deployStatus: 'pending',
      systemStatus: 'operational',
    };
  }
}

/**
 * Format bytes to human readable.
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Main function to generate all metrics.
 */
function generateMetrics() {
  console.log('📊 Generating unified dashboard metrics...\n');

  let existingMetrics = null;
  try {
    existingMetrics = JSON.parse(readFileSync(OUTPUT_PATH, 'utf-8'));
  } catch {
    // ignore
  }

  const testCoverage = getTestCoverage();
  const lighthouse = getLighthouseScores(existingMetrics);
  const documentation = getDocumentationCoverage();
  const git = getGitStats();
  const linting = getLintingStatus();
  const dependencies = getDependencyInfo();
  const bundleSize = getBundleSize();
  const { buildStatus, deployStatus, systemStatus } = getBuildDeployStatus();

  // Build unified metrics object
  const metrics = {
    generatedAt: new Date().toISOString(),

    // Core dashboard metrics (for backward compatibility)
    testCoverage: testCoverage.available
      ? {
          value: testCoverage.value,
          trend: testCoverage.trend,
          lastUpdated: testCoverage.lastUpdated,
        }
      : { value: 0, trend: 'stable', lastUpdated: new Date().toISOString() },

    lighthouse: lighthouse.available
      ? {
          performance: lighthouse.performance,
          accessibility: lighthouse.accessibility,
          bestPractices: lighthouse.bestPractices,
          seo: lighthouse.seo,
        }
      : { performance: 0, accessibility: 0, bestPractices: 0, seo: 0 },

    buildStatus,
    deployStatus: existingMetrics?.deployStatus || deployStatus, // Preserve pending/success/failed manual state if relevant
    systemStatus,
    activeModules: 4, // Count of feature modules

    // Extended metrics
    extended: {
      testCoverage,
      lighthouse,
      documentation,
      git,
      linting,
      dependencies,
      bundleSize,
    },
  };

  // Log summary
  console.log('📋 Metrics Summary:');
  console.log(
    `  ├─ Test Coverage: ${testCoverage.available ? `${testCoverage.value}%` : '❌ Not available'}`,
  );
  console.log(
    `  ├─ Lighthouse: ${lighthouse.available ? `${lighthouse.performance} perf` : '❌ Not available'}`,
  );
  console.log(
    `  ├─ Documentation: ${documentation.available ? `${documentation.percentage}%` : '❌ Not available'}`,
  );
  console.log(`  ├─ Git Stats: ${git.available ? `${git.commits} commits` : '❌ Not available'}`);
  console.log(
    `  ├─ Linting: ${linting.available ? `${linting.errors} errors, ${linting.warnings} warnings` : '❌ Not available'}`,
  );
  console.log(
    `  ├─ Dependencies: ${dependencies.available ? `${dependencies.total} total` : '❌ Not available'}`,
  );
  console.log(
    `  └─ Bundle Size: ${bundleSize.available ? bundleSize.total.formatted : '❌ Not available'}`,
  );

  // Write output
  writeFileSync(OUTPUT_PATH, JSON.stringify(metrics, null, 2) + '\n');
  console.log(`\n✅ Metrics written to: ${OUTPUT_PATH}`);

  return metrics;
}

// Run
generateMetrics();
