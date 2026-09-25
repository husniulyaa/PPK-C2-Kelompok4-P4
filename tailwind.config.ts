import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        border: "var(--border)",
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        // Centralized luxury fintech color tokens
        fintech: {
          darkBrown: "#452829",
          darkBrownHover: "#5c3638",
          darkBrownDarker: "#2b191a",
          darkBrownCard: "#3b2324",
          gray: "#57595B",
          grayMuted: "#747679",
          grayDarker: "#3d3e40",
          beige: "#E8D1C5",
          beigeHover: "#dfc1b3",
          beigeLight: "#f4e6de",
          cream: "#F3E8DF",
          creamLight: "#fbf6f2",
        },
      },
      boxShadow: {
        fintech: "0 4px 20px -2px rgba(69, 40, 41, 0.06), 0 2px 6px -1px rgba(69, 40, 41, 0.04)",
        fintechHover: "0 10px 25px -3px rgba(69, 40, 41, 0.1), 0 4px 10px -2px rgba(69, 40, 41, 0.06)",
        fintechDark: "0 6px 24px -2px rgba(0, 0, 0, 0.35)",
      },
    },
  },
  plugins: [],
};
export default config;
