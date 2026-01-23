/**
 * Tests for generate-metrics.js
 *
 * These tests verify the metrics generation functions work correctly,
 * especially fallback/caching logic that has caused bugs in the past.
 */

import { existsSync, readFileSync, readdirSync } from 'fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock fs and child_process before importing the module
vi.mock('fs', () => {
  const existsSync = vi.fn();
  const readFileSync = vi.fn();
  const readdirSync = vi.fn();
  const statSync = vi.fn();
  const writeFileSync = vi.fn();

  return {
    default: {
      existsSync,
      readFileSync,
      readdirSync,
      statSync,
      writeFileSync,
    },
    existsSync,
    readFileSync,
    readdirSync,
    statSync,
    writeFileSync,
  };
});

vi.mock('url', () => {
  const fileURLToPath = () => '/mock/project/root/scripts';
  return {
    default: { fileURLToPath },
    fileURLToPath,
  };
});

vi.mock('child_process', () => {
  const execSync = vi.fn();
  return {
    default: { execSync },
    execSync,
  };
});

// Import functions after mocks are set up
import {
  formatBytes,
  getDocumentationCoverage,
  getLighthouseScores,
  parseSize,
} from './generate-metrics.js';

describe('generate-metrics.js', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('formatBytes', () => {
    it('should format 0 bytes correctly', () => {
      expect(formatBytes(0)).toBe('0 B');
    });

    it('should format bytes to KB', () => {
      expect(formatBytes(1024)).toBe('1 KB');
      expect(formatBytes(2048)).toBe('2 KB');
    });

    it('should format bytes to MB', () => {
      expect(formatBytes(1024 * 1024)).toBe('1 MB');
    });

    it('should round to nearest whole number', () => {
      expect(formatBytes(1500)).toBe('1 KB'); // 1.46 KB rounds to 1
      expect(formatBytes(1800)).toBe('2 KB'); // 1.76 KB rounds to 2
    });
  });

  describe('parseSize', () => {
    it('should parse KB values', () => {
      expect(parseSize('100KB')).toBe(100 * 1024);
      expect(parseSize('100kB')).toBe(100 * 1024);
      expect(parseSize('100kb')).toBe(100 * 1024);
    });

    it('should parse MB values', () => {
      expect(parseSize('1MB')).toBe(1024 * 1024);
      expect(parseSize('1mb')).toBe(1024 * 1024);
    });

    it('should parse GB values', () => {
      expect(parseSize('1GB')).toBe(1024 * 1024 * 1024);
    });

    it('should parse plain byte values', () => {
      expect(parseSize('1000B')).toBe(1000);
    });

    it('should return 0 for invalid input', () => {
      expect(parseSize('')).toBe(0);
      expect(parseSize('invalid')).toBe(0);
    });
  });

  describe('getLighthouseScores', () => {
    it('should return unavailable when no .lighthouseci directory exists and no cache', () => {
      vi.mocked(existsSync).mockReturnValue(false);

      const result = getLighthouseScores(null);

      expect(result.available).toBe(false);
      expect(result.message).toContain('No Lighthouse report found');
    });

    it('should read from .lighthouseci directory when available', () => {
      vi.mocked(existsSync).mockReturnValue(true);
      vi.mocked(readdirSync).mockReturnValue(['lhr-123.json']);
      vi.mocked(readFileSync).mockReturnValue(
        JSON.stringify({
          categories: {
            performance: { score: 0.9 },
            accessibility: { score: 1.0 },
            'best-practices': { score: 1.0 },
            seo: { score: 1.0 },
          },
        }),
      );

      const result = getLighthouseScores(null);

      expect(result.available).toBe(true);
      expect(result.performance).toBe(90);
      expect(result.accessibility).toBe(100);
      expect(result.bestPractices).toBe(100);
      expect(result.seo).toBe(100);
    });

    it('should fallback to existing.extended.lighthouse when no report exists', () => {
      vi.mocked(existsSync).mockReturnValue(false);

      const existingMetrics = {
        extended: {
          lighthouse: {
            available: true,
            performance: 85,
            accessibility: 95,
            bestPractices: 90,
            seo: 100,
          },
        },
      };

      const result = getLighthouseScores(existingMetrics);

      expect(result.available).toBe(true);
      expect(result.performance).toBe(85);
      expect(result.accessibility).toBe(95);
      expect(result.bestPractices).toBe(90);
      expect(result.seo).toBe(100);
      expect(result.message).toContain('Cached from previous run');
    });

    it('should fallback to existing.lighthouse for backward compatibility', () => {
      vi.mocked(existsSync).mockReturnValue(false);

      // Old format without extended
      const existingMetrics = {
        lighthouse: {
          performance: 80,
          accessibility: 90,
          bestPractices: 85,
          seo: 95,
        },
      };

      const result = getLighthouseScores(existingMetrics);

      expect(result.available).toBe(true);
      expect(result.performance).toBe(80);
      expect(result.accessibility).toBe(90);
    });

    it('should return unavailable when cached performance is 0', () => {
      vi.mocked(existsSync).mockReturnValue(false);

      const existingMetrics = {
        extended: {
          lighthouse: {
            available: true,
            performance: 0,
            accessibility: 100,
            bestPractices: 100,
            seo: 100,
          },
        },
      };

      const result = getLighthouseScores(existingMetrics);

      expect(result.available).toBe(false);
    });
  });

  describe('getDocumentationCoverage', () => {
    it('should return unavailable when documentation.json does not exist', () => {
      vi.mocked(existsSync).mockReturnValue(false);

      const result = getDocumentationCoverage();

      expect(result.available).toBe(false);
      expect(result.message).toContain('Run npm run docs:json first');
    });

    it('should parse documentation.json correctly', () => {
      vi.mocked(existsSync).mockReturnValue(true);
      vi.mocked(readFileSync).mockReturnValue(
        JSON.stringify({
          components: [
            { description: 'Component A docs' },
            { description: 'Component B docs' },
            { description: '' }, // Not documented
          ],
          injectables: [{ description: 'Service docs' }],
          directives: [],
          pipes: [],
        }),
      );

      const result = getDocumentationCoverage();

      expect(result.available).toBe(true);
      expect(result.percentage).toBe(75); // 3/4 documented
      expect(result.components).toEqual({ documented: 2, total: 3 });
      expect(result.services).toEqual({ documented: 1, total: 1 });
    });

    it('should handle empty arrays gracefully', () => {
      vi.mocked(existsSync).mockReturnValue(true);
      vi.mocked(readFileSync).mockReturnValue(
        JSON.stringify({
          components: [],
          injectables: [],
          directives: [],
          pipes: [],
        }),
      );

      const result = getDocumentationCoverage();

      expect(result.available).toBe(true);
      expect(result.percentage).toBe(0);
    });
  });
});
