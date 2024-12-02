/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui'),],
  daisyui: {
    darkTheme: 'note2',
    themes: [
      {
        note2: {
          "primary": "#3a3a3a",
          "secondary": "#99f6e4",
          "accent": "#00ffff",
          "neutral": "#f3f4f6",
          "base-100": "#101317",
          "info": "#6ff978",
          "success": "#75fc75",
          "warning": "#dc2626",
          "error": "#ff0000",
        },
        gruen: {
          "primary": "#101317",
          "secondary": "#4fd485",
          "accent": "#4fd485",
          "neutral": "#101317",
          "base-100": "#101317",
          "info": "#4fd485",
          "success": "#4fd485",
          "warning": "#4fd485",
          "error": "#4fd485"
        }
      },
        "dark", "coffee", "forest", "black", "cyberpunk", "light"],
  },
}

