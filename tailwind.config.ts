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
        // Light Mode Tokens
        'bg-primary': '#ffffff',
        'bg-secondary': '#f9f9f9',
        'border-default': '#e8e8e8',
        'text-primary': '#111111',
        'text-secondary': '#555555',
        'text-muted': '#999999',
        'tag-bg': '#f2f2f2',
        'tag-text': '#333333',
        'card-bg': '#ffffff',
        'card-border': '#e8e8e8',

        // Dark Mode Tokens
        'dark-bg-primary': '#000000',
        'dark-bg-secondary': '#0a0a0a',
        'dark-border': '#222222',
        'dark-text-primary': '#ffffff',
        'dark-text-secondary': '#aaaaaa',
        'dark-text-muted': '#666666',
        'dark-tag-bg': '#1a1a1a',
        'dark-tag-text': '#cccccc',
        'dark-card-bg': '#111111',
        'dark-card-border': '#222222',

        // Accent Tokens
        'accent': '#4f46e5',
        'accent-badge': '#4f46e5',
        'accent-badge-text': '#ffffff',
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;

