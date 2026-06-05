import { productArt } from "./ProductArt";
import { Chevron } from "./icons";

const products = [
  {
    art: "walbox",
    name: "WalBox",
    tag: "Recharge AC",
    power: "7 à 22 kW",
    features: ["Recharge AC", "7 à 22 kW", "Bureaux", "Parkings collaborateurs"],
    benefit: "La solution idéale pour équiper les places de stationnement collaborateurs, simple à installer et à superviser.",
  },
  {
    art: "dual",
    name: "22GL",
    tag: "Recharge AC · Double point",
    power: "2 × 22 kW",
    features: ["Recharge AC", "Double point de charge", "Gestion RFID", "Comptage MID"],
    benefit: "Deux véhicules rechargés simultanément, avec comptage certifié MID et contrôle d'accès par badge.",
  },
  {
    art: "fast",
    name: "Pulse 20-80",
    tag: "Recharge rapide DC",
    power: "20 à 80 kW",
    features: ["Recharge rapide DC", "20 à 80 kW", "Flottes professionnelles", "Utilitaires"],
    benefit: "Pensée pour les flottes et utilitaires qui ne peuvent pas attendre : recharge rapide en courant continu.",
    featured: false,
  },
  {
    art: "hpc",
    name: "Pulse 400",
    tag: "Recharge ultra-rapide DC",
    power: "Jusqu'à 400 kW",
    features: ["Recharge ultra rapide", "Jusqu'à 400 kW", "Hubs de recharge", "Stations-service", "Fort trafic"],
    benefit: "La puissance HPC pour les hubs de recharge et stations à fort trafic. Quelques minutes suffisent.",
    featured: true,
  },
];

function ProductCard({ p }) {
  const Art = productArt[p.art];
  return (
    <article
      className={`reveal group relative flex flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${
        p.featured ? "border-madic-red/50 shadow-xl ring-1 ring-madic-red/20" : "border-madic-grey/30 shadow-sm"
      }`}
    >
      {p.featured && (
        <span className="absolute right-4 top-4 z-10 rounded-full bg-madic-red px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
          Le plus puissant
        </span>
      )}

      <div className="relative h-52 overflow-hidden bg-gradient-to-b from-[#f6f7f9] to-[#eaedf1]">
        <div className="absolute inset-0 grain opacity-40" />
        <div className="relative mx-auto h-full w-40 transition-transform duration-500 group-hover:scale-105">
          <Art />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-madic-red">{p.tag}</p>
        <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-[#16202c]">{p.name}</h3>
        <p className="mt-1 text-sm font-bold text-madic-grey-dark">{p.power}</p>

        <ul className="mt-4 space-y-2">
          {p.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-[#3a4654]">
              <Chevron className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {f}
            </li>
          ))}
        </ul>

        <p className="mt-4 flex-1 text-sm leading-relaxed text-madic-grey-dark">{p.benefit}</p>

        <a
          href="#contact"
          className={`mt-6 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition-all ${
            p.featured
              ? "bg-madic-red text-white hover:bg-madic-red-dark"
              : "border border-madic-grey/40 text-[#16202c] hover:border-madic-red hover:text-madic-red"
          }`}
        >
          Demander un devis
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </a>
      </div>
    </article>
  );
}

export default function Products() {
  return (
    <section id="solutions" className="scroll-mt-24 bg-[#fafbfc] py-20 md:py-28" aria-labelledby="products-title">
      <div className="mx-auto max-w-content px-5 md:px-8">
        <div className="reveal max-w-2xl">
          <p className="section-label text-madic-red">Nos gammes</p>
          <h2 id="products-title" className="mt-3 text-3xl font-extrabold tracking-tight text-[#16202c] md:text-4xl">
            Une borne adaptée à chaque usage
          </h2>
          <p className="mt-4 text-madic-grey-dark">
            De la recharge lente sur parking collaborateurs à l'ultra-rapide pour hubs à fort trafic,
            les solutions MADIC couvrent tous les besoins professionnels.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.name} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
