"use client";
import { useState, useEffect } from "react";
import Logo from "./Logo";

const defaultLinks = [
  { href: "/#solutions", label: "Solutions" },
  { href: "/#benefices", label: "Pourquoi MADIC" },
  { href: "/parking-public", label: "Parking public" },
  { href: "/parking-prive-flotte", label: "Privatif & flotte" },
  { href: "/#photovoltaique", label: "Photovoltaïque" },
  { href: "/espace-client", label: "Espace connecté", highlight: true },
];

export default function Header({ links = defaultLinks }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-[0_2px_24px_rgba(0,0,0,0.08)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-content items-center justify-between px-5 py-3.5 md:px-8">
        <a href="/" className="flex items-center" aria-label="MADIC, Accueil">
          <Logo variant={scrolled ? "color" : "white"} className="text-[34px]" />
        </a>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Navigation principale">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={
                l.highlight
                  ? `rounded-full border-2 px-4 py-1.5 text-sm font-bold transition-all ${scrolled ? "border-madic-navy/30 text-madic-navy hover:bg-madic-navy/5" : "border-white/40 text-white hover:bg-white/10"}`
                  : `link-underline text-sm font-semibold transition-colors ${scrolled ? "text-[#16202c] hover:text-madic-red" : "text-white/90 hover:text-white"}`
              }
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="rounded-full bg-madic-red px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-madic-red/25 transition-transform hover:scale-[1.03] hover:bg-madic-red-dark"
          >
            Obtenir mon étude
          </a>
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className={`lg:hidden ${scrolled ? "text-[#16202c]" : "text-white"}`}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {/* Menu mobile */}
      <div
        className={`overflow-hidden bg-white shadow-xl transition-[max-height] duration-300 lg:hidden ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col gap-1 px-5 py-3" aria-label="Navigation mobile">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-sm font-semibold text-[#16202c] hover:bg-madic-grey/15"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full bg-madic-red px-5 py-3 text-center text-sm font-bold text-white"
          >
            Obtenir mon étude gratuite
          </a>
        </nav>
      </div>
    </header>
  );
}
