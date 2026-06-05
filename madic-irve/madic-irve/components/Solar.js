import { Chevron, Icons } from "./icons";

const points = [
  "Ombrières photovoltaïques",
  "Autoconsommation",
  "Stockage par batterie sur site",
  "Réinjection réseau",
  "Pilotage énergétique",
  "Réduction des coûts d'exploitation",
];

function FlowDiagram() {
  const steps = [
    { label: "Panneaux solaires", sub: "Ombrières PV", icon: Icons.solar },
    { label: "Production", sub: "Énergie verte", icon: Icons.bolt },
    { label: "Stockage", sub: "Batterie sur site", icon: Icons.battery },
    { label: "Bornes", sub: "Recharge IRVE", icon: Icons.install },
    { label: "Véhicules", sub: "Flotte électrique", icon: Icons.fleet },
  ];
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm md:p-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-stretch">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="flex flex-1 items-center gap-3 md:flex-col md:gap-3 md:text-center">
              <div className="flex flex-1 flex-col items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 md:flex-1">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-madic-red/15 text-madic-red">
                  <Icon />
                </span>
                <div>
                  <p className="text-sm font-bold text-white">{s.label}</p>
                  <p className="text-xs text-white/50">{s.sub}</p>
                </div>
              </div>
              {i < steps.length - 1 && (
                <svg className="h-6 w-6 shrink-0 rotate-90 text-madic-red md:rotate-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Solar() {
  return (
    <section id="photovoltaique" className="scroll-mt-24 relative overflow-hidden bg-madic-ink grain py-20 md:py-28" aria-labelledby="solar-title">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#0c1f3d] via-[#0a1422] to-[#0a1a33]" />
      <div className="pointer-events-none absolute -left-20 top-10 h-96 w-96 rounded-full bg-madic-red/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-content grid-cols-1 items-center gap-12 px-5 md:px-8 lg:grid-cols-2">
        <div className="reveal">
          <p className="section-label text-madic-red">Énergie &amp; recharge</p>
          <h2 id="solar-title" className="mt-3 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            Production solaire, stockage et recharge
          </h2>
          <p className="mt-4 max-w-lg text-white/70">
            Couvrez vos parkings d'ombrières photovoltaïques et alimentez vos bornes
            avec votre propre énergie. Autoconsommez, stockez l'énergie produite et pilotez
            l'ensemble pour réduire durablement vos coûts.
          </p>

          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {points.map((p) => (
              <li key={p} className="flex items-center gap-2 text-sm font-medium text-white/85">
                <Chevron className="h-4 w-4 shrink-0" />
                {p}
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-madic-red/15 text-madic-red">
                <Icons.battery />
              </span>
              <p className="text-sm font-bold text-white">Stockage d'énergie sur site</p>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Stockez par batterie l'énergie solaire non consommée pour la restituer au
              moment voulu : vers vos bornes de recharge lors des pics de demande, ou vers
              votre bâtiment, vos bureaux et votre magasin. Vous maximisez votre
              autoconsommation et lissez votre puissance souscrite.
            </p>
          </div>
        </div>

        <div className="reveal">
          <FlowDiagram />
        </div>
      </div>
    </section>
  );
}
