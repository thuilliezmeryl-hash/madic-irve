const partners = [
  "Gendarmerie Nationale", "Police Nationale", "Freshmile", "La Poste",
  "Sixt", "SNCF", "Keolis", "STEF", "Dachser", "Mercedes-Benz",
  "Stellantis", "Toyota", "TotalEnergies", "Fastned", "Certas Energy",
  "Electra", "Eni", "Repsol", "BP",
  "Atlante", "Zunder", "Auchan", "Intermarché", "Carrefour", "Super U", "Avia",
];

function PartnerCard({ name }) {
  return (
    <div className="group flex h-20 items-center justify-center rounded-xl border border-madic-grey/30 bg-white px-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-madic-red/40 hover:shadow-lg">
      <span className="text-sm font-bold tracking-tight text-madic-grey-dark transition-colors group-hover:text-madic-red">
        {name}
      </span>
    </div>
  );
}

export default function Partners() {
  return (
    <section className="bg-white py-16 md:py-20" aria-labelledby="partners-title">
      <div className="mx-auto max-w-content px-5 md:px-8">
        <div className="reveal text-center">
          <p className="section-label text-madic-red">Confiance &amp; références</p>
          <h2 id="partners-title" className="mt-3 text-3xl font-extrabold tracking-tight text-[#16202c] md:text-4xl">
            Ils nous font confiance
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-madic-grey-dark">
            Flottes publiques, transporteurs, énergéticiens et constructeurs s'appuient
            sur MADIC pour équiper et exploiter leurs infrastructures de recharge.
          </p>
        </div>

        <div className="reveal mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {partners.map((p) => (
            <PartnerCard key={p} name={p} />
          ))}
        </div>
      </div>

      {/* Bandeau défilant */}
      <div className="relative mt-12 overflow-hidden border-y border-madic-grey/20 bg-[#f6f7f9] py-4">
        <div className="flex w-max animate-marquee gap-12 px-6" aria-hidden="true">
          {[...partners, ...partners].map((p, i) => (
            <span key={i} className="whitespace-nowrap text-sm font-semibold uppercase tracking-wider text-madic-grey-dark/70">
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
