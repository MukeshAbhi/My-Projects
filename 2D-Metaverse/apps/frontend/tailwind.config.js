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
        'my-image': "url(./images/bg2.jpg)",
        'my-image2': "url(./images/bg.png)"
      },
      colors: {
        customOrange: 'rgb(228, 155, 15)',
      }
    },
    
  },
  plugins: [],
}

