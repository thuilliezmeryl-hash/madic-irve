/** Pictogrammes line-art inspirés des "pictos pros" de la charte MADIC.
 *  Style : trait fin, monochrome, hérité de la planche pictogrammes (p.25).
 */

export function Chevron({ className = "", color = "#d70926" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      {/* fléchon hexagonal MADIC en miniature */}
      <path d="M9 5 L17 12 L9 19 L6 19 L13 12 L6 5 Z" fill={color} />
    </svg>
  );
}

const base = "stroke-current";
const P = ({ children }) => (
  <svg viewBox="0 0 48 48" fill="none" className="h-9 w-9" strokeWidth="1.4"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);

export const Icons = {
  study: () => (<P><path className={base} d="M10 6h20l8 8v28H10z"/><path className={base} d="M30 6v8h8"/><path className={base} d="M16 24l5 5 8-10"/></P>),
  install: () => (<P><path className={base} d="M24 4l16 9v22l-16 9-16-9V13z"/><path className={base} d="M24 14v20M16 19l8 5 8-5"/></P>),
  maintenance: () => (<P><path className={base} d="M30 12a8 8 0 01-10 10L9 33a4 4 0 105 5l11-11a8 8 0 0010-10l-5 5-4-1-1-4z"/></P>),
  supervision: () => (<P><path className={base} d="M6 10h36v24H6z"/><path className={base} d="M6 40h36M14 26l6-7 5 5 9-11"/></P>),
  users: () => (<P><circle className={base} cx="18" cy="17" r="6"/><path className={base} d="M8 38c0-6 4-10 10-10s10 4 10 10"/><path className={base} d="M32 13a6 6 0 014 11M30 28c6 0 10 4 10 10"/></P>),
  billing: () => (<P><path className={base} d="M10 6h28v36l-5-3-5 3-4-3-5 3-4-3-5 3z"/><path className={base} d="M16 16h16M16 24h16M16 32h10"/></P>),
  compliance: () => (<P><path className={base} d="M24 4l16 6v12c0 11-7 18-16 22-9-4-16-11-16-22V10z"/><path className={base} d="M17 24l5 5 9-11"/></P>),
  advenir: () => (<P><path className={base} d="M26 4L10 26h12l-2 18 16-22H24z"/></P>),
  bolt: () => (<P><path className={base} d="M26 4L10 26h12l-2 18 16-22H24z"/></P>),
  fleet: () => (<P><path className={base} d="M6 30l3-10h22l5 6h6v8M6 30v6h4M44 30v6h-4"/><circle className={base} cx="14" cy="36" r="3"/><circle className={base} cx="36" cy="36" r="3"/></P>),
  solar: () => (<P><path className={base} d="M8 30l5-16h22l5 16zM6 30h36M18 14v16M30 14v16M12 22h24"/></P>),
  euro: () => (<P><circle className={base} cx="24" cy="24" r="18"/><path className={base} d="M30 16a8 8 0 100 16M14 22h12M14 27h12"/></P>),
  building: () => (<P><path className={base} d="M10 42V8h18v34M28 42V18h10v24M4 42h40"/><path className={base} d="M16 14h6M16 22h6M16 30h6"/></P>),
  shield: () => (<P><path className={base} d="M24 4l16 6v12c0 11-7 18-16 22-9-4-16-11-16-22V10z"/></P>),
  magnet: () => (<P><path className={base} d="M12 6v16a12 12 0 0024 0V6h-8v16a4 4 0 01-8 0V6z"/></P>),
  rfid: () => (<P><rect className={base} x="8" y="12" width="22" height="24" rx="3"/><path className={base} d="M36 16a10 10 0 010 16M40 12a16 16 0 010 24"/></P>),
};

export const benefitIcons = {
  "Étude énergétique": Icons.study,
  "Installation clé en main": Icons.install,
  "Maintenance nationale": Icons.maintenance,
  "Supervision intelligente": Icons.supervision,
  "Gestion des utilisateurs": Icons.users,
  "Facturation automatisée": Icons.billing,
  "Conformité réglementaire": Icons.compliance,
  "Accompagnement Advenir": Icons.advenir,
};
