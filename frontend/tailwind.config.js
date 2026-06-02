/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#0B0F19",
        cardBg: "rgba(20, 26, 43, 0.6)",
        borderGlass: "rgba(255, 255, 255, 0.08)",
        accentCyan: "#06B6D4",
        accentRose: "#F43F5E",
        accentEmerald: "#10B981",
        accentAmber: "#F59E0B",
        textPrimary: "#FFFFFF",
        textSecondary: "#94A3B8",
        textMuted: "#64748B",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        headings: ["Outfit", "sans-serif"],
      },
    },
  },
  plugins: [],
}
