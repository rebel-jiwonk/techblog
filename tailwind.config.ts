import { type Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Pretendard", "sans-serif"],
        english: ["Soehne", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
      colors: {
        base: {
          50: "#F8F8FA",
          100: "#EFF2F5",
          200: "#E2EBF2",
          300: "#D9E4ED",
          400: "#BBC4CF",
          500: "#808A96",
          600: "#3B434B",
          700: "#23292F",
          800: "#1B1F23", // use this for dark bg
        },
        accent: {
          green: "#52F756",
        },
      },
      borderRadius: {
        DEFAULT: "0px",
      },
      boxShadow: {
        none: "none",
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;