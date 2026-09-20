/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fef3f2",
          500: "#f97316",
          600: "#ea580c",
        },
      },
    },
  },
  plugins: [],
};
