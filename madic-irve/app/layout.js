import "./globals.css";
import localFont from "next/font/local";

// Montserrat auto-hébergé (typographie institutionnelle MADIC), aucune dépendance externe.
const montserrat = localFont({
  src: [
    { path: "../public/fonts/montserrat-400.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/montserrat-500.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/montserrat-600.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/montserrat-700.woff2", weight: "700", style: "normal" },
    { path: "../public/fonts/montserrat-800.woff2", weight: "800", style: "normal" },
  ],
  display: "swap",
  variable: "--font-montserrat",
});

export const metadata = {
  metadataBase: new URL("https://irve.madic.com"),
  title: "MADIC IRVE | Recharge électrique professionnelle clé en main",
  description:
    "Déployez votre infrastructure de recharge électrique professionnelle (IRVE) avec MADIC : étude énergétique, installation clé en main, supervision OCPP, gestion de flotte et solutions photovoltaïques. Obtenez votre étude gratuite.",
  keywords: [
    "IRVE",
    "borne de recharge entreprise",
    "recharge électrique flotte",
    "supervision OCPP",
    "ombrière photovoltaïque",
    "borne DC rapide",
    "borne HPC 400 kW",
    "loi LOM borne recharge",
    "obligation borne recharge parking",
    "verdissement flotte entreprise",
    "obligation véhicule électrique flotte",
    "avantage en nature véhicule électrique",
    "liste ADEME véhicule électrique",
    "borne recharge made in France",
    "MADIC",
  ],
  authors: [{ name: "MADIC group" }],
  openGraph: {
    title: "MADIC IRVE | Infrastructure de recharge électrique professionnelle",
    description:
      "De l'étude énergétique à l'exploitation, MADIC accompagne les professionnels dans leur transition vers la mobilité électrique.",
    type: "website",
    locale: "fr_FR",
    siteName: "MADIC",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport = {
  themeColor: "#d70926",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "MADIC",
  url: "https://www.groupe.madic.com",
  description:
    "Solutions de recharge électrique professionnelles (IRVE) : étude, installation, supervision et exploitation.",
  foundingDate: "1971",
  address: {
    "@type": "PostalAddress",
    streetAddress: "8A rue des Bruyères",
    postalCode: "44400",
    addressLocality: "Rezé",
    addressCountry: "FR",
  },
  makesOffer: {
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: "Infrastructure de recharge pour véhicules électriques (IRVE)",
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={montserrat.variable}>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
