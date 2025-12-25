import type { PluginOption } from 'vite';
import * as tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

type PluginFactory = (...args: unknown[]) => PluginOption;

function resolveTsconfigPathsPlugin(): PluginFactory {
  const mod = tsconfigPaths as unknown;

  // If the module has a default export that's a function, use it.
  if (typeof (mod as { default?: unknown }).default === 'function') {
    return (mod as { default: PluginFactory }).default;
  }

  // If the module itself is a function, use it.
  if (typeof mod === 'function') {
    return mod as PluginFactory;
  }

  throw new Error('vite-tsconfig-paths did not export a plugin factory function');
}

const tsconfigPathsPlugin = resolveTsconfigPathsPlugin();

export default defineConfig({
  plugins: [tsconfigPathsPlugin()],
  test: {
    globals: true,
    environment: 'jsdom',
    reporters: ['verbose', ['junit', { outputFile: 'test-results/junit.xml' }]],
    include: ['src/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/app/**/*.ts'],
      exclude: [
        'src/app/**/*.spec.ts',
        'src/app/**/*.stories.ts',
        'src/main.ts',
        'src/app/app.config.ts',
      ],
      thresholds: {
        statements: 85,
        branches: 85,
        functions: 85,
        lines: 85,
      },
    },
  },
});
