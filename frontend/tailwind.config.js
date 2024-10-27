module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'mesh': "url('/src/assets/meshg.jpg')",
        'mesh2': "url('/src/assets/meshg2.png')",
      }
    },
  },
  plugins: [],
};
