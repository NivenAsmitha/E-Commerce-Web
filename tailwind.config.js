/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      primary: {
        primary: "#dd0199", // Default primary color
        secondary: "#ddb1f2", // Lighter shade for hover effects
      },

      container: {
        center: true, // Center the container
        padding: {
          DEFAULT: "2rem", // Default padding for the container
          sm: "3rem", // Padding for small screens
        }, // Padding for the container
      },
    },
  },
  plugins: [],
};
