/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        fruit: {
          red: "#ff6b6b",
          yellow: "#ffd93d",
          green: "#4facfe",
          orange: "#ff9f43",
          purple: "#a55eea",
        },
      },
      animation: {
        "bounce-slow": "bounce 3s linear infinite",
      },
    },
  },
  plugins: [],
};
