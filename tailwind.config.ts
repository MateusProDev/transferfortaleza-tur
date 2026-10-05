/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0fbf4",
          100: "#d9f5e2",
          200: "#b2eac6",
          300: "#85dda6",
          400: "#55cf84",
          500: "#2BC46A",
          600: "#21A657",
          700: "#1A8546",
          800: "#146b38",
          900: "#10572e",
          950: "#093b1e",
        },
        secondary: {
          50: "#fff7f2",
          100: "#fde9dd",
          200: "#fbd1b8",
          300: "#f8b58a",
          400: "#f7a06a",
          500: "#F59255",
          600: "#EE7C35",
          700: "#D96B2A",
          800: "#b9541d",
          900: "#934216",
          950: "#63300f",
        },
        accent: {
          50: "#fffbeb",
          100: "#fff3cf",
          200: "#fde7a5",
          300: "#FAD16D",
          400: "#f9c953",
          500: "#F8C144",
          600: "#E5AE2F",
          700: "#c18e20",
          800: "#9b6e19",
          900: "#795516",
          950: "#462f0b",
        },
        info: {
          50: "#f0fbff",
          100: "#d8f3fb",
          200: "#b6e8f5",
          300: "#96D6EC",
          400: "#86cfe9",
          500: "#78C8E5",
          600: "#5BB4D6",
          700: "#4294b4",
          800: "#39788f",
          900: "#346477",
          950: "#204152",
        },
      },
      fontFamily: {
        poppins: ["var(--font-poppins)", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      spacing: {
        sidebar: "256px",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in",
        "slide-in": "slideIn 0.3s ease-in",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideIn: {
          from: { transform: "translateX(-10px)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
