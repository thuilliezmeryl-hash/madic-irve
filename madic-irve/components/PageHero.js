import { Chevron } from "./icons";

/** Hero de page intérieure, paramétrable. */
export default function PageHero({ eyebrow, title, highlight, subtitle, points = [] }) {
  return (
    <section id="top" className="relative overflow-hidden bg-madic-ink grain pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1a33] via-[#0c1f3d] to-[#0a1422]" />
        <div className="absolute -right-32 top-0 h-[560px] w-[560px] rounded-full bg-madic-red/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-content px-5 md:px-8">
        <div className="max-w-3xl animate-fadeUp">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/80">
            <Chevron className="h-3 w-3" /> {eyebrow}
          </span>

          <h1 className="text-balance text-4xl font-extrabold leading-[1.07] tracking-tight text-white sm:text-5xl">
            {title}{" "}
            {highlight && <span className="text-madic-red">{highlight}</span>}
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/80">{subtitle}</p>

          {points.length > 0 && (
            <ul className="mt-8 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
              {points.map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm font-medium text-white/85">
                  <Chevron className="h-4 w-4 shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-9">
            <a
              href="#contact"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-madic-red px-7 py-4 text-base font-bold text-white shadow-xl shadow-madic-red/30 transition-all hover:scale-[1.03] hover:bg-madic-red-dark"
            >
              Obtenir mon étude gratuite
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
