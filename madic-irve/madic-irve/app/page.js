"use client";
import useReveal from "@/components/useReveal";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProfileSelector from "@/components/ProfileSelector";
import Partners from "@/components/Partners";
import Products from "@/components/Products";
import Benefits from "@/components/Benefits";
import Solar from "@/components/Solar";
import Fleet from "@/components/Fleet";
import ROI from "@/components/ROI";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Page() {
  useReveal();
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ProfileSelector />
        <Partners />
        <Products />
        <Benefits />
        <Solar />
        <Fleet />
        <ROI />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
