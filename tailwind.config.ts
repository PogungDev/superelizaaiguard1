import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
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
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom VaultGuard colors (Cyberpunk Purple) - Neutralized for reset
        "vault-primary": {
          DEFAULT: "hsl(var(--primary))", // Using primary for main vault color
          foreground: "hsl(var(--background))", // Text on primary buttons
        },
        "vault-dark": "hsl(var(--background))",
        "vault-secondary": {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--foreground))",
        },
        "vault-text": "hsl(var(--foreground))",
        "vault-text-muted": "hsl(var(--muted-foreground))",
        "vault-success": "hsl(var(--success))", // Assuming a success variable exists or use green-500
        "vault-warning": "hsl(var(--warning))", // Assuming a warning variable exists or use yellow-500
        "vault-danger": "hsl(var(--destructive))",
        "vault-info": "hsl(var(--info))", // Assuming an info variable exists or use blue-500
        "vault-card": "hsl(var(--card))",
        "vault-border": "hsl(var(--border))",
        "vault-glow": "hsl(var(--primary))", // Using primary for glow
        // Neon accents - Definitions kept, but not actively used in styling
        "neon-primary": "hsl(var(--neon-primary))",
        "neon-accent": "hsl(var(--neon-accent))",
        "neon-warning": "hsl(var(--neon-warning))",
        "neon-danger": "hsl(var(--neon-danger))",
        "neon-info": "hsl(var(--neon-info))",
        "neon-success": "hsl(var(--neon-success))",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
