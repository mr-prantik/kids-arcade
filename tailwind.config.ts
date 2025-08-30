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
        // example custom colors for kids-friendly theme
        primary: "#ff80b5", // pink
        secondary: "#80d4ff", // sky blue
        accent: "#ffd280", // soft orange
      },
    },
  },
  plugins: [],
};

export default config;
