/** @type {import('tailwindcss').Config} */
const widthExtension = {
  'full-content': '100%',
  'full-content-sm': '640px',
  'full-content-md': '768px',
  'full-content-lg': '1024px',
  'full-content-xl': '1280px',
};
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './node_modules/flowbite-react/**/*.js',
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    letterSpacing: {
      widest: '.2em',
    },
    extend: {
      animation: {
        'pulse-once': 'fade-in .4s ease-in-out',
      },
      keyframes: {
        'fade-in': {
          '0%': {
            opacity: 0,
          },
          '50%': {
            opacity: 0.5,
          },
          '100%': {
            opacity: 1,
          },
        },
      },
      fontFamily: {
        'outfit': [
          'Outfit',
          ...defaultTheme.fontFamily.sans,
        ],
        'open-sans-condensed': [
          'Open Sans Condensed',
          ...defaultTheme.fontFamily.sans,
        ],
        'din-neu': [
          'DINNeuzeitGroteskLTW01-_812426',
          ...defaultTheme.fontFamily.sans,
        ],
      },
      rotate: {
        270: '270deg',
      },
      maxWidth: {
        ...widthExtension,
      },
      width: {
        ...widthExtension,
      },
      colors: {
        'gray-c1': 'rgb(37,33,40)',
        'gray-c2': 'rgb(47,43,50)',
        'theme-orange': '#FA5C33',
        highlight: '#FA5C33', // Keep for backward compatibility
      },
      gridTemplateColumns: {
        'auto-sm': 'repeat(auto-fill,minmax(120px,1fr))',
      },
      backgroundImage: {},
    },
  },
  plugins: [require('flowbite/plugin')],
};
