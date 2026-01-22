/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // The solid gold color (Middle of your gradient)
        // usage: text-luxury, border-luxury, ring-luxury
        luxury: "#C9A24D",
      },
      backgroundImage: {
        // The Master Gradient
        // usage: bg-luxury-gradient
        "luxury-gradient":
          "linear-gradient(90deg, #E6C77A 0%, #C9A24D 45%, #A67C2E 100%)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        marcellus: ["var(--font-marcellus)", "serif"],
      },
    },
  },
  plugins: [],
};
