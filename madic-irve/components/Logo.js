/**
 * Logo MADIC group reconstruit en SVG vectoriel d'après la charte graphique.
 * Symbole : hexagone (gris) + 3 chevrons / fléchon (rouge), suivi du wordmark "MADIC group".
 * Respecte les couleurs officielles : gris #afb6bd/#808b94, rouge #d70926/#ae1022.
 * variant: "color" (quadricolor) | "white" | "red"
 */
export default function Logo({ variant = "color", showWordmark = true, className = "" }) {
  const isWhite = variant === "white";
  const isRed = variant === "red";

  const hexLight = isWhite ? "#ffffff" : isRed ? "#d70926" : "#afb6bd";
  const hexDark = isWhite ? "#e9edf1" : isRed ? "#ae1022" : "#808b94";
  const chevLight = isWhite ? "#ffffff" : "#d70926";
  const chevDark = isWhite ? "#cfd6dd" : "#ae1022";
  const wordColor = isWhite ? "#ffffff" : "#1b1b1b";
  const baseColor = isWhite ? "#ffffff" : "#d70926";

  return (
    <span className={`inline-flex items-center gap-3 ${className}`} aria-label="MADIC group">
      <svg
        viewBox="0 0 100 100"
        className="h-full w-auto shrink-0"
        role="img"
        aria-hidden="true"
        style={{ height: "1em", minHeight: 28 }}
      >
        {/* Hexagone — deux facettes pour le volume */}
        <path d="M50 6 L86 27 L86 73 L50 94 L14 73 L14 27 Z" fill={hexLight} />
        <path d="M50 6 L86 27 L50 50 L14 27 Z" fill={hexDark} opacity="0.55" />
        <path d="M14 73 L50 50 L86 73 L50 94 Z" fill={hexDark} opacity="0.35" />
        {/* Découpe centrale (ouverture du symbole) */}
        <path d="M50 24 L72 50 L50 76 L42 76 L60 50 L42 24 Z" fill="#ffffff" />
        {/* Chevron / fléchon rouge */}
        <path d="M40 30 L62 50 L40 70 L31 70 L51 50 L31 30 Z" fill={chevLight} />
        <path d="M40 30 L51 50 L40 70 L36 70 L45 50 L36 30 Z" fill={chevDark} />
      </svg>

      {showWordmark && (
        <span className="flex flex-col leading-none" style={{ height: "1em", minHeight: 28 }}>
          <span
            className="font-extrabold tracking-tight"
            style={{ color: wordColor, fontSize: "0.95em", letterSpacing: "-0.01em" }}
          >
            MADIC
          </span>
          <span
            className="font-medium"
            style={{ color: baseColor, fontSize: "0.42em", letterSpacing: "0.04em", marginTop: "0.05em" }}
          >
            group
          </span>
        </span>
      )}
    </span>
  );
}
