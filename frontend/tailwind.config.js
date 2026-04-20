/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        gold: { DEFAULT:"#C9932A", light:"#E8B84B", pale:"#F5DFA0" },
        bg:   { DEFAULT:"#0A0005", 2:"#110009", 3:"#1A000F" },
        miss: "#C2185B", master: "#1565C0",
      },
      fontFamily: {
        display: ["'Cormorant Garamond'","serif"],
        body:    ["'DM Sans'","sans-serif"],
      },
    }
  },
  plugins: [],
};
