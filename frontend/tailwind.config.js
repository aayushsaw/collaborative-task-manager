/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#f8fafc", // slate-50
        surface: "#ffffff",
        primary: "#4f46e5", // indigo-600
        secondary: "#475569", // slate-600
        accent: "#8b5cf6", // violet-500
        text: "#0f172a", // slate-900
        muted: "#94a3b8", // slate-400
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        display: ['"Outfit"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
