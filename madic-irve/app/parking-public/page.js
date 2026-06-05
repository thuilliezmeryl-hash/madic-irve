"use client";
import useReveal from "@/components/useReveal";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import Regulation from "@/components/Regulation";
import LomSimulator from "@/components/LomSimulator";
import RevenueSimulator from "@/components/RevenueSimulator";
import Products from "@/components/Products";
import Solar from "@/components/Solar";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

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

        <LomSimulator defaultType="public-existant" />
        <RevenueSimulator />

        <Products />
        <Solar />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
