import { Chevron } from "./icons";

const stats = [
  { value: "+50 ans", label: "d'expertise énergie" },
  { value: "France", label: "couverture nationale" },
  { value: "3 → 720 kW", label: "puissances de recharge" },
];

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-madic-ink grain pt-28 pb-16 md:pt-36 md:pb-24"
    >
      {/* Fond dégradé + maille hexagonale décorative */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1a33] via-[#0c1f3d] to-madic-ink" />
        <div className="absolute -right-32 top-0 h-[640px] w-[640px] rounded-full bg-madic-red/10 blur-3xl" />
        <div className="absolute left-0 top-1/3 h-[420px] w-[420px] rounded-full bg-madic-navy/40 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-content grid-cols-1 items-center gap-12 px-5 md:px-8 lg:grid-cols-[1.05fr_1fr]">
        {/* Colonne texte */}
        <div className="animate-fadeUp">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/80">
            <Chevron className="h-3 w-3" /> Mobilité électrique professionnelle
          </span>

          <h1 className="text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
            Déployez votre infrastructure de recharge{" "}
            <span className="relative whitespace-nowrap text-madic-red">
              clé en main
              <svg className="absolute -bottom-2 left-0 w-full" height="10" viewBox="0 0 300 10" preserveAspectRatio="none" aria-hidden="true">
                <path d="M2 7 Q150 0 298 6" stroke="#d70926" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/80">
            De l'étude énergétique à l'exploitation, MADIC accompagne les professionnels
            dans leur transition vers la mobilité électrique.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="/parking-public"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-madic-red px-7 py-4 text-base font-bold text-white shadow-xl shadow-madic-red/30 transition-all hover:scale-[1.03] hover:bg-madic-red-dark"
            >
              Parking recevant du public
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </a>
            <a
              href="/parking-prive-flotte"
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-7 py-4 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              Parking privatif &amp; flotte
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </a>
          </div>

          <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-white/10 pt-7">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="text-2xl font-extrabold text-white">{s.value}</dt>
                <dd className="mt-1 text-xs leading-snug text-white/55">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Colonne visuel */}
        <div className="animate-fadeIn [animation-delay:200ms]">
          <div className="relative">
            <div className="absolute -inset-3 rounded-[28px] bg-gradient-to-tr from-madic-red/20 to-transparent blur-xl" />
            <img
              src="/photos/hero-madic-irve.webp"
              alt="Ombrières photovoltaïques MADIC équipées de bornes de recharge, avec un véhicule électrique en charge"
              className="relative w-full rounded-3xl shadow-2xl ring-1 ring-white/10"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
