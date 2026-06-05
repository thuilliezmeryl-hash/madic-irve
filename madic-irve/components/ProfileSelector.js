import Link from "next/link";
import { Icons } from "./icons";

const paths = [
  {
    href: "/parking-public",
    icon: Icons.building,
    label: "Parking recevant du public",
    sub: "Supermarchés, retail, centres commerciaux, parkings ouverts au public",
    cta: "Voir les solutions parking public",
  },
  {
    href: "/parking-prive-flotte",
    icon: Icons.fleet,
    label: "Parking privatif & flotte d'entreprise",
    sub: "Parkings collaborateurs, dépôts, flottes de véhicules de fonction et de service",
    cta: "Voir les solutions privatif & flotte",
  },
];

export default function ProfileSelector() {
  return (
    <section
      id="profils"
      className="scroll-mt-24 bg-white py-16 md:py-20"
      aria-labelledby="profils-title"
    >
      <div className="mx-auto max-w-content px-5 md:px-8">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="section-label text-madic-red">Par où commencer</p>
          <h2 id="profils-title" className="mt-3 text-3xl font-extrabold tracking-tight text-[#16202c] md:text-4xl">
            Quel est votre projet&nbsp;?
          </h2>
          <p className="mt-4 text-madic-grey-dark">
            Vos obligations et vos opportunités diffèrent selon que votre parking accueille
            du public ou qu'il est réservé à votre entreprise et à votre flotte. Choisissez
            votre profil pour un parcours adapté.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {paths.map((p) => {
            const Icon = p.icon;
            return (
              <Link
                key={p.href}
                href={p.href}
                className="reveal group relative flex flex-col overflow-hidden rounded-2xl border border-madic-grey/30 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-madic-red/40 hover:shadow-2xl"
              >
                <div className="absolute right-0 top-0 h-32 w-32 translate-x-10 -translate-y-10 rounded-full bg-madic-red/5 transition-transform duration-500 group-hover:scale-150" />
                <span className="relative inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-madic-red/8 text-madic-red transition-colors group-hover:bg-madic-red group-hover:text-white">
                  <Icon />
                </span>
                <h3 className="relative mt-6 text-2xl font-extrabold tracking-tight text-[#16202c]">
                  {p.label}
                </h3>
                <p className="relative mt-3 flex-1 text-madic-grey-dark">{p.sub}</p>
                <span className="relative mt-6 inline-flex items-center gap-2 font-bold text-madic-red">
                  {p.cta}
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
