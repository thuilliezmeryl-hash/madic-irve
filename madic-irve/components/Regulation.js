import { Chevron, Icons } from "./icons";

const volets = [
  {
    icon: Icons.building,
    title: "Parkings publics et parkings d'entreprise",
    intro:
      "La loi LOM impose l'équipement progressif des parkings en infrastructures de recharge.",
    points: [
      "Depuis le 1ᵉʳ janvier 2025, les bâtiments existants ouverts au public dotés d'un parking de plus de 20 places doivent avoir au moins 5 % de places équipées en recharge.",
      "Les bâtiments tertiaires existants doivent disposer d'au moins une borne par tranche de 20 places.",
      "Les parkings d'entreprise de plus de 20 places doivent atteindre 20 % de places pré-équipées, dont une accessible aux personnes à mobilité réduite.",
    ],
  },
  {
    icon: Icons.fleet,
    title: "Verdissement obligatoire des flottes",
    intro:
      "Au-delà d'un certain nombre de véhicules, votre flotte doit intégrer une part croissante de véhicules à faibles émissions.",
    points: [
      "Les entreprises détenant plus de 100 véhicules légers doivent intégrer 20 % de véhicules à faibles émissions dans le renouvellement de leur parc en 2025.",
      "Cette part monte à 40 % au 1ᵉʳ janvier 2027, puis 50 % en 2030.",
      "En cas de non-respect, la loi de finances 2025 prévoit une taxe annuelle incitative pouvant atteindre 5 000 € par véhicule manquant.",
    ],
    danger: true,
  },
  {
    icon: Icons.euro,
    title: "Le choix du véhicule et la liste ADEME",
    intro:
      "Le modèle de véhicule électrique attribué à un collaborateur a un impact fiscal direct, pour le salarié comme pour l'entreprise.",
    points: [
      "Depuis le 1ᵉʳ février 2025, l'avantage en nature d'un véhicule électrique de fonction bénéficie d'un abattement de 70 %, plafonné à 4 582 € par an, à la seule condition que le véhicule figure sur la liste ADEME (score environnemental minimal).",
      "Si le véhicule attribué ne figure pas sur cette liste, l'abattement ne s'applique pas et le véhicule est traité fiscalement comme un véhicule thermique.",
      "La conséquence est double : l'avantage en nature imposable du salarié augmente fortement, et l'entreprise supporte des cotisations patronales plus élevées.",
      "Le score environnemental est figé à la date de mise à disposition du véhicule. Un modèle qui obtient l'éligibilité plus tard ne récupère pas l'abattement.",
    ],
    danger: true,
  },
];

function Volet({ v }) {
  const Icon = v.icon;
  return (
    <article className="reveal flex flex-col rounded-2xl border border-madic-grey/25 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:p-7">
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${
            v.danger ? "bg-madic-red/8 text-madic-red" : "bg-madic-navy/8 text-madic-navy"
          }`}
        >
          <Icon />
        </span>
        <h3 className="text-lg font-bold leading-tight text-[#16202c]">{v.title}</h3>
      </div>

      <p className="mt-4 text-sm font-medium text-[#3a4654]">{v.intro}</p>

      <ul className="mt-4 space-y-3">
        {v.points.map((p, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-madic-grey-dark">
            <Chevron className="mt-1 h-3.5 w-3.5 shrink-0" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function Regulation() {
  return (
    <section
      id="reglementation"
      className="scroll-mt-24 bg-[#fafbfc] py-20 md:py-28"
      aria-labelledby="reg-title"
    >
      <div className="mx-auto max-w-content px-5 md:px-8">
        <div className="reveal max-w-2xl">
          <p className="section-label text-madic-red">Cadre légal · loi LOM</p>
          <h2 id="reg-title" className="mt-3 text-3xl font-extrabold tracking-tight text-[#16202c] md:text-4xl">
            Vos obligations réglementaires
          </h2>
          <p className="mt-4 text-madic-grey-dark">
            Qu'il s'agisse d'un parking accueillant du public, d'un parc de stationnement
            privatif ou d'une flotte de véhicules d'entreprise, les professionnels font face
            à des obligations qui se renforcent. Elles s'inscrivent dans le cadre de la loi
            LOM (Loi d'Orientation des Mobilités), complétée par la loi Climat et Résilience,
            la loi de finances 2025 et les arrêtés relatifs au score environnemental. MADIC
            vous accompagne sur le volet recharge de votre mise en conformité.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {volets.map((v) => (
            <Volet key={v.title} v={v} />
          ))}
        </div>

        {/* Bandeau CTA */}
        <div className="reveal relative mt-8 flex flex-col items-start justify-between gap-5 overflow-hidden rounded-2xl bg-madic-ink p-7 md:flex-row md:items-center md:p-8">
          <div className="relative max-w-xl">
            <h3 className="text-xl font-extrabold text-white">
              Besoin d'y voir clair sur votre mise en conformité ?
            </h3>
            <p className="mt-2 text-sm text-white/75">
              Nos experts évaluent gratuitement les obligations qui s'appliquent à votre site
              et dimensionnent l'infrastructure de recharge adaptée.
            </p>
          </div>
          <a
            href="#contact"
            className="relative inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-madic-red px-7 py-4 text-base font-bold text-white shadow-lg shadow-madic-red/25 transition-all hover:scale-[1.03] hover:bg-madic-red-dark"
          >
            Obtenir mon étude gratuite
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </a>
        </div>

        <p className="reveal mt-5 text-xs italic text-madic-grey-dark">
          Informations à jour en juin 2026, fournies à titre indicatif. Elles ne constituent
          pas un avis juridique et sont susceptibles d'évoluer selon votre situation.
        </p>
      </div>
    </section>
  );
}
