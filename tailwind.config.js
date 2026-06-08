/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#F5EFE6',
        surface: '#EDE4D3',
        surfaceAlt: '#E3D8C4',
        border: '#C9B99A',
        primary: '#7C5C3E',
        primaryDim: '#A07850',
        gold: '#B8860B',
        muted: '#7A6251',
        faint: '#A8947E',
        ink: '#2C1A0E',
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
      },
    },
  },
  plugins: [],
};
