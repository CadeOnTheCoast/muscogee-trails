/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pine: '#1f4d37',
        clay: '#a6532f',
        river: '#2f6f73',
        sand: '#d8c7a1',
        ink: '#17201b',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Rockwell', 'Georgia', 'serif'],
      },
      boxShadow: {
        trail: '0 22px 70px rgba(23, 32, 27, 0.16)',
      },
    },
  },
  plugins: [],
};
