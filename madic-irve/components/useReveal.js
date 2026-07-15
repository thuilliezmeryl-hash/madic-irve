"use client";
import { useEffect } from "react";

/**
 * Active la classe .is-visible sur les éléments .reveal.
 * - Ce qui est déjà à l'écran est révélé immédiatement (pas d'attente de l'observateur),
 *   ce qui garantit l'affichage du contenu monté après coup (ex. changement d'onglet).
 * - Le reste (plus bas dans la page) est révélé au défilement via l'IntersectionObserver.
 * Passer une clé (ex. l'onglet actif) relance la surveillance quand le contenu change.
 */
export default function useReveal(deps) {
  useEffect(() => {
    const els = [...document.querySelectorAll(".reveal")];
    const show = (el) => el.classList.add("is-visible");

    if (!("IntersectionObserver" in window)) {
      els.forEach(show);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            show(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    els.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (inView) show(el); // déjà visible : on révèle tout de suite
      else io.observe(el); // hors écran : révélé au défilement
    });

    return () => io.disconnect();
  }, [deps]);
}
