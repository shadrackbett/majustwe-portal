/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        majustwe: {
          lime: '#82C341', // Based on the green hills
          darkLime: '#4F8930',
          blue: '#1E3A8A', // Dark blue from the text
          lightBlue: '#87CEFA', // Sky blue
          sun: '#FFC107',
        }
      }
    },
  },
  plugins: [],
}
