import type { Config } from "tailwindcss";

// Import generated design tokens
const tokens = require("./src/infrastructure/design-tokens/tailwind-tokens.js");

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ...tokens,
      },
      spacing: {
        ...tokens,
      },
    },
  },
  plugins: [],
};

export default config;
