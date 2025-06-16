/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: '#bb86fc',
        'secondary-accent': '#03dac6',
        'dark-surface': '#1e1e1e',
        'dark-bg': '#121212',
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
        'nunito': ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
}