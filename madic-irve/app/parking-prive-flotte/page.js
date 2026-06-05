"use client";
import useReveal from "@/components/useReveal";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import Regulation from "@/components/Regulation";
import LomSimulator from "@/components/LomSimulator";
import Products from "@/components/Products";
import Fleet from "@/components/Fleet";
import Solar from "@/components/Solar";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

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

        <LomSimulator defaultType="prive-existant" />

        <Products />
        <Fleet />
        <Solar />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
