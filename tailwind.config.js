/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0B0A10',
        surface: '#15131D',
        surface2: '#1E1B29',
        purple: {
          DEFAULT: '#5B21B6',
          light: '#7C3AED',
          dark: '#3B0E8C'
        },
        success: '#22C55E',
        warning: '#F97316',
        danger: '#EF4444'
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(124,58,237,0.5)'
      }
    },
  },
  plugins: [],
}
