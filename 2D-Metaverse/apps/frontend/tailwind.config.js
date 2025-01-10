/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Poppins']
      },
      backgroundImage: {
        'my-image': "url(./public/images/bg2.jpg)",
        'my-image2': "url(./public/images/bg.png)",
        'my-image3': "url(./public/images/bg3.jpg)"
      },
      colors: {
        customOrange: 'rgb(228, 155, 15)',
      }
    },
    
  },
  plugins: [],
}

