/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0b4f8a",
          light: "#0f6bb6",
          dark: "#083a66"
        },
        accent: "#13a48f"
      },
      fontFamily: {
        heading: ["Sora", "sans-serif"],
        body: ["Manrope", "sans-serif"]
      },
      boxShadow: {
        glow: "0 20px 45px -28px rgba(11, 79, 138, 0.7)"
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(120deg, #0f6bb6 0%, #13a48f 100%)"
      }
    }
  },
  plugins: []
};
