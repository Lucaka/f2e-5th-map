/* eslint-env node */
/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue}'],
  theme: {
    colors: {
      primary: '#4E4376',
      secondary: '#D9D9D9',
      white: '#FFFFFF',
      transparent: 'transparent'
    },
    container: {
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1736px'
      }
    },
    extend: {}
  },
  plugins: []
}
