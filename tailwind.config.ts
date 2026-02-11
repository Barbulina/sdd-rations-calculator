import type { Config } from "tailwindcss";

// Design tokens will be imported here after first build
// import tokens from "./src/infrastructure/design-tokens/tailwind-tokens.js";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Design tokens will be added here after npm run tokens:build
      // colors: tokens?.colors || {},
      // spacing: tokens?.spacing || {},
      // fontSize: tokens?.fontSize || {},
    },
  },
  plugins: [],
};

export default config;
