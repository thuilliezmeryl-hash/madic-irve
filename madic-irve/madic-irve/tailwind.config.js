/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Charte graphique MADIC group (V4 - 2024)
        madic: {
          red: "#d70926",      // Rouge MADIC (Couleur A / Pantone 186 CP)
          "red-dark": "#ae1022", // Rouge ombre chevron (Couleur B / Pantone 187 CP)
          grey: "#afb6bd",     // Gris MADIC (Couleur C / Pantone 429 CP)
          "grey-dark": "#808b94", // Gris ombre (Couleur D / Pantone 430 CP)
          black: "#000000",
          // Bleu nuit issu des templates corporate (note de synthèse / habillage)
          navy: "#002653",
          ink: "#0a1422",
        },
      },
      fontFamily: {
        // Typographie institutionnelle MADIC : Montserrat
        sans: ["var(--font-montserrat)", "Montserrat", "system-ui", "sans-serif"],
        display: ["var(--font-montserrat)", "Montserrat", "sans-serif"],
      },
      maxWidth: {
        content: "1240px",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both",
        fadeIn: "fadeIn 0.9s ease both",
        marquee: "marquee 32s linear infinite",
        shimmer: "shimmer 6s linear infinite",
      },
    },
  },
  plugins: [],
};
