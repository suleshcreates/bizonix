import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "bz-navy": "var(--bz-navy)",
        "bz-navy-deep": "var(--bz-navy-deep)",
        "bz-blue": "var(--bz-blue)",
        "bz-blue-hover": "var(--bz-blue-hover)",
        "bz-teal": "var(--bz-teal)",
        "bz-teal-soft": "var(--bz-teal-soft)",
        "bz-blue-soft": "var(--bz-blue-soft)",
        "bz-surface": "var(--bz-surface)",
        "bz-surface-alt": "var(--bz-surface-alt)",
        "bz-border": "var(--bz-border)",
        "bz-muted": "var(--bz-muted)",
        "bz-success": "var(--bz-success)",
        "bz-danger": "var(--bz-danger)",
      },
      boxShadow: {
        soft: "0 24px 80px rgba(11, 31, 58, 0.10)",
        nav: "0 10px 35px rgba(11, 31, 58, 0.07)",
      },
    },
  },
  plugins: [],
};

export default config;
