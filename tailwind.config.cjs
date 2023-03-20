/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: { 
    extend: {
      borderWidth: {
        '2': '3px',
        '1': '2px',
      },
      height:{
        '1':'2px'
      },
      screens: {
        '2xl': '1308px',
        // => @media (min-width: 992px) { ... }
      },
      colors:{
        'stickButton' : '#e7eeef',
        'buttonColor':"#b7c9cc",
      },
      
    },
  },
  plugins: [],
}
