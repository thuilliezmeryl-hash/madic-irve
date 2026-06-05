/** Représentations vectorielles des bornes MADIC, une silhouette par gamme. */

function Screen({ x, y, w, h, color = "#d70926" }) {
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx="4" fill="#0a1422" />
      <rect x={x + 4} y={y + 4} width={w - 8} height={h * 0.4} rx="2" fill={color} opacity="0.85" />
    </>
  );
}

export function WalBoxArt() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      <rect x="60" y="40" width="80" height="100" rx="14" fill="#e9edf1" stroke="#afb6bd" strokeWidth="2" />
      <rect x="60" y="40" width="80" height="22" rx="14" fill="#d70926" />
      <Screen x={78} y={74} w={44} h={36} />
      <circle cx="100" cy="124" r="7" fill="none" stroke="#808b94" strokeWidth="2.5" />
      <path d="M100 131 C 130 150, 140 120, 150 150" fill="none" stroke="#808b94" strokeWidth="4" strokeLinecap="round" />
      <circle cx="150" cy="152" r="6" fill="#13203a" />
    </svg>
  );
}

export function DualArt() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      <rect x="74" y="28" width="52" height="148" rx="12" fill="#e9edf1" stroke="#afb6bd" strokeWidth="2" />
      <rect x="74" y="28" width="52" height="20" rx="12" fill="#d70926" />
      <Screen x={84} y={58} w={32} h={26} />
      <circle cx="90" cy="104" r="5" fill="none" stroke="#808b94" strokeWidth="2" />
      <circle cx="110" cy="104" r="5" fill="none" stroke="#808b94" strokeWidth="2" />
      <path d="M90 110 C 56 130, 50 150, 56 168" fill="none" stroke="#808b94" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M110 110 C 144 130, 150 150, 144 168" fill="none" stroke="#808b94" strokeWidth="3.5" strokeLinecap="round" />
      {/* badge MID */}
      <rect x="84" y="138" width="32" height="14" rx="3" fill="#002653" />
    </svg>
  );
}

export function FastArt() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      <rect x="62" y="22" width="76" height="156" rx="14" fill="#13203a" stroke="#34568c" strokeWidth="2" />
      <rect x="62" y="22" width="76" height="10" rx="14" fill="#d70926" />
      <Screen x={76} y={44} w={48} h={40} color="#2bd07a" />
      <rect x="80" y="96" width="40" height="6" rx="3" fill="#34568c" />
      <circle cx="84" cy="120" r="6" fill="none" stroke="#afb6bd" strokeWidth="2.5" />
      <circle cx="116" cy="120" r="6" fill="none" stroke="#afb6bd" strokeWidth="2.5" />
      <path d="M84 126 C 50 146, 46 164, 54 176" fill="none" stroke="#808b94" strokeWidth="4" strokeLinecap="round" />
      <path d="M116 126 C 150 146, 154 164, 146 176" fill="none" stroke="#808b94" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function HpcArt() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      <rect x="50" y="16" width="100" height="166" rx="16" fill="#0a1422" stroke="#34568c" strokeWidth="2" />
      <rect x="50" y="16" width="100" height="10" rx="16" fill="#d70926" />
      <Screen x={66} y={36} w={68} h={52} color="#2bd07a" />
      {/* indicateurs puissance */}
      <g fill="#2bd07a">
        <rect x="70" y="100" width="60" height="4" rx="2" opacity="0.9" />
        <rect x="70" y="110" width="44" height="4" rx="2" opacity="0.6" />
      </g>
      <circle cx="74" cy="134" r="7" fill="none" stroke="#afb6bd" strokeWidth="3" />
      <circle cx="126" cy="134" r="7" fill="none" stroke="#afb6bd" strokeWidth="3" />
      <path d="M74 141 C 34 162, 30 178, 40 188" fill="none" stroke="#808b94" strokeWidth="5" strokeLinecap="round" />
      <path d="M126 141 C 166 162, 170 178, 160 188" fill="none" stroke="#808b94" strokeWidth="5" strokeLinecap="round" />
      <text x="100" y="70" textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff">400</text>
      <text x="100" y="82" textAnchor="middle" fontSize="7" fill="#2bd07a">kW</text>
    </svg>
  );
}

export const productArt = {
  walbox: WalBoxArt,
  dual: DualArt,
  fast: FastArt,
  hpc: HpcArt,
  powerunit: PowerUnitArt,
};

export function PowerUnitArt() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      {/* Power Unit centrale (armoire de puissance) */}
      <rect x="22" y="40" width="58" height="130" rx="10" fill="#0a1422" stroke="#34568c" strokeWidth="2" />
      <rect x="22" y="40" width="58" height="9" rx="10" fill="#d70926" />
      <Screen x={32} y={58} w={38} h={30} color="#2bd07a" />
      <g fill="#2bd07a">
        <rect x="32" y="96" width="38" height="3" rx="1.5" opacity="0.9" />
        <rect x="32" y="103" width="28" height="3" rx="1.5" opacity="0.6" />
        <rect x="32" y="110" width="34" height="3" rx="1.5" opacity="0.5" />
      </g>
      <text x="51" y="140" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff">720</text>
      <text x="51" y="151" textAnchor="middle" fontSize="6" fill="#2bd07a">kW</text>

      {/* Satellites (bornes de distribution reliées) */}
      <rect x="116" y="56" width="30" height="50" rx="6" fill="#13203a" stroke="#34568c" strokeWidth="1.5" />
      <rect x="116" y="56" width="30" height="6" rx="6" fill="#d70926" />
      <Screen x={122} y={68} w={18} h={14} color="#2bd07a" />

      <rect x="116" y="120" width="30" height="50" rx="6" fill="#13203a" stroke="#34568c" strokeWidth="1.5" />
      <rect x="116" y="120" width="30" height="6" rx="6" fill="#d70926" />
      <Screen x={122} y={132} w={18} h={14} color="#2bd07a" />

      {/* Liaisons power unit -> satellites */}
      <path d="M80 90 C 98 90, 100 80, 116 80" fill="none" stroke="#d70926" strokeWidth="3" strokeLinecap="round" />
      <path d="M80 120 C 98 120, 100 144, 116 144" fill="none" stroke="#d70926" strokeWidth="3" strokeLinecap="round" />

      {/* Câbles de recharge satellites */}
      <path d="M146 96 C 168 100, 172 112, 164 122" fill="none" stroke="#808b94" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M146 160 C 168 164, 172 150, 164 140" fill="none" stroke="#808b94" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
