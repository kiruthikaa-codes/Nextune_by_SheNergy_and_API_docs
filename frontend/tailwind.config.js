/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-dark': '#0A0E27',
        'dark-purple': '#1a0f3a',
        'dark-blue': '#0f1b4d',
        'electric-blue': '#4D7FFF',
        'electric-cyan': '#8B5CF6',
        'neon-green': '#8B5CF6',
        'warning-yellow': '#FCD34D',
        'accent-purple': '#8B5CF6',
        'accent-white': '#F5F7FA',
        'text-light': '#FFFFFF',
        'text-secondary': '#D1D5DB',
        'card-dark': '#141829',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(77, 127, 255, 0.4)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.4)',
        'glow-white': '0 0 20px rgba(245, 247, 250, 0.2)',
        'glow-blue': '0 0 20px rgba(15, 27, 77, 0.3)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
