// tailwind config is required for editor support

import sharedConfig, {
  DEFAULT_CONTENT,
} from "@repo/tailwind-config/tailwind.config";
import type { Config } from "tailwindcss";

const config: Pick<Config, "presets" | "content"> = {
  content: DEFAULT_CONTENT,
  presets: [sharedConfig],
};

export default config;
