import vercelPrettier from "@vercel/style-guide/prettier"

/** @type {import("prettier").Config} */
const config = {
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
}

export default config
