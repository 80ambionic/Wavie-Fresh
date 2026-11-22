/** Tailwind config for the offline build. Mirrors the config the app used with the Tailwind CDN. */
module.exports = {
  content: ['./dist/index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        obsidian: {
          950: '#07090e',
          900: '#0c1017',
          850: '#111621',
          800: '#161d2b',
          750: '#1d2638',
          700: '#263147',
        },
      },
    },
  },
};
