import type { Config } from "tailwindcss";

const config: Config = {
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
        primary: {
          DEFAULT: "var(--color-primary)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
        },
        pink: {
          50: "var(--pink-50)",
          100: "var(--pink-100)",
          200: "var(--pink-200)",
          300: "var(--pink-300)",
          400: "var(--pink-400)",
          500: "var(--pink-500)",
          600: "var(--pink-600)",
        },
        cream: {
          50: "var(--cream-50)",
          100: "var(--cream-100)",
          200: "var(--cream-200)",
          300: "var(--cream-300)",
        },
        brown: {
          100: "var(--brown-100)",
          200: "var(--brown-200)",
          300: "var(--brown-300)",
          600: "var(--brown-600)",
          700: "var(--brown-700)",
          900: "var(--brown-900)",
        },
      },
      borderRadius: {
        DEFAULT: "var(--border-radius)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

