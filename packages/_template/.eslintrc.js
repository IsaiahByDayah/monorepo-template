/** @type {import("eslint").Linter.Config} */
const config = {
  root: true,
  extends: ["@repo/eslint-config/library.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
}

export default config
