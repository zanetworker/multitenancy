/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['"Red Hat Text"', 'ui-sans-serif', 'system-ui'],
        display: ['"Red Hat Display"', 'ui-sans-serif', 'system-ui'],
        mono:    ['"Red Hat Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        surface: {
          950: '#060608',
          900: '#0D0D12',
          800: '#13131A',
          700: '#1A1A24',
          600: '#22222E',
        },
        border:         '#252530',
        'border-subtle':'#1C1C26',
        // Red Hat Red as primary
        primary: {
          DEFAULT: '#EE0000',
          hover:   '#CC0000',
          dark:    '#A60000',
          dim:     'rgba(238,0,0,0.10)',
        },
        // Red Hat teal accent
        teal: {
          DEFAULT: '#009596',
          light:   '#73BCB6',
          dim:     'rgba(0,149,150,0.12)',
        },
        // Red Hat purple accent
        purple: {
          DEFAULT: '#5752D1',
          dim:     'rgba(87,82,209,0.12)',
        },
        orange: {
          DEFAULT: '#F4860A',
          dim:     'rgba(244,134,10,0.12)',
        },
        rose: {
          DEFAULT: '#C9190B',
          dim:     'rgba(201,25,11,0.12)',
        },
        violet: {
          DEFAULT: '#5752D1',
          dim:     'rgba(87,82,209,0.12)',
        },
      },
    },
  },
  plugins: [],
}
