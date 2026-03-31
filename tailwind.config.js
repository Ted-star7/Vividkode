/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#102a43',
          950: '#0a1929',
        },
        gold: {
          50: '#fdf8ec',
          100: '#f9edca',
          200: '#f3d98a',
          300: '#ecc04a',
          400: '#e4a820',
          500: '#c8861a',
          600: '#a86815',
          700: '#8a4f13',
          800: '#703f14',
          900: '#5c3414',
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      boxShadow: {
        'gold': '0 4px 24px -4px rgba(200, 134, 26, 0.25)',
        'navy': '0 4px 24px -4px rgba(10, 25, 41, 0.4)',
        'card': '0 1px 3px rgba(10, 25, 41, 0.08), 0 8px 32px rgba(10, 25, 41, 0.06)',
        'card-hover': '0 4px 12px rgba(10, 25, 41, 0.12), 0 16px 48px rgba(10, 25, 41, 0.1)',
      }
    }
  },
  plugins: []
}
