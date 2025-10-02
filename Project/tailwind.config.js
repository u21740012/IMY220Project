// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        secondary: ["Roboto", "sans-serif"],
      },
      colors: {
        brand: {
          orange: "#FF8A5B",
        },
      },
    },
  },
  plugins: [],
};