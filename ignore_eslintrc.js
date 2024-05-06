module.exports = {
  root: true,
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  extends: [
    '@react-native-community',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'prettier'],
  rules: {
    'react/prop-types': 'off',
    'react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': ['warn', {extensions: ['.tsx']}],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    indent: ['error', 5],
    'comma-dangle': ['error', 'never'],
    'max-len': [
      'error',
      {
        code: 90,
      },
    ],
  },
};
