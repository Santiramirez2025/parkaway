import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        // ParkAway - Warm Trust palette
        // Mismos NOMBRES de tokens, valores nuevos.
        ink: {
          950: "#FAF7F2", // bg principal (marfil calido)
          900: "#FFFFFF", // surfaces / cards (blanco)
          800: "#E8E1D5", // border default
          700: "#D9D1C1", // border-strong
          500: "#5C6373", // fg muted
          400: "#5C6373",
          300: "#3A4150", // fg destacado
        },
        lime: {
          // Antes: lima electrico. Ahora: navy premium.
          DEFAULT: "#1E3A5F",
          glow: "#C2724A",
        },
        background: "#FAF7F2",
        foreground: "#1A1F2E",
        border: "#E8E1D5",
        input: "#FFFFFF",
        ring: "#1E3A5F",
        primary: {
          DEFAULT: "#1E3A5F",
          foreground: "#FAF7F2",
        },
        secondary: {
          DEFAULT: "#FFFFFF",
          foreground: "#1A1F2E",
        },
        muted: {
          DEFAULT: "#F2EDE5",
          foreground: "#5C6373",
        },
        destructive: {
          DEFAULT: "#B84A3D",
          foreground: "#FAF7F2",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#1A1F2E",
        },
        success: {
          DEFAULT: "#3F7D58",
          soft: "#E4EFE4",
          fg: "#2A5C40",
        },
        warning: {
          DEFAULT: "#B8862F",
          soft: "#F7EDD4",
          fg: "#7A5A1F",
        },
        info: {
          DEFAULT: "#3D6B96",
          soft: "#DCE7F2",
          fg: "#2A4D6B",
        },
        accent: {
          DEFAULT: "#C2724A",
          soft: "#F5E6DC",
          foreground: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-newsreader)", "Georgia", "serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        "soft-sm":
          "0 1px 2px rgba(40, 30, 20, 0.04), 0 1px 1px rgba(40, 30, 20, 0.03)",
        "soft-md":
          "0 4px 12px rgba(40, 30, 20, 0.06), 0 2px 4px rgba(40, 30, 20, 0.04)",
        "soft-lg":
          "0 12px 32px rgba(30, 58, 95, 0.10), 0 4px 8px rgba(40, 30, 20, 0.04)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
