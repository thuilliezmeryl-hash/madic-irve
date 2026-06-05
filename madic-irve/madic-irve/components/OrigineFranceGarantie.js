/**
 * Reproduction vectorielle du label "Origine France Garantie".
 * Cercle avec texte courbé ORIGINE / FRANCE® / GARANTIE et rubans tricolores
 * en diagonale (bleu #0055A4, blanc, rouge #EF4135). Usage légitime MADIC (label détenu).
 */
export default function OrigineFranceGarantie({ className = "" }) {
  return (
    <svg viewBox="0 0 240 240" className={className} role="img" aria-label="Label Origine France Garantie">
      <defs>
        <path id="ofg-top" d="M 56 120 A 64 64 0 0 1 184 120" fill="none" />
        <path id="ofg-bottom" d="M 60 120 A 60 60 0 0 0 180 120" fill="none" />
      </defs>

      {/* Rubans tricolores en diagonale, en coin (hors zone texte) */}
      <g>
        <polygon points="168,2 188,2 212,38 192,38" fill="#0055A4" />
        <polygon points="188,2 208,2 232,38 212,38" fill="#ffffff" stroke="#e4e4e4" strokeWidth="0.5" />
        <polygon points="208,2 228,2 252,38 232,38" fill="#EF4135" />

        <polygon points="12,202 32,202 56,238 36,238" fill="#0055A4" />
        <polygon points="32,202 52,202 76,238 56,238" fill="#ffffff" stroke="#e4e4e4" strokeWidth="0.5" />
        <polygon points="52,202 72,202 96,238 76,238" fill="#EF4135" />
      </g>

      {/* Texte courbé haut : ORIGINE */}
      <text fill="#2b2b2b" fontSize="17" fontWeight="700" letterSpacing="2.5" fontFamily="Montserrat, sans-serif">
        <textPath href="#ofg-top" startOffset="50%" textAnchor="middle">ORIGINE</textPath>
      </text>

      {/* Bloc central FRANCE */}
      <line x1="64" y1="106" x2="176" y2="106" stroke="#2b2b2b" strokeWidth="2.5" />
      <text x="120" y="138" textAnchor="middle" fill="#2b2b2b" fontSize="38" fontWeight="800" fontFamily="Montserrat, sans-serif" letterSpacing="1">FRANCE</text>
      <text x="182" y="110" fill="#2b2b2b" fontSize="11" fontWeight="700" fontFamily="Montserrat, sans-serif">®</text>
      <line x1="64" y1="150" x2="176" y2="150" stroke="#2b2b2b" strokeWidth="2.5" />

      {/* Texte courbé bas : GARANTIE */}
      <text fill="#2b2b2b" fontSize="16" fontWeight="700" letterSpacing="2.5" fontFamily="Montserrat, sans-serif">
        <textPath href="#ofg-bottom" startOffset="50%" textAnchor="middle">GARANTIE</textPath>
      </text>
    </svg>
  );
}
