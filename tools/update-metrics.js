const fs = require('fs');
const path = require('path');

const METRICS_PATH = path.join(__dirname, '../src/assets/data/metrics.json');
const COVERAGE_PATH = path.join(
  __dirname,
  '../coverage/angular-enterprise-blueprint/coverage-final.json',
);

function updateMetrics() {
  console.log('Updating dashboard metrics...');

  let metrics;
  try {
    metrics = JSON.parse(fs.readFileSync(METRICS_PATH, 'utf8'));
  } catch (err) {
    console.error('Failed to read metrics file:', err.message);
    process.exit(1);
  }

  let coveragePct = null;

  // 1. Update Test Coverage from Istanbul Report (coverage-final.json)
  if (fs.existsSync(COVERAGE_PATH)) {
    try {
      const report = JSON.parse(fs.readFileSync(COVERAGE_PATH, 'utf8'));
      let totalStatements = 0;
      let coveredStatements = 0;

      Object.values(report).forEach((file) => {
        // Istanbul format: file.s is a map of statementId -> count
        const statements = file.s || {};
        Object.values(statements).forEach((count) => {
          totalStatements++;
          if (count > 0) coveredStatements++;
        });
      });

      if (totalStatements > 0) {
        coveragePct = Math.round((coveredStatements / totalStatements) * 100);
        console.log(`Calculated Coverage: ${coveragePct}%`);

        metrics.testCoverage.value = coveragePct;
        metrics.testCoverage.trend = coveragePct >= 80 ? 'up' : 'down';
        metrics.testCoverage.lastUpdated = new Date().toISOString();
      }
    } catch (e) {
      console.error('Failed to parse coverage report:', e.message);
    }
  } else {
    console.warn('Coverage report not found at:', COVERAGE_PATH);
  }

  // 2. Update Lighthouse Metrics from .lighthouseci (latest run)
  const LH_DIR = path.join(__dirname, '../.lighthouseci');
  if (fs.existsSync(LH_DIR)) {
    try {
      const files = fs
        .readdirSync(LH_DIR)
        .filter((f) => f.startsWith('lhr-') && f.endsWith('.json'));
      if (files.length > 0) {
        // Sort to get the latest file (filenames contain timestamps)
        const latestFile = files.sort().pop();
        const lhPath = path.join(LH_DIR, latestFile);
        const lhr = JSON.parse(fs.readFileSync(lhPath, 'utf8'));
        const { categories } = lhr;

        if (categories) {
          metrics.lighthouse.performance = Math.round(categories.performance.score * 100);
          metrics.lighthouse.accessibility = Math.round(categories.accessibility.score * 100);
          // Key is 'best-practices' in JSON
          metrics.lighthouse.bestPractices = Math.round(categories['best-practices'].score * 100);
          metrics.lighthouse.seo = Math.round(categories.seo.score * 100);

          console.log(`Lighthouse Metrics Updated from ${latestFile}:`);
          console.log(`  Perf: ${metrics.lighthouse.performance}`);
          console.log(`  A11y: ${metrics.lighthouse.accessibility}`);
          console.log(`  Best: ${metrics.lighthouse.bestPractices}`);
          console.log(`  SEO:  ${metrics.lighthouse.seo}`);

          metrics.lastUpdated = new Date().toISOString();
        }
      } else {
        console.warn('No Lighthouse JSON reports found in .lighthouseci/');
      }
    } catch (e) {
      console.error('Failed to parse Lighthouse report:', e.message);
    }
  } else if (process.argv.includes('--simulate')) {
    // Fallback Mock Update for demo if no real data
    console.log('Simulating Lighthouse updates...');
    metrics.lighthouse.performance = 90 + Math.floor(Math.random() * 10);
    metrics.lighthouse.accessibility = 95 + Math.floor(Math.random() * 5);
    metrics.lastUpdated = new Date().toISOString();
  }

  // Write back
  fs.writeFileSync(METRICS_PATH, JSON.stringify(metrics, null, 2));
  console.log('Metrics updated successfully.');
}

updateMetrics();
