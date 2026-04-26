/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx,mdx}',
    './components/**/*.{js,jsx,mdx}',
    './app/**/*.{js,jsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#030712',
        foreground: '#f9fafb',
        primary: '#3B82F6',
        accent: '#8B5CF6'
      },
      animation: {
        'glow': 'glow 3s ease-in-out infinite alternate',
        marquee: "marquee var(--duration) linear infinite",
        "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(59,130,246,0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(59,130,246,0.6)' },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--gap)))" },
        },
        "marquee-vertical": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(calc(-100% - var(--gap)))" },
        },
      }
    },
  },
  plugins: [],
}
