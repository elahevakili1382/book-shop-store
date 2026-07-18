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
  // قبلی‌ها را نگه دار (fruit-yellow, primary, ...)
  slate: '#435058',      // متن و دکمه اصلی
  lime: '#DCF763',       // accent / chip فعال
  cream: '#FAFAF8',      // پس‌زمینه صفحه
  surface: '#FFFFFF',    // کارت‌ها
},
    
borderRadius: {
  'card': '1.25rem',
  'pill': '9999px',
},
boxShadow: {
  'card': '0 8px 32px rgba(67,80,88,0.08)',
  'card-hover': '0 16px 48px rgba(67,80,88,0.12)',
},
     
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(180deg, #F1F2EE 0%, #D8D5D2 71.31%, rgba(235, 235, 231, 0) 100%)",
        "hero-gradient":
          "linear-gradient(165deg, #FAFAF7 0%, #F4F6EF 40%, #EEF2E8 100%)",
        "chip-gradient":
          "linear-gradient(135deg, rgba(220,247,99,0.25) 0%, rgba(126,220,181,0.15) 100%)",
      },
     
     
      animation: {
        "float-slow": "float 6s ease-in-out infinite",
        "marquee-rtl": "marquee-rtl 28s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "marquee-rtl": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(50%)" },
        },
      },
    },

    fontFamily: {
      sans: ["Vazir", "sans-serif"],
    },
    container: {
      center: true,
      padding: "2rem",
    },
  },
  plugins: [],

  rtl: true,
}
