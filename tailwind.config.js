/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          DEFAULT: '#F5F2E9', // Soft Parchment
          dark: '#E8E4D8',
        },
        walnut: {
          DEFAULT: '#3C2F2F', // Deep Walnut
          light: '#5D4B4B',
        },
        sage: {
          DEFAULT: '#8A9A5B', // Morning Sage
          light: '#A3B18A',
        },
        terracotta: {
          DEFAULT: '#C27E7E', // Terracotta Dust
          light: '#D4A5A5',
        },
      },
      fontFamily: {
        serif: ['Merriweather', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
