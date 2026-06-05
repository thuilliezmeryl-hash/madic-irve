"use client";
import useReveal from "@/components/useReveal";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import Regulation from "@/components/Regulation";
import Products from "@/components/Products";
import Solar from "@/components/Solar";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { Icons } from "@/components/icons";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "#reglementation", label: "Réglementation" },
  { href: "#simulateur", label: "Simulateur" },
  { href: "#solutions", label: "Nos bornes" },
  { href: "/parking-prive-flotte", label: "Privatif & flotte" },
];

export default function ParkingPublicPage() {
  useReveal();
  return (
    <>
      <Header links={navLinks} />
      <main>
        <PageHero
          eyebrow="Parking recevant du public"
          title="Faites de votre parking un service"
          highlight="et une source de revenus"
          subtitle="Supermarchés, retail, centres commerciaux : équiper votre parking en recharge n'est pas qu'une obligation légale, c'est un levier d'attractivité et de chiffre d'affaires. MADIC vous accompagne de l'étude à l'exploitation, jusqu'à la mise en relation avec des opérateurs de recharge."
          points={[
            "Mise en conformité loi LOM",
            "Mise en relation avec des opérateurs de recharge",
            "Facturation et refacturation des sessions",
            "Solutions jusqu'à 720 kW pour les forts trafics",
          ]}
        />

        <Regulation
          only={["public"]}
          title="Vos obligations : la loi LOM pour les parkings publics"
          intro="Les établissements recevant du public sont soumis à des obligations d'équipement précises. MADIC vous aide à déterminer le nombre de bornes requis et à dimensionner votre infrastructure en conséquence."
        />

        {/* Emplacement du futur simulateur de chiffre d'affaires (Brique 3) */}
        <section id="simulateur" className="scroll-mt-24 bg-white py-20 md:py-28" aria-labelledby="sim-title">
          <div className="mx-auto max-w-content px-5 md:px-8">
            <div className="reveal mx-auto max-w-3xl rounded-2xl border border-dashed border-madic-grey/40 bg-[#fafbfc] p-10 text-center">
              <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-madic-red/8 text-madic-red">
                <Icons.euro />
              </span>
              <p className="section-label mt-5 text-madic-red">Bientôt</p>
              <h2 id="sim-title" className="mt-3 text-2xl font-extrabold tracking-tight text-[#16202c] md:text-3xl">
                Simulateur de chiffre d'affaires
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-madic-grey-dark">
                Estimez le revenu potentiel de vos bornes selon votre trafic, le type de bornes
                installées et votre tarification. Un outil de calcul personnalisé sera intégré
                ici prochainement.
              </p>
              <a
                href="#contact"
                className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-madic-red px-7 py-4 text-base font-bold text-white shadow-lg shadow-madic-red/25 transition-all hover:scale-[1.03] hover:bg-madic-red-dark"
              >
                En attendant, demandez votre étude
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </a>
            </div>
          </div>
        </section>

        <Products />
        <Solar />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
