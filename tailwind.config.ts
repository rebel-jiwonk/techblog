import { type Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
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
          800: "#1B1F23",
        },
        accent: {
          green: "#52F756",
        },
      },
      borderRadius: {
        DEFAULT: "0px", // disables rounding globally
      },
      boxShadow: {
        none: "none", // disables shadow utility
      },
    },
  },
  plugins: [],
};

export default config;