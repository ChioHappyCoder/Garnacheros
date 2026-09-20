/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef3f2',
          100: '#fee2e0',
          200: '#fdc6c1',
          300: '#fb9a94',
          400: '#f57863',
          500: '#f97316',
          600: '#e85a2a',
          700: '#c4380d',
          800: '#a2310d',
          900: '#852c0f',
        },
      },
    },
  },
  plugins: [],
};
