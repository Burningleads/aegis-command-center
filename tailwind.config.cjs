module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx,html}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        aegis: {
          black: '#0b0b0b',
          gold: {
            DEFAULT: '#d4af37',
            50: '#f7f2e6',
            100: '#f2ecd6',
            200: '#e6ddb2',
            300: '#d9ce8f',
            400: '#ccb06b',
            500: '#b48f3f',
            600: '#9b7a34',
            700: '#7a5d26',
            800: '#5b4018',
            900: '#37260e'
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      }
    }
  },
  plugins: []
};
