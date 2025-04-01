/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        nanum: ['"Nanum Square Round"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
