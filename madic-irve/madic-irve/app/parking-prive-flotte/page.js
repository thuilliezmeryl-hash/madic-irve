"use client";
import useReveal from "@/components/useReveal";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import Regulation from "@/components/Regulation";
import Products from "@/components/Products";
import Fleet from "@/components/Fleet";
import Solar from "@/components/Solar";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { Icons } from "@/components/icons";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "#reglementation", label: "Réglementation" },
  { href: "#simulateur", label: "Simulateur" },
  { href: "#solutions", label: "Nos bornes" },
  { href: "/parking-public", label: "Parking public" },
];

export default function ParkingPriveFlottePage() {
  useReveal();
  return (
    <>
      <Header links={navLinks} />
      <main>
        <PageHero
          eyebrow="Parking privatif & flotte d'entreprise"
          title="Électrifiez votre flotte"
          highlight="et votre parking sans fausse note"
          subtitle="Parkings collaborateurs, dépôts, véhicules de fonction et de service : entre obligations de verdissement, conformité des parkings et impact fiscal du choix des véhicules, les enjeux sont nombreux. MADIC sécurise le volet recharge de votre transition."
          points={[
            "Conformité loi LOM des parkings privatifs",
            "Recharge des flottes et utilitaires",
            "Supervision, badges RFID et refacturation",
            "Gestion de la puissance et pilotage de charge",
          ]}
        />

        <Regulation
          only={["public", "flotte", "ademe"]}
          title="Vos obligations : parkings privatifs, flotte et fiscalité"
          intro="Les entreprises cumulent plusieurs obligations : équipement de leurs parkings privatifs, verdissement de leur flotte, et vigilance sur le choix des véhicules attribués. Voici l'essentiel à connaître, dans le cadre de la loi LOM et des textes associés."
        />

        {/* Emplacement du futur simulateur de places obligatoires (Brique 2) */}
        <section id="simulateur" className="scroll-mt-24 bg-white py-20 md:py-28" aria-labelledby="sim-title">
          <div className="mx-auto max-w-content px-5 md:px-8">
            <div className="reveal mx-auto max-w-3xl rounded-2xl border border-dashed border-madic-grey/40 bg-[#fafbfc] p-10 text-center">
              <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-madic-red/8 text-madic-red">
                <Icons.building />
              </span>
              <p className="section-label mt-5 text-madic-red">Bientôt</p>
              <h2 id="sim-title" className="mt-3 text-2xl font-extrabold tracking-tight text-[#16202c] md:text-3xl">
                Simulateur de places obligatoires
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-madic-grey-dark">
                Indiquez le nombre de places de votre parking et le type de bâtiment pour
                connaître le nombre de bornes que la loi LOM vous impose. Cet outil sera
                intégré ici prochainement.
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
        <Fleet />
        <Solar />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
