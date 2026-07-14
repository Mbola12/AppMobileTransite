module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#08a1ae',
        secondary: '#067A77',
        yellow: '#FEBA03',
        orange: '#FC8312',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255,255,255,0.55)' },
          '50%': { boxShadow: '0 0 0 7px rgba(255,255,255,0)' },
        },
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-out infinite',
      },
    },
  },
  plugins: [],
};
