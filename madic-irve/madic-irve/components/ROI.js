import { Icons } from "./icons";

const kpis = [
  { icon: Icons.euro, value: "Coût/km", title: "Réduction du coût au kilomètre", desc: "L'électrique réduit significativement le coût d'usage par rapport au thermique." },
  { icon: Icons.bolt, value: "Optimisé", title: "Optimisation énergétique", desc: "Pilotage de charge et autoconsommation pour maîtriser la facture." },
  { icon: Icons.building, value: "+ valeur", title: "Valorisation immobilière", desc: "Un parc équipé IRVE valorise vos actifs immobiliers tertiaires." },
  { icon: Icons.users, value: "Marque employeur", title: "Attractivité employeur", desc: "Un service attendu par les collaborateurs et visiteurs." },
  { icon: Icons.shield, value: "Conforme", title: "Conformité réglementaire", desc: "Anticipez les obligations IRVE et loi LOM sur vos parkings." },
];

export default function ROI() {
  return (
    <section id="roi" className="scroll-mt-24 bg-[#fafbfc] py-20 md:py-28" aria-labelledby="roi-title">
      <div className="mx-auto max-w-content px-5 md:px-8">
        <div className="reveal max-w-2xl">
          <p className="section-label text-madic-red">Retour sur investissement</p>
          <h2 id="roi-title" className="mt-3 text-3xl font-extrabold tracking-tight text-[#16202c] md:text-4xl">
            Un investissement qui travaille pour vous
          </h2>
          <p className="mt-4 text-madic-grey-dark">
            Au-delà de la recharge, votre infrastructure IRVE génère de la valeur sur l'ensemble
            de votre organisation.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {kpis.map((k, i) => {
            const Icon = k.icon;
            const wide = i === 4;
            return (
              <div
                key={k.title}
                className={`reveal group relative overflow-hidden rounded-2xl border border-madic-grey/25 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  wide ? "lg:col-span-1" : ""
                }`}
              >
                <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-madic-red/5 transition-transform group-hover:scale-150" />
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-madic-red/8 text-madic-red">
                  <Icon />
                </span>
                <p className="relative mt-5 text-xs font-bold uppercase tracking-wider text-madic-red">{k.value}</p>
                <h3 className="relative mt-1 text-lg font-bold text-[#16202c]">{k.title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-madic-grey-dark">{k.desc}</p>
              </div>
            );
          })}

          {/* CTA cell */}
          <div className="reveal flex flex-col justify-center rounded-2xl bg-madic-red p-7 text-white shadow-xl shadow-madic-red/25">
            <h3 className="text-xl font-extrabold leading-tight">Estimez votre projet</h3>
            <p className="mt-2 text-sm text-white/85">
              Nos experts évaluent gratuitement votre potentiel d'économies.
            </p>
            <a
              href="#contact"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-madic-red transition-transform hover:scale-[1.03]"
            >
              Obtenir mon étude gratuite
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
