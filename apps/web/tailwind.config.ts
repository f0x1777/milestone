import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
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
        brand: {
          50: "#e8fff8",
          100: "#c8f7ea",
          200: "#92ead4",
          300: "#5bd8ba",
          400: "#24c39a",
          500: "#0fa37f",
          600: "#0b7f63",
          700: "#0a644f",
          800: "#0b4d3f",
          900: "#093e33"
        },
        sand: {
          50: "#faf6ef",
          100: "#f1e6d2",
          200: "#e5cfab",
          300: "#d7b57e",
          400: "#c18b4f",
          500: "#aa6d2f",
          600: "#8a5525",
          700: "#6b4321",
          800: "#53341c",
          900: "#3a2615"
        }
      },
      boxShadow: {
        halo: "0 0 0 1px rgba(255,255,255,0.08), 0 24px 80px rgba(6, 36, 32, 0.24)"
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;

