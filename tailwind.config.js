/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#0B0A0E',
        parchment: '#16131D',
        crimson: '#7A1C24',
        gold: '#E6B86A',
        mist: '#94A3B8',
        'gothic-obsidian': '#0B0A0E',
        'gothic-parchment': '#16131D',
        'gothic-crimson': '#7A1C24',
        'gothic-gold': '#E6B86A',
        'gothic-mist': '#94A3B8',
      },
      fontFamily: {
        cinzel: ['var(--font-cinzel)', 'Cinzel', 'Playfair Display', 'serif'],
        serif: ['var(--font-cinzel)', 'Cinzel', 'Playfair Display', 'serif'],
        mono: ['var(--font-jetbrains-mono)', 'JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'gothic-glow': '0 0 15px rgba(230, 184, 106, 0.25)',
        'gothic-crimson': '0 0 15px rgba(122, 28, 36, 0.35)',
      },
    },
  },
  plugins: [],
};
