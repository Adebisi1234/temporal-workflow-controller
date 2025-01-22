/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FF6363",
        darkBg: "#1f2023",
        darkBgXl: "#1f2023b3",
        darkBgL: "#26272b",
        darkBg2: "#26272a",
        darkGrey: "#afb3b8",
        textGold: "#ffc71c",
        textGoldLight: "#fff0c5",
        greenDD: "#003e21",
        greenDDXL: "#003e21cc",
        greenD: "#075b37",
        greenL: "#018060",
        secondary: {
          100: "#E2E2D5",
          200: "#888883",
        },
      },
      fontFamily: {
        body: ["Nunito", "Inter"],
      },
      width: {
        max: 1280,
      },
    },
    darkMode: "class",
  },
  plugins: [],
};
