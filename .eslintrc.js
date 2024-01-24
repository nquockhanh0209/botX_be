module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint/eslint-plugin'],
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
    ],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    ignorePatterns: ['.eslintrc.js'],
    rules: {
        '@typescript-eslint/array-type': 'error',
        '@typescript-eslint/explicit-member-accessibility': [
            'error', { 'accessibility': 'no-public' }
        ],
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/quotes': ['error', 'double', { "avoidEscape": true }],
        'arrow-parens': ['error', 'as-needed'],
        'max-classes-per-file': 'off',
        'no-console': 'off',
        'no-duplicate-imports': 'error',
        'no-empty': 'off',
        'no-shadow': 'off',
        'comma-dangle': 'off',
        'sort-keys': 'off',
        "no-inferrable-types": [true, "ignore-params", "ignore-properties"],
        '@typescript-eslint/no-unused-vars': ['error', { 'args': 'none' }],
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/require-await': 'off'
    },
};
