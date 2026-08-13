/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        surface: {
          950: '#080810',
          900: '#0E0E1A',
          800: '#14142A',
          700: '#1C1C38',
          600: '#242445',
        },
        border: '#252540',
        'border-subtle': '#1C1C32',
        primary: {
          DEFAULT: '#6B8AFE',
          hover: '#5070FE',
          dim: 'rgba(107,138,254,0.12)',
        },
        teal: {
          DEFAULT: '#2DD4BF',
          dim: 'rgba(45,212,191,0.12)',
        },
        orange: {
          DEFAULT: '#FB923C',
          dim: 'rgba(251,146,60,0.12)',
        },
        rose: {
          DEFAULT: '#F87171',
          dim: 'rgba(248,113,113,0.12)',
        },
        violet: {
          DEFAULT: '#A78BFA',
          dim: 'rgba(167,139,250,0.12)',
        },
      },
    },
  },
  plugins: [],
}
