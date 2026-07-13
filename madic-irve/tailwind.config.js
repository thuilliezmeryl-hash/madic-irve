/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ---- Couche 1 : primitives — charte graphique MADIC group (V4 - 2024) ----
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
        // ---- Couche 2 : sémantique (rôle) — adossée aux variables CSS de globals.css ----
        // Utiliser text-primary / bg-success / border-default plutôt que la teinte de marque.
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
        },
        danger: "var(--color-danger)",
        success: "var(--color-success)",
        accent: "var(--color-accent)",
        surface: {
          DEFAULT: "var(--color-surface)",
          inverse: "var(--color-surface-inverse)",
        },
        content: {
          DEFAULT: "var(--color-text)",
          muted: "var(--color-text-muted)",
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
