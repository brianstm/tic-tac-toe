/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,tsx}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"]
      }
    }
  },
  plugins: [require("flowbite/plugin")]
}
