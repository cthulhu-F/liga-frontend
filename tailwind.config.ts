import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary))",
        },
        // paleta moderna
        modern: {
          black: "#00000",
          primary: "#134647",
          secondary: "#134647",
          tertiary: "#134647",
          accent: "#f2f2f2",
          accent2: "#06B6D4",
          success: "#10B981",
          warning: "#F59E0B",
          danger: "#EF4444",
          text: "#FFFFFF",
          textSecondary: "#CBD5E1",
          textMuted: "#94A3B8",
          border: "#475569",
          borderLight: "#64748B",
        },
      },
      backgroundImage: {
        "gradient-modern": "linear-gradient(135deg, #f2f2f2 0%, #f2f2f2 50%, #f2f2f2 100%)",
        "gradient-accent": "linear-gradient(135deg, #f2f2f2 0%, #f2f2f2 100%)",
        "gradient-card": "linear-gradient(145deg, #f2f2f2 0%, #f2f2f2 100%)",
      },
      boxShadow: {
        modern: "0 0px 0px -1px rgba(0,0,0,0.3), 0px 0px 0px rgba(0,0,0,0.2)",
        "modern-lg": "0 10px 15px -3px rgba(0,0,0,0.3), 0 4px 6px -2px rgba(0,0,0,0.2)",
        glow: "0 0 20px rgba(139,92,246,0.3)",
        "glow-cyan": "0 0 20px rgba(6,182,212,0.3)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-glow": {
          "0%,100%": { boxShadow: "0 0 20px" },
          "50%": { boxShadow: "0 0 30px" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
