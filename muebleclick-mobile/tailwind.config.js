/** @type {import('tailwindcss').Config} */
module.exports = {
  // Escaneamos todas nuestras carpetas clave
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#2D6A4F', dark: '#1B4332' },
        beige:   { DEFAULT: '#F5F0E8', dark: '#EDE0CC' },
        brown:   { DEFAULT: '#A0522D', dark: '#6B4226' },
        surface: { light: '#FAF7F2', dark: '#0D2B1E' },
      },
      boxShadow: {
        'neo': '8px 8px 16px rgba(160, 82, 45, 0.15), -8px -8px 16px rgba(255, 255, 255, 0.8)',
        'neo-inset': 'inset 4px 4px 8px rgba(160, 82, 45, 0.1), inset -4px -4px 8px rgba(255, 255, 255, 0.9)',
      }
    },
  },
  plugins: [],
}