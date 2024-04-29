/** @type {import("eslint").Linter.Config} */
module.exports = {
  rules: {
    "react/function-component-definition": [
      2,
      {
        namedComponents: "arrow-function",
      },
    ],
    "react/jsx-sort-props": "off",
  },
}
