/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './app.js', './aiignore.js', './guardrails.js'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0a',
        surface: '#141414',
        border: '#262626',
        accent: '#3b82f6',
        'accent-hover': '#2563eb',
        muted: '#737373',
        dim: '#525252',
      },
    },
  },
  plugins: [],
};
