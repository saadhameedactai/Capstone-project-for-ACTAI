/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#1B2A4A",
        brass: "#B08D57",
        paper: "#F7F5F0",
        ink: "#26282B",
      },
      fontFamily: {
        display: ["'Source Serif 4'", "serif"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
