// tailwind config is required for editor support

import sharedConfig, {
  DEFAULT_CONTENT,
} from "@repo/tailwind-config/tailwind.config"
import type { Config } from "tailwindcss"

const config: Pick<Config, "prefix" | "presets" | "content"> = {
  content: DEFAULT_CONTENT,
  prefix: "ui-", // TODO: revisit later - REF: https://github.com/tailwindlabs/tailwindcss/discussions/12162
  presets: [sharedConfig],
}

export default config
