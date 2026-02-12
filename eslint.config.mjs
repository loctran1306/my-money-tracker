import tseslint from 'typescript-eslint';
import nextConfig from 'eslint-config-next/core-web-vitals';

const eslintConfig = [
  ...nextConfig,
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: { '@typescript-eslint': tseslint.plugin },
    languageOptions: { parser: tseslint.parser, parserOptions: { sourceType: 'module' } },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@next/next/no-img-element': 'warn',
      'prefer-const': 'error',
      'no-console': 'warn',
    },
  },
];

export default eslintConfig;
