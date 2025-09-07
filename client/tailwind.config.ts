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
        "bubble-bg": "#000", // A deep, muted purple-grey for background
        "bubble-text": "#DDEEF8", // A light, desaturated purple-grey for text
        "bubble-primary": "#6EC9F7", // A vibrant but not overly bright purple for primary actions
        "bubble-secondary": "#205f8b", // A darker purple for secondary elements
        "bubble-accent": "#4885a3", // A lighter, more pastel purple for accents
        "bubble-hover-bg": "#11324a", // A lighter, more pastel purple for accents
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
