/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        military: {
          50: '#f0f5f3',
          100: '#dbe8e1',
          200: '#b8d2c4',
          300: '#90b5a0',
          400: '#6a967b',
          500: '#4f7960',
          600: '#3d5f4a',
          700: '#2C4A3D',
          800: '#243a30',
          900: '#1f3128',
        },
        desert: {
          50: '#f9f7f4',
          100: '#f0ebe3',
          200: '#e2d5c3',
          300: '#cfb99c',
          400: '#b89672',
          500: '#a37e56',
          600: '#8B7355',
          700: '#785d43',
          800: '#634c38',
          900: '#523f2f',
        },
        tactical: {
          50: '#fef2f2',
          100: '#fde7e7',
          200: '#fcd4d4',
          300: '#f9b3b3',
          400: '#f48282',
          500: '#ec5555',
          600: '#FF6B35',
          700: '#dc2626',
          800: '#b91c1c',
          900: '#991b1b',
        },
        surface: '#1A1F1B',
        background: '#0F1410',
      },
      fontFamily: {
        'display': ['Bebas Neue', 'Arial Black', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};