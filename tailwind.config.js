/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'night-blue': '#0a1628',
        'electric-blue': '#2563eb',
        'electric-blue-light': '#3b82f6',
        'dark-blue': '#1e3a5f',
      }
    },
  },
  plugins: [],
}
