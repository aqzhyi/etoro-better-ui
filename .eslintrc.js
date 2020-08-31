// Consider running ESLint debug
// npx eslint --debug /Users/pleasurazy/git/life/packages/bot/.eslintrc.js
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  env: {
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: 'tsconfig.json',
  },
  rules: {
    '@typescript-eslint/require-await': 'off',
    // 適當的 unused-vars 幫助我們快速理解有哪些可用的參數
    '@typescript-eslint/no-unused-vars': 'off',
    // 分號由 prettier 解決
    '@typescript-eslint/member-delimiter-style': 'off',
    // 誤用 return promise 之規則
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: false,
      },
    ],
    '@typescript-eslint/unbound-method': 'warn',
    // TypeScript Assertion Function 可以不需要 stataments
    '@typescript-eslint/no-empty-function': 'warn',
    // see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-floating-promises.md
    '@typescript-eslint/no-floating-promises': 'off',
    // 這個交由 prettier
    '@typescript-eslint/no-extra-semi': 'off',
    // 我不想每個都寫明 return type 想讓它自行 infer
    '@typescript-eslint/explicit-module-boundary-types': [
      'off',
      { allowDirectConstAssertionInArrowFunctions: true },
    ],
    // 以下開啟可提升可靠性，但暫時沒有也沒關係。盡可能開啟。
    // 由於介入他人介面，因此太多 any type，使它 warn 讓開發速度能夠快點
    // @types/styled-components 有性能問題，解決之前必須 off 提升開發端性能
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/34391
    '@typescript-eslint/no-unsafe-member-access': ['off'],
    // 部份需要 as any，但還沒時間改好
    // @types/styled-components 有性能問題，解決之前必須 off 提升開發端性能
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/34391
    '@typescript-eslint/no-unsafe-assignment': ['off'],
    // @types/styled-components 有性能問題，解決之前必須 off 提升開發端性能
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/34391
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
  },
  overrides: [
    {
      files: ['**/tampermonkey.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
      },
    },
    {
      files: ['**/tampermonkey.js'],
      env: {
        browser: true,
      },
    },
  ],
}
