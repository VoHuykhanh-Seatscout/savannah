/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        savannah: {
          primary: "#EA580C",
          secondary: "#F97316",
          accent: "#FBBF24",
          dark: "#1F2937",
          light: "#FFFBEB",
          success: "#10B981",
          error: "#EF4444",
        },
      },
    },
  },
  plugins: [],
}