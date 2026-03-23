import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f8f9fa",
          100: "#f1f3f5",
          200: "#e9ecef",
          300: "#dee2e6",
          400: "#ced4da",
          500: "#adb5bd",
          600: "#868e96",
          800: "#343a40",
          900: "#1a1d20",
          950: "#101214",
        },
      },
      backgroundImage: {
        'grid-pattern-light': 'linear-gradient(to right, #e9ecef 1px, transparent 1px), linear-gradient(to bottom, #e9ecef 1px, transparent 1px)',
        'grid-pattern-dark': 'linear-gradient(to right, #ffffff0a 1px, transparent 1px), linear-gradient(to bottom, #ffffff0a 1px, transparent 1px)',
      }
    },
  },
  plugins: [],
};
export default config;
