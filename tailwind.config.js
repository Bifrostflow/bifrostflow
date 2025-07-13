/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'bifrost-start': '#0d1b2a',
        'bifrost-mid': '#0f3057',
        'bifrost-end': '#1b4db0',
        'bifrost-dark-1': '#225879',
        'bifrost-dark-2': '#080F37',
        'bifrost-glow-cyan': '#00CFFF',
        'bifrost-glow-violet': '#8A2AE2',
      },
    },
  },
  plugins: [],
};
