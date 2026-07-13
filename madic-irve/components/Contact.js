import ContactForm from "./ContactForm";
import { Chevron } from "./icons";

const reassurance = [
  "Étude énergétique gratuite et sans engagement",
  "Un interlocuteur dédié, partout en France",
  "Accompagnement sur vos subventions Advenir",
];

export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-24 relative overflow-hidden bg-madic-ink grain py-20 md:py-28" aria-labelledby="contact-title">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#0a1a33] via-[#0c1f3d] to-madic-ink" />
      <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-madic-red/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-content grid-cols-1 gap-12 px-5 md:px-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="reveal">
          <p className="section-label text-madic-red">Contact</p>
          <h2 id="contact-title" className="mt-3 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            Parlons de votre projet
          </h2>
          <p className="mt-4 max-w-md text-white/70">
            Décrivez votre besoin : nos experts reviennent vers vous avec une étude
            personnalisée et une recommandation technique adaptée à votre site.
          </p>

          <ul className="mt-8 space-y-3">
            {reassurance.map((r) => (
              <li key={r} className="flex items-center gap-3 text-sm font-medium text-white/85">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-madic-red/15">
                  <Chevron className="h-3 w-3" />
                </span>
                {r}
              </li>
            ))}
          </ul>

          <div className="mt-10 rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/50">Une question rapide ?</p>
            <a href="tel:+33240921858" className="mt-1 block text-lg font-bold text-white hover:text-madic-red">
              +33 (0)2 40 92 18 58
            </a>
            <a href="mailto:contact.irve@madic.com" className="text-sm text-white/70 hover:text-white">
              contact.irve@madic.com
            </a>
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
