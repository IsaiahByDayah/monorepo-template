// tailwind config is required for editor support

import sharedConfig from "@repo/tailwind-config"
import type { Config } from "tailwindcss"

const config: Pick<Config, "prefix" | "content" | "presets"> = {
  content: ["./src/**/*.tsx"],
  prefix: "ui-",
  presets: [sharedConfig],
}

export default config
