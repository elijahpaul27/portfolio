/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        steam: {
          dark: '#000000',
          panel: '#4A5343',
          panelDark: '#3B4335',
          gold: '#E5A937',
          text: '#FFFFFF',
          textMuted: '#9CA3AF'
        }
      },
      fontFamily: {
        tahoma: ['Tahoma', 'Verdana', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
