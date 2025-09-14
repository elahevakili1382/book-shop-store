/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts}"],
  theme: {
    extend: {
      colors:{
        "fruit-yellow" :"#DCF763",
      },
       backgroundImage: {
    'custom-gradient': 'linear-gradient(180deg, #F1F2EE 0%, #D8D5D2 71.31%, rgba(235, 235, 231, 0) 100%)',
  }
    },

    fontFamily:{
        sans: ["Vazir", "sans-serif"],
    },
    container:{
      center:true,
      padding:"2rem",
    }
  },
  plugins: [],

  rtl:true,
}

