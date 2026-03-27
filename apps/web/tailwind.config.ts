import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist)", "system-ui", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "monospace"],
        instrument: ['"Instrument Serif"', "serif"],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        border: "hsl(var(--border))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
        milestone: {
          50: "#eef9fd",
          100: "#d4f1fa",
          200: "#a9e3f5",
          300: "#6ecfed",
          400: "#33B5E5",
          500: "#1a9fd4",
          600: "#1280b0",
          700: "#12678e",
          800: "#145574",
          900: "#154762",
        },
        charcoal: {
          50: "#f6f6f6",
          100: "#e7e7e7",
          200: "#d1d1d1",
          300: "#b0b0b0",
          400: "#888888",
          500: "#6d6d6d",
          600: "#5d5d5d",
          700: "#4f4f4f",
          800: "#3C3C3C",
          900: "#2a2a2a",
          950: "#1a1a1a",
        },
      },
      boxShadow: {
        soft: "0px 1px 2px rgba(0,0,0,0.04), 0px 4px 16px rgba(0,0,0,0.04)",
        card: "0px 2px 4px rgba(0,0,0,0.02), 0px 8px 32px rgba(0,0,0,0.06)",
        elevated:
          "0px 4px 8px rgba(0,0,0,0.04), 0px 16px 48px rgba(0,0,0,0.08)",
        input: "0px 10px 40px 5px rgba(194,194,194,0.25)",
        "cta-inset":
          "inset -4px -6px 25px 0px rgba(201,201,201,0.08), inset 4px 4px 10px 0px rgba(29,29,29,0.24)",
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
