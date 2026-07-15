"use client";
import { useState } from "react";
import { AuthProvider, useAuth } from "@/lib/auth";
import AuthWall from "@/components/AuthWall";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LocationSimulator from "@/components/LocationSimulator";
import LomSimulator from "@/components/LomSimulator";
import RevenueSimulator from "@/components/RevenueSimulator";
import useReveal from "@/components/useReveal";

const ESPACE_LINKS = [
  { href: "/", label: "Retour au site" },
  { href: "/espace-client#simulateur-location", label: "Simulateur location" },
  { href: "/espace-client#simulateurs-publics", label: "Simulateurs standards" },
];

function Badge({ role }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${role === "commercial" ? "bg-madic-navy text-white" : "bg-madic-red/10 text-madic-red"}`}>
      {role === "commercial" ? "🏢 Commercial" : "🔌 Client"}
    </span>
  );
}

function EspaceContent() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("location");
  useReveal(activeTab);

  const tabs = [
    { id: "location", label: "Simulateur Location", icon: "📋", roles: ["client", "commercial"] },
    { id: "lom", label: "Loi LOM", icon: "⚖️", roles: ["client", "commercial"] },
    { id: "revenu", label: "ROI & Revenus", icon: "📈", roles: ["commercial"] },
  ].filter((t) => t.roles.includes(user?.role));

  return (
    <div className="min-h-screen bg-gradient-to-b from-madic-navy/3 to-white">
      <Header links={ESPACE_LINKS} />

      <main className="mx-auto max-w-content px-5 pb-20 pt-28 md:px-8">
        {/* Bandeau de bienvenue */}
        <div className="reveal mb-10 flex flex-col gap-4 rounded-3xl bg-madic-navy px-8 py-6 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/50">Espace connecté</p>
            <h1 className="mt-1 text-xl font-extrabold">Bonjour, {user?.name} 👋</h1>
            <p className="mt-0.5 text-sm text-white/70">{user?.company}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge role={user?.role} />
            <button
              onClick={logout}
              className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white/70 hover:bg-white/10 transition-colors"
            >
              Se déconnecter
            </button>
          </div>
        </div>

        {/* Onglets */}
        <div className="reveal mb-8 flex gap-2 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 rounded-2xl px-5 py-3 text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-madic-red text-white shadow-lg shadow-madic-red/25"
                  : "bg-white text-[#16202c] shadow-sm hover:shadow-md"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Contenu */}
        <div id={activeTab === "location" ? "simulateur-location" : activeTab}>
          {activeTab === "location" && <LocationSimulator />}

          {activeTab === "lom" && <LomSimulator />}

          {activeTab === "revenu" && <RevenueSimulator />}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function EspaceClientInner() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-madic-red border-t-transparent" />
      </div>
    );
  }

  if (!user) return <AuthWall />;
  return <EspaceContent />;
}

export default function EspaceClientPage() {
  return (
    <AuthProvider>
      <EspaceClientInner />
    </AuthProvider>
  );
}
