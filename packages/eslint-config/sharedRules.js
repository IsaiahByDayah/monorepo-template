/** @type {import("eslint").Linter.Config} */
module.exports = {
  rules: {
    "no-console": ["error", { allow: ["warn", "error", "info"] }],
    "import/no-default-export": "off",
    "import/order": [
      "error",
      {
        "newlines-between": "always",
        groups: ["builtin", "external", ["parent", "sibling"], "index"],
      },
    ],
    "unicorn/filename-case": "off",
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/no-misused-promises": [
      2,
      {
        checksVoidReturn: {
          attributes: false,
        },
      },
    ],
    "@typescript-eslint/unbound-method": "off",
    "react/function-component-definition": [
      2,
      {
        namedComponents: "arrow-function",
      },
    ],
    "react/jsx-sort-props": "off",
  },
}
