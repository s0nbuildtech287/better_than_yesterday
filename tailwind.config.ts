import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        clay: {
          bg: "#FFFBEB",
          card: "#FFFFFF",
          amber: "#D97706",
          emerald: "#059669",
          lavender: "#8B5CF6",
          rose: "#E11D48",
          sky: "#0284C7",
          border: "#F3E8FF",
        }
      },
      fontFamily: {
        sans: ["var(--font-quicksand)", "sans-serif"],
        heading: ["var(--font-outfit)", "sans-serif"],
        handwriting: ["var(--font-caveat)", "cursive"],
      },
      boxShadow: {
        'clay-sm': '4px 4px 10px rgba(0, 0, 0, 0.05), -4px -4px 10px rgba(255, 255, 255, 0.8)',
        'clay-md': '8px 8px 20px rgba(217, 119, 6, 0.08), -8px -8px 20px rgba(255, 255, 255, 0.9), inset 2px 2px 4px rgba(255, 255, 255, 0.8)',
        'clay-lg': '12px 12px 30px rgba(139, 92, 246, 0.12), -10px -10px 25px rgba(255, 255, 255, 0.95), inset 3px 3px 6px rgba(255, 255, 255, 0.9)',
        'clay-btn': '0 10px 20px -5px rgba(217, 119, 6, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.5)',
        'clay-emerald': '0 10px 20px -5px rgba(5, 150, 105, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.5)',
      },
      keyframes: {
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(-3%)' },
          '50%': { transform: 'translateY(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.05)' },
        }
      },
      animation: {
        'bounce-subtle': 'bounce-subtle 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};
export default config;
