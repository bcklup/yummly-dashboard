/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
        primary: {
          100: "#ffdbc5",
          200: "#ffb88d",
          300: "#ff914d",
          400: "#ff6e14",
          DEFAULT: "#ff914d",
          500: "#da5300",
          600: "#9b3b00",
          700: "#622500",
          800: "#220d00",
        },
      },
    },
  },
  plugins: [],
};
