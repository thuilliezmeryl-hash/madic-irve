import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        madic: {
          red: "#C8102E",
          "red-dark": "#A00D25",
          gray: "#3F3F3F",
          "gray-light": "#6B6B6B",
        },
      },
    },
  },
  plugins: [],
};
export default config;
