/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0A0F1E',
          50: '#1a2040',
          100: '#151b35',
          200: '#111729',
          300: '#0D1224',
          400: '#0A0F1E',
          500: '#070B17',
          600: '#050810',
          700: '#030509',
          800: '#010203',
          900: '#000000',
        },
        gold: {
          DEFAULT: '#C9A84C',
          50: '#F5EDD3',
          100: '#F0E5C0',
          200: '#E6D59A',
          300: '#DDC574',
          400: '#D3B64E',
          500: '#C9A84C',
          600: '#A8893A',
          700: '#816A2D',
          800: '#5A4A1F',
          900: '#332A12',
        },
        teal: {
          DEFAULT: '#00D4B4',
          50: '#B3FFF0',
          100: '#80FFE6',
          200: '#4DFFD9',
          300: '#1AFFCC',
          400: '#00E6BF',
          500: '#00D4B4',
          600: '#00A88E',
          700: '#007C69',
          800: '#005044',
          900: '#00241F',
        },
        surface: {
          DEFAULT: '#111729',
          light: '#1a2040',
          lighter: '#232a45',
          border: '#2a3155',
        },
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'count-up': 'countUp 1s ease-out',
        'pulse-subtle': 'pulseSubtle 2s infinite',
        'glow': 'glow 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        countUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0, 212, 180, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 212, 180, 0.6)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
