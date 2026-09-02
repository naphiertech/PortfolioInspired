import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
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
        grid: {
          guide: "var(--grid-guide)",
          "guide-subtle": "var(--grid-guide-subtle)",
          crosshair: "var(--grid-crosshair)",
          dot: "var(--grid-dot)",
          hatch: "var(--grid-hatch)",
        },
        ink: "var(--text-ink)",
        body: "var(--text-body)",
        faint: "var(--text-faint)",
        brand: "var(--text-brand)",
        border: {
          DEFAULT: "var(--border-hairline)",
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
        serif: [
          "var(--font-eb-garamond)",
          "EB Garamond",
          "Georgia",
          "Times New Roman",
          "serif",
        ],
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
