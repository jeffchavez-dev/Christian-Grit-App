/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0A0A0F',
        surface: '#1A1A24',
        surfaceAlt: '#22222E',
        border: '#2A2A3A',
        primary: '#6C63FF',
        primaryDim: '#3D3880',
        gold: '#F5A623',
        muted: '#8888AA',
        faint: '#555570',
      },
    },
  },
  plugins: [],
};
