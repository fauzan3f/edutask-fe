/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4f9ef6',
          DEFAULT: '#2563eb',
          dark: '#1e40af',
        },
        secondary: {
          light: '#8b5cf6',
          DEFAULT: '#7c3aed',
          dark: '#6d28d9',
        },
      },
    },
  },
  plugins: [],
} 