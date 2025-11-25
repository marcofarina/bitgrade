/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
  safelist: [
    // Dynamic color classes used in GradeCard.tsx need to be safelisted
    // because Tailwind can't detect template literal string interpolation
    'stroke-emerald-500',
    'stroke-yellow-500',
    'stroke-rose-500',
    'text-emerald-500',
    'text-yellow-500',
    'text-rose-500',
    'bg-emerald-500',
    'bg-yellow-500',
    'bg-rose-500',
  ]
}