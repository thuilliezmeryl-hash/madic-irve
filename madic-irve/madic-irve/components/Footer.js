import Logo from "./Logo";
import { Chevron } from "./icons";

const columns = [
  {
    title: "Solutions",
    links: [
      { label: "Bornes AC WalBox", href: "#solutions" },
      { label: "Bornes AC 22GL", href: "#solutions" },
      { label: "Pulse 20-80 (DC)", href: "#solutions" },
      { label: "Pulse 400 (HPC)", href: "#solutions" },
      { label: "Photovoltaïque", href: "#photovoltaique" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Supervision OCPP", href: "#flotte" },
      { label: "Gestion de flotte", href: "#flotte" },
      { label: "Facturation & refacturation", href: "#flotte" },
      { label: "Maintenance & exploitation", href: "#benefices" },
      { label: "Accompagnement Advenir", href: "#benefices" },
    ],
  },
  {
    title: "Liens utiles",
    links: [
      { label: "Pourquoi MADIC", href: "#benefices" },
      { label: "Retour sur investissement", href: "#roi" },
      { label: "Demander un devis", href: "#contact" },
      { label: "groupe.madic.com", href: "https://www.groupe.madic.com" },
    ],
  },
];

function Social({ label, d }) {
  return (
    <a href="#" aria-label={label} className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-madic-red hover:text-white">
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true"><path d={d} /></svg>
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="bg-madic-ink text-white">
      {/* Bande supérieure */}
      <div className="border-b border-white/10">
        <div className="mx-auto grid max-w-content grid-cols-1 gap-10 px-5 py-14 md:px-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo variant="white" className="text-[40px]" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">
              Fondé en 1971, le groupe familial MADIC innove dans les énergies &amp;
              l'environnement automobile, le paiement sans surveillance et la datalisation
              du parcours client.
            </p>
            <div className="mt-6 flex gap-2">
              <Social label="LinkedIn" d="M4.98 3.5A2.5 2.5 0 002.5 6 2.5 2.5 0 005 8.5 2.5 2.5 0 007.5 6 2.5 2.5 0 004.98 3.5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.76-2.05C21 8.65 22 11 22 14.3V21h-4v-6c0-1.43-.03-3.27-2-3.27S14 13.3 14 14.9V21h-4z" />
              <Social label="Facebook" d="M13 22v-9h3l.5-3.5H13V7.3c0-1 .3-1.7 1.8-1.7H17V2.4C16.6 2.3 15.5 2.2 14.3 2.2c-2.6 0-4.3 1.6-4.3 4.5v2.8H7V13h3v9z" />
              <Social label="X" d="M17 3h3l-7 8 8 10h-6l-4.5-6L5 21H2l7.5-9L2 3h6l4 5.5z" />
            </div>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="group inline-flex items-center gap-1.5 text-sm text-white/60 transition-colors hover:text-white">
                      <Chevron className="h-2.5 w-2.5 opacity-0 transition-opacity group-hover:opacity-100" />
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* Coordonnées */}
      <div className="border-b border-white/10">
        <div className="mx-auto grid max-w-content grid-cols-1 gap-6 px-5 py-8 text-sm text-white/60 md:grid-cols-3 md:px-8">
          <div>
            <p className="font-semibold text-white">Siège</p>
            <p className="mt-1">8A rue des Bruyères<br />44400 Rezé — France</p>
          </div>
          <div>
            <p className="font-semibold text-white">Contact IRVE</p>
            <p className="mt-1">
              <a href="tel:+33240921858" className="hover:text-white">+33 (0)2 40 92 18 58</a><br />
              <a href="mailto:contact.irve@madic.com" className="hover:text-white">contact.irve@madic.com</a>
            </p>
          </div>
          <div>
            <p className="font-semibold text-white">Web</p>
            <p className="mt-1"><a href="https://www.groupe.madic.com" className="hover:text-white">www.groupe.madic.com</a></p>
          </div>
        </div>
      </div>

      {/* Bas de page légal */}
      <div className="mx-auto flex max-w-content flex-col gap-3 px-5 py-6 text-xs text-white/45 md:flex-row md:items-center md:justify-between md:px-8">
        <p>© {new Date().getFullYear()} MADIC group — Une société de MADIC group. Tous droits réservés.</p>
        <nav aria-label="Liens légaux" className="flex flex-wrap gap-x-5 gap-y-2">
          <a href="#" className="hover:text-white">Mentions légales</a>
          <a id="rgpd" href="#" className="hover:text-white">Politique de confidentialité (RGPD)</a>
          <a href="#" className="hover:text-white">Gestion des cookies</a>
        </nav>
      </div>
    </footer>
  );
}
