// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';

import angular from 'angular-eslint';
import boundaries from 'eslint-plugin-boundaries';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

import headingOrder from './tools/eslint-rules/heading-order.mjs';

export default defineConfig(
  {
    ignores: ['node_modules/**', 'dist/**', '.angular/**'],
  },
  // Base TypeScript config for all .ts files
  {
    files: ['**/*.ts'],
    extends: [...tseslint.configs.strictTypeChecked, ...angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.config.ts', '*.config.mjs'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Allow empty classes with decorators (Angular components, directives, etc.)
      '@typescript-eslint/no-extraneous-class': ['error', { allowWithDecorator: true }],
      // Console usage
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      // Strict type rules
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: true,
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/strict-boolean-expressions': [
        'error',
        {
          allowString: false,
          allowNumber: false,
          allowNullableObject: true,
        },
      ],
      // Enforce Angular component/directive selector conventions
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: ['eb'],
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: ['eb'],
          style: 'camelCase',
        },
      ],
    },
  },
  // Boundaries rules only for src/ files
  {
    files: ['src/**/*.ts'],
    plugins: {
      boundaries,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
      'boundaries/elements': [
        { type: 'entry', pattern: ['src/*'], mode: 'file' },
        { type: 'environments', pattern: ['src/environments/*'], mode: 'file' },
        { type: 'core', pattern: ['src/app/core/*'], capture: ['layer'] },
        {
          type: 'features',
          pattern: ['src/app/features/*'],
          capture: ['feature'],
        },
        { type: 'shared', pattern: ['src/app/shared/*'], capture: ['module'] },
        { type: 'app', pattern: ['src/app/*'], mode: 'file' },
      ],
      'boundaries/ignore': ['**/*.spec.ts', '**/*.test.ts'],
    },
    rules: {
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            {
              // Entry points (main.ts) can import from app
              from: 'entry',
              allow: ['app'],
            },
            {
              // App root can import from core, features, shared, and other app files
              from: 'app',
              allow: ['app', 'core', 'features', 'shared'],
            },
            {
              // Environments can only import from within environments (e.g., type imports)
              from: 'environments',
              allow: ['environments'],
            },
            {
              // Core can import from shared, environments, and other core modules
              from: 'core',
              allow: ['core', 'shared', 'environments'],
            },
            {
              // Features can import from core and shared, and SAME feature only
              from: 'features',
              allow: [
                'core',
                'shared',
                // Allow imports within the same feature
                ['features', { feature: '${from.feature}' }],
              ],
            },
            {
              // Shared can import from shared and core services (for components like ThemePicker)
              from: 'shared',
              allow: ['shared', 'core'],
            },
          ],
        },
      ],
      'boundaries/no-unknown-files': ['error'],
    },
  },
  // HTML templates
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    plugins: {
      'custom-a11y': {
        rules: {
          'heading-order': headingOrder,
        },
      },
    },
    rules: {
      'custom-a11y/heading-order': 'error',
    },
  },
  // Storybook
  ...storybook.configs['flat/recommended'],
);
