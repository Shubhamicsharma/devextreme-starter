/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: {
    strategy: 'selector',
    selector: '.dx-swatch-dark'
  },
  content: ["./src/**/*.{html,ts,scss,css}", "./index.html"],
  theme: {
    extend: {},
  },
};
