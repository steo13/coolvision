module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.eslint.json',
    tsconfigRootDir: __dirname
  },
  env: {
    node: true,
    es2021: true
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'simple-import-sort'],
  extends: [
    'airbnb',
    'airbnb-typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript'
  ],
  root: true,
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '_' }],
    '@typescript-eslint/no-var-requires': 'off',
    'no-return-await': 'warn',
    'require-await': 'warn',
    'no-useless-return': 'warn',
    eqeqeq: 'warn',
    'import/order': 'off',
    'import/no-cycle': 'warn',
    'import/prefer-default-export': 'off',
    'import/no-named-as-default': 'off',
    'no-restricted-syntax': 'off',
    'no-await-in-loop': 'off',
    'no-console': 'warn',
    'prettier/prettier': 'warn',
    'sort-imports': 'off',
    'simple-import-sort/imports': 'warn',
    'simple-import-sort/exports': 'warn',
    'class-methods-use-this': 'off'
  },
  settings: {
    'import/extensions': ['.js', '.ts']
  }
};