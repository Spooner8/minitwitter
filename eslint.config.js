import globals from "globals";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,vue}"]
  },
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-textarea-mustache': 'off',
      'no-unused-expressions': 'off',
      'no-unused-vars': 'off',
      'no-explicit-any': 'off',
    },
  },
  {
    languageOptions: { globals: globals.browser }
  },
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  {
    files: ["**/*.vue"], languageOptions: {parserOptions: {parser: tseslint.parser}}
  },
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-textarea-mustache': 'off',
      'no-unused-expressions': 'off',
      'no-unused-vars': 'off',
      'no-explicit-any': 'off',
    },
  },
];