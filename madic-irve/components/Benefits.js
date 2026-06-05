import { benefitIcons } from "./icons";
import OrigineFranceGarantie from "./OrigineFranceGarantie";

const benefits = [
  { title: "Étude énergétique", desc: "Dimensionnement et analyse de votre site avant tout déploiement." },
  { title: "Installation clé en main", desc: "Génie civil, raccordement, mise en service par nos équipes." },
  { title: "Maintenance nationale", desc: "Un réseau d'agences pour intervenir partout en France." },
  { title: "Supervision intelligente", desc: "Pilotage temps réel via protocole OCPP." },
  { title: "Gestion des utilisateurs", desc: "Accès par badge RFID, droits et profils paramétrables." },
  { title: "Facturation automatisée", desc: "Refacturation et reporting sans saisie manuelle." },
  { title: "Conformité réglementaire", desc: "Comptage MID, normes IRVE et obligations respectées." },
  { title: "Accompagnement Advenir", desc: "Optimisation de vos subventions et primes à l'installation." },
];

function BenefitCard({ title, desc, index }) {
  const Icon = benefitIcons[title];
  return (
    <div
      className="reveal group relative overflow-hidden rounded-2xl border border-madic-grey/25 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-madic-red/30 hover:shadow-xl"
      style={{ transitionDelay: `${(index % 4) * 60}ms` }}
    >
      <span className="absolute right-4 top-4 text-5xl font-extrabold text-madic-grey/15 transition-colors group-hover:text-madic-red/15">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="relative inline-flex h-14 w-14 items-center justify-center rounded-xl bg-madic-red/8 text-madic-red transition-colors group-hover:bg-madic-red group-hover:text-white">
        {Icon && <Icon />}
      </div>
      <h3 className="relative mt-5 text-lg font-bold text-[#16202c]">{title}</h3>
      <p className="relative mt-2 text-sm leading-relaxed text-madic-grey-dark">{desc}</p>
    </div>
  );
}

export default function Benefits() {
  return (
    <section id="benefices" className="scroll-mt-24 bg-white py-20 md:py-28" aria-labelledby="benefits-title">
      <div className="mx-auto max-w-content px-5 md:px-8">
        <div className="reveal flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <p className="section-label text-madic-red">Notre valeur ajoutée</p>
            <h2 id="benefits-title" className="mt-3 text-3xl font-extrabold tracking-tight text-[#16202c] md:text-4xl">
              Pourquoi choisir MADIC ?
            </h2>
            <p className="mt-4 text-madic-grey-dark">
              Un interlocuteur unique pour l'ensemble du cycle de vie de votre infrastructure,
              de l'étude initiale à l'exploitation quotidienne. Nos bornes sont conçues et
              fabriquées en France, labellisées Origine France Garantie.
            </p>
          </div>
          <div className="shrink-0">
            <OrigineFranceGarantie className="h-32 w-32 md:h-40 md:w-40" />
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b, i) => (
            <BenefitCard key={b.title} {...b} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
