import globals from "globals";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import { globalIgnores } from "eslint/config";

/** @type {import('eslint').Linter.Config[]} */
export default [
  globalIgnores(
    [
      "*/.nuxt/**/*.{js,ts,mjs,cjs,vue}",
    ]
  ),
  {
    languageOptions: { 
      globals: globals.browser,
      parserOptions: {
        parser: tseslint.parser
      }
    },
  },
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  {
    files: ["**/*.vue"],
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-textarea-mustache': 'off',
    },
  },
  {
    files: ["**/*.{js,ts,vue}"],
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
];