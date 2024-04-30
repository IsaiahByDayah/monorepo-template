import type { Config } from "tailwindcss"

export const DEFAULT_CONTENT: Config["content"] = [
  "./src/**/*.{js,ts,jsx,tsx,mdx}",
]

const config: Omit<Config, "content"> = {
  theme: {
    extend: {
      backgroundImage: {
        "glow-conic":
          "conic-gradient(from 180deg at 50% 50%, #2a8af6 0deg, #a853ba 180deg, #e92a67 360deg)",
      },
    },
  },
  plugins: [],
}

export default config
