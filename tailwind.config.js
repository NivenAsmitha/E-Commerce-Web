/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#dd0199", // Pink
        secondary: "#5b2e8c", // Deep purple
        accent: "#f7971e", // Orange (optional)
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "2rem",
          sm: "3rem",
        },
      },
    },
  },
  plugins: [],
};
