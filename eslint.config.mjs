// eslint.config.mjs
import nextPlugin from '@next/eslint-plugin-next'; // Use the plugin directly instead of eslint-config-next
import tseslint from 'typescript-eslint';

export default [
  // Base Next.js rules
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs['core-web-vitals'].rules, // Apply Next.js core-web-vitals rules
    },
  },
  // TypeScript rules
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off', // Your custom rule
    },
  },
];