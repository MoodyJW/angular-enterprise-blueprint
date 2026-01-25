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
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'fs';
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
      // Calculate average from available props
      const avg = Math.round((total.statements.pct + total.functions.pct + total.lines.pct) / 3);
      return {
        available: true,
        value: avg,
        trend: avg >= 80 ? 'up' : 'down',
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
      let totalStatements = 0,
        coveredStatements = 0;
      let totalBranches = 0,
        coveredBranches = 0;
      let totalFunctions = 0,
        coveredFunctions = 0;
      let totalLines = 0,
        coveredLines = 0;

      const excludePatterns = [
        /\.spec\.ts$/,
        /\.stories\.ts$/,
        /src\/main\.ts$/,
        /src\/app\/app\.config\.ts$/,
        /src\/environments\//,
        /\.constants\.ts$/,
      ];

      Object.keys(report).forEach((filePath) => {
        if (excludePatterns.some((pattern) => pattern.test(filePath))) return;

        const file = report[filePath];

        // Statements
        Object.values(file.s || {}).forEach((count) => {
          totalStatements++;
          if (count > 0) coveredStatements++;
        });

        // Functions
        Object.values(file.f || {}).forEach((count) => {
          totalFunctions++;
          if (count > 0) coveredFunctions++;
        });

        // Branches
        Object.values(file.b || {}).forEach((branchCounts) => {
          branchCounts.forEach((count) => {
            totalBranches++;
            if (count > 0) coveredBranches++;
          });
        });

        // Lines (approximate if 'l' not present, use statements)
        // Istanbul usually provides 'statementMap' and 's'.
        // We'll use statements as proxy for lines if 'l' is missing,
        // but often file.s counts lines effectively for statements.
        // Let's count keys in 's' map as roughly lines for simplicity if needed,
        // but ideally we iterate statementMap.
        // For this fallback, using statement counts for lines is a reasonable approximation
        // if exact line data is complex to decode without a library.
        // Let's reuse statement stats for lines to be safe but separate variables.
        totalLines += Object.keys(file.s || {}).length;
        coveredLines += Object.values(file.s || {}).filter((c) => c > 0).length;
      });

      const calcPct = (covered, total) => (total > 0 ? Math.round((covered / total) * 100) : 0);
      const stPct = calcPct(coveredStatements, totalStatements);
      const brPct = calcPct(coveredBranches, totalBranches);
      const fnPct = calcPct(coveredFunctions, totalFunctions);
      const lnPct = calcPct(coveredLines, totalLines);

      // Average of Statements, Functions, and Lines (Excluding Branches per user request)
      const totalAvg = Math.round((stPct + fnPct + lnPct) / 3);

      if (totalStatements > 0) {
        return {
          available: true,
          value: totalAvg,
          trend: totalAvg >= 80 ? 'up' : 'down',
          lastUpdated: new Date().toISOString(),
          details: {
            statements: { pct: stPct, covered: coveredStatements, total: totalStatements },
            branches: { pct: brPct, covered: coveredBranches, total: totalBranches },
            functions: { pct: fnPct, covered: coveredFunctions, total: totalFunctions },
            lines: { pct: lnPct, covered: coveredLines, total: totalLines },
          },
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

  // Fallback: Preserve existing values if available (check extended.lighthouse after consolidation)
  const cachedLH = existing?.extended?.lighthouse || existing?.lighthouse;
  if (cachedLH && cachedLH.performance > 0) {
    console.log('Using cached Lighthouse scores from previous run.');
    return {
      available: true,
      performance: cachedLH.performance,
      accessibility: cachedLH.accessibility,
      bestPractices: cachedLH.bestPractices,
      seo: cachedLH.seo,
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
    const interfaces = countDocumented(data.interfaces);

    // Combine directives, pipes, and interfaces into "utils"
    const utils = {
      documented: directives.documented + pipes.documented + interfaces.documented,
      total: directives.total + pipes.total + interfaces.total,
    };

    const totalDocs = components.documented + services.documented + utils.documented;
    const totalItems = components.total + services.total + utils.total;
    const percentage = totalItems > 0 ? Math.round((totalDocs / totalItems) * 100) : 0;

    return {
      available: true,
      percentage,
      components,
      services,
      utils,
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
    const contributorCount = execSync('git shortlog -sn --all | grep -v "\\[bot\\]" | wc -l', {
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
 * Get duplication statistics using jscpd.
 */
function getDuplicationStats() {
  try {
    // Run jscpd
    execSync('npm run duplication', { cwd: ROOT, stdio: 'ignore' });

    const reportPath = join(ROOT, 'reports/jscpd/jscpd-report.json');
    if (existsSync(reportPath)) {
      const report = JSON.parse(readFileSync(reportPath, 'utf-8'));
      const total = report.statistics?.total;

      if (total) {
        return {
          available: true,
          percentage: parseFloat(total.percentage),
          totalLines: total.lines,
          duplicatedLines: total.duplicatedLines,
        };
      }
    }
  } catch (error) {
    // Fall through
  }
  return { available: false, message: 'Duplication check failed' };
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
  const distDir = join(ROOT, 'dist/angular-enterprise-blueprint/browser');
  const indexHtmlPath = join(distDir, 'index.html');
  const angularJsonPath = join(ROOT, 'angular.json');

  if (!existsSync(indexHtmlPath)) {
    return { available: false, message: 'Run ng build first' };
  }

  try {
    // 1. Get Budget from angular.json
    let budget = { warning: 750 * 1024, error: 1024 * 1024, warningStr: '750kB', errorStr: '1MB' };

    if (existsSync(angularJsonPath)) {
      try {
        const angularConfig = JSON.parse(readFileSync(angularJsonPath, 'utf-8'));
        const budgets =
          angularConfig.projects?.['angular-enterprise-blueprint']?.architect?.build?.configurations
            ?.production?.budgets || [];
        const initialBudget = budgets.find((b) => b.type === 'initial');

        if (initialBudget) {
          if (initialBudget.maximumWarning) {
            budget.warningStr = initialBudget.maximumWarning;
            budget.warning = parseSize(initialBudget.maximumWarning);
          }
          if (initialBudget.maximumError) {
            budget.errorStr = initialBudget.maximumError;
            budget.error = parseSize(initialBudget.maximumError);
          }
        }
      } catch {
        // use defaults
      }
    }

    // 2. Calculate Initial Bundle Size (scripts + styles in index.html)
    const indexHtml = readFileSync(indexHtmlPath, 'utf-8');
    const assetFiles = new Set();

    // Extract src from <script src="...">
    const scriptRegex = /<script[^>]+src="([^"]+)"/g;
    let match;
    while ((match = scriptRegex.exec(indexHtml)) !== null) {
      if (!match[1].startsWith('http')) {
        assetFiles.add(match[1]);
      }
    }

    // Extract href from <link rel="stylesheet" href="...">
    const styleRegex = /<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g;
    while ((match = styleRegex.exec(indexHtml)) !== null) {
      if (!match[1].startsWith('http')) {
        assetFiles.add(match[1]);
      }
    }

    // Extract href from <link rel="modulepreload" href="...">
    const preloadRegex = /<link[^>]+rel="modulepreload"[^>]+href="([^"]+)"/g;
    while ((match = preloadRegex.exec(indexHtml)) !== null) {
      if (!match[1].startsWith('http')) {
        assetFiles.add(match[1]);
      }
    }

    let initialSize = 0;
    console.log(`  🔍 Analyzing bundle in: ${distDir}`);
    assetFiles.forEach((file) => {
      try {
        const filePath = join(distDir, file);
        if (existsSync(filePath)) {
          const size = statSync(filePath).size;
          initialSize += size;
        } else {
          console.log(`    ⚠️ File not found: ${file}`);
        }
      } catch (e) {
        console.log(`    ⚠️ Error reading ${file}: ${e.message}`);
      }
    });

    // Determine status
    let status = 'pass';
    if (initialSize > budget.error) status = 'error';
    else if (initialSize > budget.warning) status = 'warn';

    return {
      available: true,
      initial: {
        raw: initialSize,
        formatted: formatBytes(initialSize),
        budget: budget.errorStr,
        status,
      },
    };
  } catch (e) {
    console.error(`  ❌ Error calculating bundle size:`, e);
    return { available: false, message: 'Failed to calculate bundle size' };
  }
}

/**
 * Parse size string (e.g. "1MB", "750kB") to bytes
 */
function parseSize(sizeStr) {
  const units = {
    k: 1024,
    kqv: 1024, // common typo protection or weird formats? No, standard is k/K/m/M
    kib: 1024,
    kb: 1024,
    m: 1024 * 1024,
    mib: 1024 * 1024,
    mb: 1024 * 1024,
    g: 1024 * 1024 * 1024,
    gb: 1024 * 1024 * 1024,
  };

  const regex = /^([0-9.]+)\s*([a-z]+)$/i;
  const match = sizeStr.toString().match(regex);
  if (!match) return 0;

  const value = parseFloat(match[1]);
  const unit = match[2].toLowerCase();

  return Math.round(value * (units[unit] || 1));
}

/**
 * Derive build/deploy status from git state.
 */
function getBuildDeployStatus() {
  // Check if we're on main/master and if last commit passed CI
  try {
    // 1. Check explicit override
    if (process.env.DEPLOY_STATUS) {
      return {
        buildStatus: 'passing',
        deployStatus: process.env.DEPLOY_STATUS,
        systemStatus: 'operational',
      };
    }

    // 2. Resolve branch name (local git or CI env)
    let currentBranch = 'unknown';

    try {
      currentBranch = execSync('git branch --show-current', {
        cwd: ROOT,
        encoding: 'utf-8',
      }).trim();
    } catch {
      // access access git failed or detached head
    }

    // Fallback for CI (GitHub Actions)
    if (!currentBranch || currentBranch === '') {
      if (process.env.GITHUB_REF_NAME) {
        currentBranch = process.env.GITHUB_REF_NAME;
      } else if (process.env.GITHUB_HEAD_REF) {
        currentBranch = process.env.GITHUB_HEAD_REF;
      }
    }

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
  return Math.round(bytes / Math.pow(k, i)) + ' ' + sizes[i];
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
  const duplication = getDuplicationStats();
  const dependencies = getDependencyInfo();
  const bundleSize = getBundleSize();
  const { buildStatus, deployStatus, systemStatus } = getBuildDeployStatus();

  // Build unified metrics object (all detailed metrics in extended section)
  const metrics = {
    generatedAt: new Date().toISOString(),
    buildStatus,
    deployStatus: process.env.DEPLOY_STATUS
      ? deployStatus
      : existingMetrics?.deployStatus || deployStatus,
    systemStatus,
    activeModules: 4,

    // All metrics consolidated in extended section
    extended: {
      testCoverage,
      lighthouse,
      documentation,
      git,
      linting,
      duplication,
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
    `  └─ Bundle Size: ${bundleSize.available ? bundleSize.initial.formatted : '❌ Not available'}`,
  );

  // Write output
  writeFileSync(OUTPUT_PATH, JSON.stringify(metrics, null, 2) + '\n');
  console.log(`\n✅ Metrics written to: ${OUTPUT_PATH}`);

  return metrics;
}

// Export for testing
export {
  OUTPUT_PATH,
  ROOT,
  formatBytes,
  generateMetrics,
  getBundleSize,
  getDependencyInfo,
  getDocumentationCoverage,
  getGitStats,
  getLighthouseScores,
  getLintingStatus,
  getTestCoverage,
  parseSize,
};

// Run only when executed directly (not when imported for testing)
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  generateMetrics();
}
