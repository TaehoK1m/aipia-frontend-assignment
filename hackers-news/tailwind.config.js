/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}", // React + TS 환경
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#ff6600", // Hacker News 색상
          dark: "#d85700",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [typography],
};

export default config;
