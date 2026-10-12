import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./features/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#f4f0e8",
        ink: "#1b1915",
        amber: { DEFAULT: "#c45c12", deep: "#8a3d09" },
        arc: "#0f6e78",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        glass: "0 24px 60px rgba(48, 32, 12, 0.08), inset 0 1px 0 rgba(255,255,255,0.8)",
      },
    },
  },
  plugins: [],
};

export default config;
