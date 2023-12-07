/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      spacing: {
        0.5: '10px',
      },
      colors: {
        gray: {
          100: '#F2F2F2',
          200: '#D9D9D9',
          300: '#808080',
          400: '#333333',
          500: '#262626',
          600: '#1A1A1A',
          700: '#0D0D0D',
        },
        blue: {
          400: '#4EA8DE',
          500: '#1E6F9F',
        },
        purple: {
          400: '#8284FA',
          500: '#5E60CE',
        },
        red: {
          400: '#E25858',
        },
      }
    },
  },
  plugins: [],
}
