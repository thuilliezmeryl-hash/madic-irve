/** Scène vectorielle premium : parking entreprise sous ombrières photovoltaïques,
 *  bornes de recharge MADIC et véhicule électrique. 100% SVG, sans dépendance externe.
 *  Palette charte : rouge MADIC, gris, bleu nuit corporate.
 */
export default function HeroVisual({ className = "" }) {
  return (
    <svg viewBox="0 0 640 520" className={className} role="img"
      aria-label="Parking d'entreprise équipé d'ombrières photovoltaïques, de bornes de recharge MADIC et d'un véhicule électrique">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a1a33" />
          <stop offset="0.55" stopColor="#10325c" />
          <stop offset="1" stopColor="#0a1422" />
        </linearGradient>
        <linearGradient id="pv" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1b3a6b" />
          <stop offset="1" stopColor="#0c1f3d" />
        </linearGradient>
        <linearGradient id="car" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e9edf1" />
          <stop offset="1" stopColor="#afb6bd" />
        </linearGradient>
        <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d70926" stopOpacity="0.9" />
          <stop offset="1" stopColor="#d70926" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffd9a0" stopOpacity="0.7" />
          <stop offset="1" stopColor="#ffd9a0" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ciel */}
      <rect width="640" height="520" rx="20" fill="url(#sky)" />
      <circle cx="500" cy="120" r="150" fill="url(#sun)" />

      {/* Skyline tertiaire en arrière-plan */}
      <g opacity="0.4" fill="#1b3056">
        <rect x="40" y="150" width="40" height="160" />
        <rect x="90" y="120" width="30" height="190" />
        <rect x="540" y="130" width="46" height="180" />
        <rect x="596" y="170" width="30" height="140" />
      </g>
      <g opacity="0.5" fill="#2a4a7a">
        {Array.from({ length: 7 }).map((_, i) => (
          <rect key={i} x={48 + (i % 4) * 9} y={160 + (i % 3) * 22} width="4" height="6" />
        ))}
      </g>

      {/* Ombrière photovoltaïque (canopée inclinée) */}
      <g>
        <path d="M70 200 L470 165 L470 188 L70 223 Z" fill="url(#pv)" stroke="#3a5d96" strokeWidth="1.5" />
        {/* Cellules PV */}
        {Array.from({ length: 11 }).map((_, c) =>
          Array.from({ length: 3 }).map((_, r) => (
            <rect
              key={`${c}-${r}`}
              x={80 + c * 35}
              y={196 + r * 9 - c * 0.6}
              width="30"
              height="7"
              transform={`skewY(-5)`}
              fill="#0e2747"
              stroke="#34568c"
              strokeWidth="0.6"
              opacity="0.9"
            />
          ))
        )}
        {/* Poteaux */}
        <rect x="92" y="222" width="10" height="170" fill="#808b94" />
        <rect x="440" y="186" width="10" height="206" fill="#808b94" />
        <rect x="266" y="204" width="9" height="184" fill="#8f99a2" />
      </g>

      {/* Sol / parking */}
      <rect x="0" y="392" width="640" height="128" fill="#10182a" />
      <rect x="0" y="392" width="640" height="4" fill="#1d2a44" />
      {/* Marquage places */}
      <g stroke="#3a4a66" strokeWidth="2" opacity="0.7">
        <line x1="120" y1="404" x2="100" y2="500" />
        <line x1="210" y1="404" x2="200" y2="500" />
        <line x1="300" y1="404" x2="300" y2="500" />
        <line x1="430" y1="404" x2="450" y2="500" />
      </g>

      {/* Bornes de recharge MADIC */}
      <g>
        {/* Borne 1 */}
        <rect x="500" y="300" width="46" height="104" rx="8" fill="#13203a" stroke="#34568c" strokeWidth="1.5" />
        <rect x="508" y="312" width="30" height="40" rx="4" fill="#0a1422" />
        <rect x="511" y="316" width="24" height="14" rx="2" fill="#d70926" opacity="0.85" />
        <circle cx="523" cy="366" r="6" fill="none" stroke="#afb6bd" strokeWidth="2" />
        <path d="M523 372 C 560 380, 568 350, 588 360" fill="none" stroke="#808b94" strokeWidth="3" strokeLinecap="round" />
        {/* Borne 2 */}
        <rect x="560" y="312" width="40" height="92" rx="8" fill="#13203a" stroke="#34568c" strokeWidth="1.5" />
        <rect x="567" y="322" width="26" height="34" rx="4" fill="#0a1422" />
        <rect x="570" y="326" width="20" height="11" rx="2" fill="#2bd07a" opacity="0.85" />
      </g>

      {/* Véhicule électrique */}
      <g>
        <path
          d="M150 388
             C 158 360, 178 348, 214 346
             L 300 346
             C 332 346, 350 356, 366 380
             L 392 388
             C 400 390, 402 398, 402 404
             L 150 404
             C 148 398, 148 392, 150 388 Z"
          fill="url(#car)"
        />
        {/* Vitres */}
        <path d="M205 360 C 215 351, 235 350, 258 350 L 296 350 C 318 350, 332 358, 344 372 L 305 372 L 215 372 Z"
          fill="#13203a" opacity="0.85" />
        <line x1="276" y1="350" x2="276" y2="372" stroke="#afb6bd" strokeWidth="1.5" />
        {/* Bas de caisse + accent rouge */}
        <rect x="150" y="398" width="252" height="6" fill="#808b94" />
        <rect x="150" y="398" width="60" height="6" fill="#d70926" />
        {/* Roues */}
        <circle cx="206" cy="404" r="20" fill="#0a1422" />
        <circle cx="206" cy="404" r="9" fill="#2a3a55" />
        <circle cx="350" cy="404" r="20" fill="#0a1422" />
        <circle cx="350" cy="404" r="9" fill="#2a3a55" />
        {/* Câble de recharge reliant la borne */}
        <path d="M402 392 C 460 392, 470 372, 500 366" fill="none" stroke="#d70926" strokeWidth="3.5" strokeLinecap="round" />
        {/* Phare */}
        <ellipse cx="158" cy="382" rx="6" ry="3" fill="#fff7e6" opacity="0.9" />
      </g>

      {/* Halo lumineux au sol */}
      <rect x="120" y="404" width="300" height="40" fill="url(#glow)" opacity="0.25" />

      {/* Lignes data décoratives (datalisation) */}
      <g opacity="0.5">
        <circle cx="470" cy="165" r="3" fill="#d70926" />
        <circle cx="546" cy="300" r="3" fill="#2bd07a" />
        <path d="M470 165 L546 300" stroke="#34568c" strokeWidth="1" strokeDasharray="3 4" />
      </g>
    </svg>
  );
}
