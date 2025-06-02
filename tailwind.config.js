/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enables class-based dark mode (works with next-themes)
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    './dashboard/**/*.{js,jsx,ts,tsx}', // Include dashboard paths
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        primary: '#0A84FF',       // Blue for buttons
        dark: '#0e0e0e',          // Clean black
        soft: '#1a1a1a',          // Card background
        zinc: {
          900: '#0f0f0f',
          800: '#1a1a1a',
          700: '#2a2a2a',
        },
      },
      borderRadius: {
        lg: '12px',
      },
    },
  },
  plugins: [],
};
