/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#050505",
        graphite: "#121212",
        panel: "#191919",
        line: "#2A2A2A",
        bone: "#F6F1E8",
        muted: "#A6A29A",
        clear: "#2DD47F",
        attention: "#F2C94C",
        elevated: "#F2994A",
        critical: "#EB5757",
      },
      boxShadow: {
        glow: "0 0 60px rgba(45, 212, 127, 0.08)",
      },
    },
  },
  plugins: [],
};
