import { defineConfig, type Options } from "tsup"

export default defineConfig((options: Options) => ({
  treeshake: true,
  splitting: true,
  entry: ["src/**/*.tsx"],
  format: ["esm"],
  dts: true,
  minify: true,
  clean: false,
  external: ["react"],
  ...options,
}))
