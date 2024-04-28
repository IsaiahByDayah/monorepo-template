const vercelPrettier = require("@vercel/style-guide/prettier");

module.exports = {
  ...vercelPrettier,
  semi: false,
  singleQuote: false,
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  importOrder: [
    "",
    "<BUILTIN_MODULES>", // Node.js built-in modules
    "",
    "<THIRD_PARTY_MODULES>", // Imports not matched by other special words or groups.
    "",
    "^[.]", // relative imports
  ],
  tailwindConfig: "./packages/tailwind-config/tailwind.config.ts",
  tailwindFunctions: ["clsx"],
};
