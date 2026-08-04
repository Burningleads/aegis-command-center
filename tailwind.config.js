/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'aegis-black': '#0a0e27',
        'aegis-gold': {
          50: '#fefdf0',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        'aegis-slate': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'monospace'],
      },
      borderRadius: {
        xs: '0.25rem',
        sm: '0.375rem',
        base: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
      },
      boxShadow: {
        'glow-sm': '0 0 8px rgba(212, 175, 55, 0.2)',
        'glow': '0 0 16px rgba(212, 175, 55, 0.3)',
        'glow-lg': '0 0 32px rgba(212, 175, 55, 0.4)',
      },
    },
  },
  plugins: [],
}
