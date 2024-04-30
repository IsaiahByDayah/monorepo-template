const { resolve } = require("node:path")

const sharedRules = require("./sharedRules")
const sharedReactRules = require("./sharedReactRules")

const project = resolve(process.cwd(), "tsconfig.json")

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "@vercel/style-guide/eslint/node",
    "@vercel/style-guide/eslint/browser",
    "@vercel/style-guide/eslint/typescript",
    "@vercel/style-guide/eslint/react",
    "@vercel/style-guide/eslint/next",
    "eslint-config-turbo",
    "eslint-config-prettier",
  ].map(require.resolve),
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project,
  },
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    node: true,
    browser: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: [
    // Ignore dotfiles
    ".*.js",
    "node_modules/",
    "dist/",
  ],
  // add rules configurations here
  rules: {
    ...sharedRules.rules,
    ...sharedReactRules.rules,
  },
}
