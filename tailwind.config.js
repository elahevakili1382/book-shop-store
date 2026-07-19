/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{vue,js,ts}",
    "./components/**/*.{vue,js,ts}",
    "./pages/**/*.{vue,js,ts}",
    "./layouts/**/*.{vue,js,ts}",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        slate: '#435058',
        lime: '#DCF763',
        cream: '#FAFAF8',
        surface: '#FFFFFF',
        dash: {
          bg: '#14151A',
          card: '#1C1E24',
          border: '#2A2D36',
          text: '#F5F2EB',
          muted: '#A8A29E',
          accent: '#DCF763',
          accent2: '#7EDCB5',
        },
      },
      borderRadius: {
        card: '1.25rem',
        pill: '9999px',
      },
      boxShadow: {
        card: '0 8px 32px rgba(67,80,88,0.08)',
        'card-hover': '0 16px 48px rgba(67,80,88,0.12)',
      },
      backgroundImage: {
        'custom-gradient':
          'linear-gradient(180deg, #F1F2EE 0%, #D8D5D2 71.31%, rgba(235, 235, 231, 0) 100%)',
        'hero-gradient':
          'linear-gradient(165deg, #FAFAF7 0%, #F4F6EF 40%, #EEF2E8 100%)',
        'chip-gradient':
          'linear-gradient(135deg, rgba(220,247,99,0.25) 0%, rgba(126,220,181,0.15) 100%)',
        'dash-chart':
          'linear-gradient(180deg, #DCF763 0%, #7EDCB5 100%)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'marquee-rtl': 'marquee-rtl 28s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'marquee-rtl': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(50%)' },
        },
      },
    },

    fontFamily: {
      sans: ['Vazir', 'sans-serif'],
    },
    container: {
      center: true,
      padding: '2rem',
    },
  },
  plugins: [],

  rtl: true,
}
