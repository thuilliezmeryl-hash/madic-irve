import { Chevron } from "./icons";

const features = [
  "Badges RFID", "Gestion des utilisateurs", "Refacturation", "Reporting",
  "OCPP", "Supervision", "Statistiques", "Export ERP",
];

function DashboardMockup() {
  const bars = [42, 68, 55, 80, 63, 90, 74, 48];
  return (
    <div className="overflow-hidden rounded-2xl border border-madic-grey/25 bg-white shadow-2xl">
      {/* Barre de fenêtre */}
      <div className="flex items-center gap-2 border-b border-madic-grey/20 bg-[#f6f7f9] px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-madic-red/70" />
        <span className="h-3 w-3 rounded-full bg-madic-grey/60" />
        <span className="h-3 w-3 rounded-full bg-madic-grey/40" />
        <span className="ml-3 text-xs font-semibold text-madic-grey-dark">Supervision MADIC · Tableau de bord flotte</span>
      </div>

      <div className="p-5">
        {/* KPI row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { v: "128", l: "Sessions / jour" },
            { v: "94 %", l: "Disponibilité" },
            { v: "1,7 t", l: "CO₂ évité / mois" },
          ].map((k) => (
            <div key={k.l} className="rounded-xl bg-[#fafbfc] p-3 ring-1 ring-madic-grey/15">
              <p className="text-xl font-extrabold text-[#16202c]">{k.v}</p>
              <p className="text-[11px] text-madic-grey-dark">{k.l}</p>
            </div>
          ))}
        </div>

        {/* Graphique */}
        <div className="mt-4 rounded-xl bg-[#fafbfc] p-4 ring-1 ring-madic-grey/15">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-bold text-[#16202c]">Énergie délivrée (kWh)</p>
            <span className="rounded-full bg-madic-red/10 px-2 py-0.5 text-[10px] font-bold text-madic-red">+18 %</span>
          </div>
          <div className="flex h-28 items-end gap-2">
            {bars.map((h, i) => (
              <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-madic-red to-madic-red/60" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>

        {/* Lignes utilisateurs */}
        <div className="mt-4 space-y-2">
          {["Flotte commerciale · RFID-204", "Utilitaires logistique · RFID-118", "Visiteurs · accès QR"].map((u, i) => (
            <div key={u} className="flex items-center justify-between rounded-lg bg-white px-3 py-2 ring-1 ring-madic-grey/15">
              <span className="text-xs font-medium text-[#3a4654]">{u}</span>
              <span className={`h-2 w-2 rounded-full ${i === 2 ? "bg-madic-grey" : "bg-[#2bd07a]"}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Fleet() {
  return (
    <section id="flotte" className="scroll-mt-24 bg-white py-20 md:py-28" aria-labelledby="fleet-title">
      <div className="mx-auto grid max-w-content grid-cols-1 items-center gap-12 px-5 md:px-8 lg:grid-cols-[1fr_1.05fr]">
        <div className="reveal order-2 lg:order-1">
          <DashboardMockup />
        </div>

        <div className="reveal order-1 lg:order-2">
          <p className="section-label text-madic-red">Pilotage &amp; supervision</p>
          <h2 id="fleet-title" className="mt-3 text-3xl font-extrabold tracking-tight text-[#16202c] md:text-4xl">
            Pilotez vos recharges simplement
          </h2>
          <p className="mt-4 max-w-lg text-madic-grey-dark">
            Une plateforme de supervision unique pour suivre, contrôler et facturer vos recharges.
            Compatible OCPP, elle s'intègre à votre SI et exporte vers votre ERP.
          </p>

          <ul className="mt-8 grid grid-cols-2 gap-3">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-2 rounded-lg border border-madic-grey/25 bg-[#fafbfc] px-3 py-2.5 text-sm font-medium text-[#3a4654]">
                <Chevron className="h-3.5 w-3.5 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
