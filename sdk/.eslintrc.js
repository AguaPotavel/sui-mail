module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  env: {
    browser: true,
    amd: true,
    node: true,
    es6: true,
    jest: true,
  },
  plugins: ["@typescript-eslint", "mobx"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:prettier/recommended",
    "next",
    "next/core-web-vitals",
    // 'plugin:mobx/recommended',
  ],
  parserOptions: {
    project: ["./tsconfig.json"],
    tsconfigRootDir: __dirname,
  },
  rules: {
    "prettier/prettier": "error",
    "react/react-in-jsx-scope": "off",
    "jsx-a11y/anchor-is-valid": [
      "error",
      {
        components: ["Link"],
        specialLink: ["hrefLeft", "hrefRight"],
        aspects: ["invalidHref", "preferButton"],
      },
    ],
    "react/prop-types": 0,
    "@typescript-eslint/no-unused-vars": 0,
    "react/no-unescaped-entities": 0,
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    // 'react/function-component-definition': [
    //   'warn',
    //   {
    //     namedComponents: ['arrow-function', 'function-declaration'],
    //     unnamedComponents: ['arrow-function', 'function-expression'],
    //   },
    // ],
    "react/no-array-index-key": "warn",
    "react/no-unstable-nested-components": "warn",
    "react/no-unused-prop-types": "warn",
    "react/no-unused-state": "warn",
    // 'mobx/exhaustive-make-observable': 'warn',
    // 'mobx/unconditional-make-observable': 'error',
    // 'mobx/missing-make-observable': 'error',
    // 'mobx/missing-observer': 'warn',
    // 'react/display-name': 'warn',
    "no-case-declarations": "off",
  },
  overrides: [
    // Only uses Testing Library lint rules in test files
    {
      files: [
        "**/__tests__/**/*.[jt]s?(x)",
        "**/?(*.)+(spec|test).[jt]s?(x)",
        "**/*.test.ts",
      ],
      env: {
        jest: true,
      },
      plugins: ["jest"],
      extends: ["plugin:jest/recommended"],
      rules: {
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
      },
      parserOptions: {
        project: ["./tsconfig.ci.json"],
      },
    },
  ],
};
