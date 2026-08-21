import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        page: "var(--bg-page)",
        surface: {
          DEFAULT: "var(--bg-surface)",
          hover: "var(--bg-surface-hover)",
        },
        dock: "var(--bg-dock)",
        muted: {
          DEFAULT: "var(--bg-muted)",
          subtle: "var(--bg-muted-subtle)",
          foreground: "var(--text-muted)",
        },
        ink: "var(--text-ink)",
        body: "var(--text-body)",
        faint: "var(--text-faint)",
        brand: "var(--text-brand)",
        border: {
          hairline: "var(--border-hairline)",
          dashed: "var(--border-dashed)",
          reticle: "var(--border-reticle)",
          divider: "var(--border-divider)",
        },
        star: "var(--metric-star)",
      },
      fontFamily: {
        display: ["Doto", "Geist Mono", "ui-monospace", "monospace"],
        sans: ["Figtree", "Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "Menlo", "monospace"],
        caps: ["Carrois Gothic SC", "JetBrains Mono", "monospace"],
      },
      maxWidth: {
        reading: "760px",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
      },
    },
  },
  plugins: [],
};
export default config;
