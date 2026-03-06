/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#6A3DF0",
          light: "#8A5CFF",
          dark: "#5E3BEE"
        }
      },
      fontFamily: {
        heading: ["Sora", "sans-serif"],
        body: ["Manrope", "sans-serif"]
      },
      boxShadow: {
        glow: "0 24px 60px -30px rgba(106, 61, 240, 0.75)"
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(120deg, #8A5CFF 0%, #5E3BEE 100%)"
      }
    }
  },
  plugins: []
};
