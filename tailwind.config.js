/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFCF9',
          100: '#FAF8F4',
          200: '#F4EFEB',
          300: '#EDE4DC',
          400: '#DFD1C4',
        },
        sand: {
          50: '#F9F8F5',
          100: '#F3EFE8',
          200: '#E7DFD4',
          300: '#D7CBBD',
          400: '#B8A593',
          500: '#94806D',
        },
        stone: {
          50: '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
          950: '#0C0A09',
        },
        charcoal: {
          800: '#232220',
          900: '#181715',
          950: '#0F0E0D',
        },
        olive: {
          50: '#F5F7F3',
          100: '#E8EDE3',
          600: '#5A6B4F',
          700: '#45533D',
        },
        copper: {
          50: '#FAF3EF',
          100: '#F3E3D9',
          500: '#C16B45',
          600: '#A45532',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        'extra-wide': '0.15em',
        'super-wide': '0.25em',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
    },
  },
  plugins: [],
}
