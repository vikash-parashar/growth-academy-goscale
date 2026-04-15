import type { Config } from "tailwindcss";

/**
 * Day: #FFF3C7 · #FEC7B4 · #FC819E · #FF8E8F · #FA7070
 * Dark (main + admin): #1B3C53 · #234C6A · #456882 · #D2C1B6
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        /** Logo wordmark — Bebas Neue (all-caps lockup) */
        brandDisplay: ["var(--font-brand-display)", "var(--font-sans)", "system-ui", "sans-serif"],
        /** Wordmark tagline under logo */
        brandTagline: ["var(--font-brand-tagline)", "system-ui", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          DEFAULT: "#FA7070",
          coral: "#FA7070",
          magenta: "#FC819E",
          sunset: "#FA7070",
          berry: "#FC819E",
          label: "#FF8E8F",
          onDark: "#FEC7B4",
          onDarkStrong: "#FFF3C7",
          hover: "#e85555",
          sunsetBright: "#ff8585",
          berryBright: "#ffb0c4",
        },
      },
      boxShadow: {
        soft: "0 2px 8px -2px rgba(27, 60, 83, 0.06), 0 8px 24px -8px rgba(250, 112, 112, 0.12)",
        "soft-dark": "0 2px 8px -2px rgba(0, 0, 0, 0.4), 0 12px 32px -10px rgba(0, 0, 0, 0.45)",
        glow: "0 0 0 1px rgba(252, 129, 158, 0.2), 0 12px 40px -12px rgba(250, 112, 112, 0.18)",
        "brand-lg": "0 8px 30px -8px rgba(252, 129, 158, 0.35)",
        "brand-md": "0 4px 20px -6px rgba(250, 112, 112, 0.28)",
        "brand-sm": "0 2px 12px -4px rgba(255, 142, 143, 0.28)",
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(ellipse 90% 70% at 50% -15%, rgba(252,129,158,0.14), transparent 55%), radial-gradient(ellipse 55% 45% at 100% 15%, rgba(250,112,112,0.1), transparent 50%), radial-gradient(ellipse 50% 40% at 0% 35%, rgba(255,243,199,0.92), transparent 55%)",
        "hero-radial-dark":
          "radial-gradient(ellipse 90% 70% at 50% -15%, rgba(69,104,130,0.38), transparent 55%), radial-gradient(ellipse 55% 45% at 100% 15%, rgba(210,193,182,0.08), transparent 50%), radial-gradient(ellipse 50% 40% at 0% 35%, rgba(27,60,83,0.85), transparent 55%)",
        "mesh-light":
          "linear-gradient(155deg, #FFF3C7 0%, #FEC7B4 38%, #ffe8e3 72%, #FFF3C7 100%)",
        "mesh-dark":
          "linear-gradient(180deg, #1B3C53 0%, #234C6A 48%, #1B3C53 100%)",
      },
      animation: {
        shimmer: "shimmer 3s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
