/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        gold: { DEFAULT: "#FF6B00", 500: "#FF6B00", 600: "#E85900", light: "#FF8A3D", pale: "#FFC48B" },
        bg:   { DEFAULT:"#070707", 2:"#111111", 3:"#161616" },
        surface: { DEFAULT: "#0D0D0D", soft: "#1B1B1B" },
        miss: "#FF6B00", master: "#FFFFFF",
      },
      fontFamily: {
        display: ["'Cormorant Garamond'","serif"],
        body:    ["'DM Sans'","sans-serif"],
      },
    }
  },
  plugins: [],
};
