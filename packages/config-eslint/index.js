/** @type {import("eslint").Linter.Config} */

module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'import'],

    extends: [
        'plugin:@typescript-eslint/strict-type-checked',
        'plugin:@typescript-eslint/stylistic-type-checked',
        'prettier',
        'plugin:prettier/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:testing-library/react',
        'plugin:jest-dom/recommended',
    ],

    rules: {
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        'prefer-template': 'error',
        'no-nested-ternary': 'error',
        'no-unneeded-ternary': 'warn',
        'spaced-comment': 'error',

        '@typescript-eslint/ban-ts-comment': ['error', { 'ts-expect-error': 'allow-with-description' }],
        '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
        '@typescript-eslint/ban-types': 'error',
        '@typescript-eslint/prefer-nullish-coalescing': 'warn',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-non-null-assertion': 'warn',
        '@typescript-eslint/no-unnecessary-condition': 'warn',
        '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreArrowShorthand: true }],
        '@typescript-eslint/no-unused-vars': 'warn',

        'import/no-default-export': 'warn',
        'import/order': [
            'error',
            {
                groups: ['builtin', 'external', 'internal', 'parent', 'sibling'],
                'newlines-between': 'always',
                alphabetize: {
                    order: 'asc',
                    caseInsensitive: true,
                },
            },
        ],
    },

    // ESlint default behavior ignores file/folders starting with "." - https://github.com/eslint/eslint/issues/10341
    ignorePatterns: [
        '!.*',
        'node_modules',
        '.next',
        '.turbo',
        'dist',
        'compiled',
        'build-next-static',
        // Files bellow are not git ignored. Eslint fix in the making https://github.com/eslint/eslint/issues/15010
        'VersionInfo.ts',
        'next-env.d.ts',
        'next.config.js',
        '.eslintrc.js',
        '.contentlayer',
    ],

    settings: {
        typescript: {},
        'import/resolver': {
            typescript: {
                project: ['./tsconfig.json', 'apps/*/tsconfig.json', 'packages/*/tsconfig.json'],
            },
        },
        react: {
            version: 'detect',
        },
    },
}
