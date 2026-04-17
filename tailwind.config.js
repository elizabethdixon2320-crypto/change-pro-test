/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"PingFang SC"',
          '"Helvetica Neue"',
          'system-ui',
          'sans-serif',
        ],
      },
      colors: {
        ink: '#0a0a0a',
        paper: '#fafafa',
        run: {
          DEFAULT: '#FF5A1F',
          light: '#FF8A3C',
        },
        pull: {
          DEFAULT: '#8B5CF6',
          light: '#A78BFA',
        },
        squat: {
          DEFAULT: '#A3E635',
          light: '#BEF264',
        },
      },
      keyframes: {
        breathe: {
          '0%,100%': { transform: 'scale(1)', opacity: '0.5' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
        },
        drawCheck: {
          from: { strokeDashoffset: '100' },
          to: { strokeDashoffset: '0' },
        },
        floatUp: {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        glowPulse: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(255,90,31,0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(255,90,31,0)' },
        },
      },
      animation: {
        breathe: 'breathe 3s ease-in-out infinite',
        'draw-check': 'drawCheck 0.5s ease-out forwards',
        'float-up': 'floatUp 0.4s ease-out forwards',
        'glow-pulse': 'glowPulse 2s ease-out infinite',
      },
    },
  },
  plugins: [],
}
