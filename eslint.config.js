import js from '@eslint/js'
import pluginVitest from '@vitest/eslint-plugin'
import { defineConfig, globalIgnores } from 'eslint/config'
import skipFormatting from 'eslint-config-prettier/flat'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'

// Import order: external, internal, components, styles.
// An import joins the group with the longest matching pattern, so "@/App.vue" lands in components.
const IMPORT_GROUPS = [
  // Side-effect imports that are not styles (rare; their order can matter).
  ['^\\u0000(?!.*\\.css$)'],
  // External packages and Node built-ins.
  ['^node:', '^@?\\w'],
  // Internal modules: the @/ alias and relative paths.
  ['^@/', '^\\.'],
  // Vue components.
  ['\\.vue$'],
  // Styles.
  ['^\\u0000.*\\.css$'],
]

export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,js,mjs,jsx}'],
  },

  // design/ holds local-only Figma tooling and is not part of the app.
  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**', 'design/**']),

  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*'],
  },

  {
    name: 'app/import-order',
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      'simple-import-sort/imports': ['error', { groups: IMPORT_GROUPS }],
      'simple-import-sort/exports': 'error',
    },
  },

  skipFormatting,
])
