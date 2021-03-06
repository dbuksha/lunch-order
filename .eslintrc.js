module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/react',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  plugins: ['react', '@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: 'tsconfig.json',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  rules: {
    '@typescript-eslint/no-shadow': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'linebreak-style': 'off',
    'arrow-body-style': 'off',
    'import/no-cycle': 'off',
    'import/prefer-default-export': 'off',
    'react/prop-types': 'off',
    'no-param-reassign': 'off',
    'react/require-default-props': 'off',
    'react/destructuring-assignment': 'off',
    'react/button-has-type': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-props-no-spreading': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    'react-hooks/exhaustive-deps': 'warn', // added "react-hooks/exhaustive-deps"
  },
};
