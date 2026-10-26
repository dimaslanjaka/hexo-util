import hexoTs from 'eslint-config-hexo/ts';
import hexoTsTest from 'eslint-config-hexo/ts-test';
import importPlugin from 'eslint-plugin-import';
import chaiFriendly from 'eslint-plugin-chai-friendly';

export default [
  // Configurations applied globally
  ...hexoTs,

  // Ignore specific files
  {
    ignores: [
      // Exclude auto-generated file from all linting
      'lib/highlight_alias.ts',
      // Exclude dist directory from all linting
      'dist',
      // Exclude tmp directory from all linting
      'tmp',
      // Exclude eslint config file itself
      'eslint.config.mjs'
    ]
  },

  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module'
    }
  },

  // Import plugin for ESM import resolution and rules
  {
    plugins: {
      import: importPlugin,
      'chai-friendly': chaiFriendly
    },
    rules: {
      ...importPlugin.configs.recommended.rules,
      'n/no-missing-import': 'off',
      'node/no-extraneous-import': 'off',
      'import/no-named-as-default': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'import/extensions': [
        'error',
        'never',
        {
          js: 'always',
          ts: 'auto',
          cts: 'auto',
          mts: 'auto',
          json: 'always',
          mjs: 'always',
          cjs: 'always'
        }
      ],
      '@typescript-eslint/no-unused-expressions': 'off',
      'chai-friendly/no-unused-expressions': 'error'
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json'
        },
        node: {
          extensions: ['.js', '.mjs', '.cjs', '.ts', '.mts', '.cts']
        }
      },
      'import/extensions': ['.js', '.mjs', '.cjs', '.ts', '.mts', '.cts'],
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx', '.mts', '.cts']
      }
    }
  },

  // Specific rules for direct build-output tests
  {
    files: [
      'test/direct/**/*.cjs',
      'test/direct/**/*.mjs',
      'test/**/*.direct.*',
      'test/*.direct.*'
    ],
    rules: {
      // Build output may not exist until the build has completed
      'n/no-missing-require': 'off',
      'import/no-unresolved': 'off',

      // These tests may intentionally inspect the result without asserting it
      '@typescript-eslint/no-unused-vars': 'off',

      // These tests not chai-friendly, so we need to disable the rule for them
      'chai-friendly/no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-expressions': 'off'
    }
  },

  // Configurations applied only to test files
  {
    files: ['test/**/*.ts'],
    languageOptions: {
      ...hexoTsTest.languageOptions,
      globals: {
        // Allow global variables used in tests
        describe: 'readonly',
        it: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        expect: 'readonly'
      }
    },
    rules: {
      ...hexoTsTest.rules,
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      'chai-friendly/no-unused-expressions': 'error',
      'node/no-unsupported-features/es-syntax': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      'node/no-missing-require': 'off',
      'node/no-missing-import': 'off',
      'import/namespace': ['error', { allowComputed: true }]
    }
  },

  // Specific rules for JavaScript and CommonJS files
  {
    files: ['**/*.cjs'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off', // Allow require() in CommonJS files
      '@typescript-eslint/no-require-imports': 'off' // Allow require imports
    }
  },

  // Disable Chai expression checks for direct tests
  {
    files: ['test/**/*.direct.*'],
    rules: {
      'chai-friendly/no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-expressions': 'off'
    }
  }
];