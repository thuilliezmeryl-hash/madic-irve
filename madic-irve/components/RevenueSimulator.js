"use client";
import { useState, useMemo } from "react";
import { Chevron } from "./icons";

/**
 * Simulateur de chiffre d'affaires / ROI pour bornes de recharge.
 * Hypothèses par défaut fournies par MADIC, toutes modifiables par l'utilisateur.
 * Calcul :
 *   kWh/an = nb bornes × points de charge × charges/jour/point × kWh/charge × 365
 *   CA/an = kWh/an × prix de revente
 *   coût élec/an = kWh/an × prix achat
 *   marge brute/an = CA − coût élec
 *   ROI (années) = (prix borne × nb bornes) / marge brute/an
 * Estimation non contractuelle.
 */

const MODELS = [
  { id: "walbox", name: "WalBox", price: 4000, points: 1, resale: 0.42, kwh: 20, perDay: 2, minDay: 1, maxDay: 3 },
  { id: "22gl", name: "22GL", price: 12000, points: 2, resale: 0.42, kwh: 20, perDay: 2, minDay: 1, maxDay: 2 },
  { id: "pulse2080", name: "Pulse 20-80", price: 30000, points: 2, resale: 0.69, kwh: 55, perDay: 3, minDay: 1, maxDay: 20 },
  { id: "pulse400", name: "Pulse 400", price: 150000, points: 2, resale: 0.69, kwh: 55, perDay: 4, minDay: 1, maxDay: 20 },
  { id: "powerunit", name: "Pulse DC Power Unit", price: 500000, points: 8, resale: 0.69, kwh: 55, perDay: 8, minDay: 1, maxDay: 30 },
];

const euro = (n) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(
    isFinite(n) ? n : 0
  );

const num = (n) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(isFinite(n) ? n : 0);

function NumField({ label, value, onChange, suffix, step = "1", min = "0" }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-[#16202c]">{label}</span>
      <div className="flex items-center rounded-lg border border-madic-grey/40 bg-white focus-within:border-madic-red">
        <input
          type="number"
          min={min}
          step={step}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg bg-transparent px-3 py-2 text-sm outline-none"
        />
        {suffix && <span className="px-3 text-xs text-madic-grey-dark">{suffix}</span>}
      </div>
    </label>
  );
}

export default function RevenueSimulator() {
  const [modelId, setModelId] = useState("pulse400");
  const base = MODELS.find((m) => m.id === modelId);

  // États paramétrables (initialisés sur le modèle, réinitialisés au changement de modèle)
  const [qty, setQty] = useState(2);
  const [resale, setResale] = useState(base.resale);
  const [kwh, setKwh] = useState(base.kwh);
  const [perDay, setPerDay] = useState(base.perDay);
  const [buyPrice, setBuyPrice] = useState(0.21);

  const selectModel = (id) => {
    const m = MODELS.find((x) => x.id === id);
    setModelId(id);
    setResale(m.resale);
    setKwh(m.kwh);
    setPerDay(m.perDay);
  };

  const r = useMemo(() => {
    const n = Math.max(0, Number(qty) || 0);
    const pts = base.points;
    const kwhYear = n * pts * (Number(perDay) || 0) * (Number(kwh) || 0) * 365;
    const caYear = kwhYear * (Number(resale) || 0);
    const costYear = kwhYear * (Number(buyPrice) || 0);
    const marginYear = caYear - costYear;
    const capex = n * base.price;
    const roi = marginYear > 0 ? capex / marginYear : Infinity;
    return {
      pts: n * pts,
      kwhYear,
      caMonth: caYear / 12,
      caYear,
      marginYear,
      capex,
      roi,
    };
  }, [qty, resale, kwh, perDay, buyPrice, base.points, base.price]);

  return (
    <section id="simulateur-ca" className="scroll-mt-24 bg-[#fafbfc] py-20 md:py-28" aria-labelledby="simca-title">
      <div className="mx-auto max-w-content px-5 md:px-8">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="section-label text-madic-red">Outil gratuit</p>
          <h2 id="simca-title" className="mt-3 text-3xl font-extrabold tracking-tight text-[#16202c] md:text-4xl">
            Simulateur de chiffre d'affaires
          </h2>
          <p className="mt-4 text-madic-grey-dark">
            Estimez le revenu potentiel de vos bornes de recharge. Choisissez un modèle, ajustez
            les hypothèses à votre situation, et visualisez le chiffre d'affaires et le retour sur
            investissement.
          </p>
        </div>

        <div className="reveal mx-auto mt-12 max-w-5xl overflow-hidden rounded-2xl border border-madic-grey/25 bg-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Paramètres */}
            <div className="border-b border-madic-grey/20 p-7 lg:border-b-0 lg:border-r md:p-8">
              <p className="text-sm font-bold text-[#16202c]">Modèle de borne</p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {MODELS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => selectModel(m.id)}
                    className={`rounded-lg border px-3 py-2.5 text-left text-xs font-semibold transition-colors ${
                      modelId === m.id
                        ? "border-madic-red bg-madic-red/5 text-madic-red"
                        : "border-madic-grey/30 bg-white text-[#16202c] hover:border-madic-red/40"
                    }`}
                  >
                    {m.name}
                    <span className="mt-0.5 block text-[10px] font-medium text-madic-grey-dark">
                      {m.points} pt{m.points > 1 ? "s" : ""} de charge
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <NumField label="Nombre de bornes" value={qty} onChange={setQty} />
                <NumField label="Prix de revente" value={resale} onChange={setResale} suffix="€/kWh" step="0.01" />
                <NumField label="kWh par charge" value={kwh} onChange={setKwh} suffix="kWh" />
                <NumField label="Prix d'achat élec." value={buyPrice} onChange={setBuyPrice} suffix="€/kWh" step="0.01" />
              </div>

              {/* Curseur charges/jour/point borné par modèle */}
              <div className="mt-5">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-semibold text-[#16202c]">Charges / jour / point de charge</span>
                  <span className="text-sm font-extrabold text-madic-red">{perDay}</span>
                </div>
                <input
                  type="range"
                  min={base.minDay}
                  max={base.maxDay}
                  step="1"
                  value={perDay}
                  onChange={(e) => setPerDay(Number(e.target.value))}
                  className="mt-2 w-full accent-madic-red"
                  aria-label="Charges par jour et par point de charge"
                />
                <div className="mt-1 flex justify-between text-[10px] text-madic-grey-dark">
                  <span>{base.minDay}</span>
                  <span>max {base.maxDay}</span>
                </div>
                <p className="mt-1 text-[11px] text-madic-grey-dark">
                  soit <strong className="font-bold text-[#16202c]">{num((Number(perDay) || 0) * base.points * (Number(qty) || 0))}</strong> charge(s) / jour
                  {Number(qty) > 1 ? ` pour vos ${num(qty)} bornes` : " pour la borne"}.
                </p>
              </div>

              <p className="mt-4 text-[11px] leading-relaxed text-madic-grey-dark">
                Valeurs pré-remplies à titre indicatif par MADIC. Ajustez-les pour refléter votre
                projet (tarification, fréquentation, configuration du site).
              </p>
            </div>

            {/* Résultats */}
            <div className="bg-madic-ink p-7 text-white md:p-8">
              <p className="text-sm font-semibold text-white/80">Estimation annuelle</p>

              <div className="mt-4 rounded-xl bg-white/5 p-5 ring-1 ring-white/10">
                <p className="text-xs uppercase tracking-wider text-white/50">Chiffre d'affaires</p>
                <p className="mt-1 text-4xl font-extrabold text-white">{euro(r.caYear)}<span className="text-base font-semibold text-white/50"> / an</span></p>
                <p className="mt-1 text-sm text-white/60">soit {euro(r.caMonth)} / mois</p>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                  <p className="text-xs text-white/50">Marge après élec.</p>
                  <p className="mt-1 text-xl font-extrabold text-white">{euro(r.marginYear)}<span className="text-xs font-medium text-white/50">/an</span></p>
                </div>
                <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                  <p className="text-xs text-white/50">Retour sur investissement</p>
                  <p className="mt-1 text-xl font-extrabold text-madic-red">
                    {isFinite(r.roi) ? `${r.roi.toFixed(1)} ans` : "—"}
                  </p>
                </div>
              </div>

              <ul className="mt-4 space-y-1.5 text-xs text-white/60">
                <li className="flex items-center gap-2"><Chevron className="h-3 w-3 shrink-0" /> {r.pts} point(s) de charge au total</li>
                <li className="flex items-center gap-2"><Chevron className="h-3 w-3 shrink-0" /> {num(r.kwhYear)} kWh distribués par an</li>
                <li className="flex items-center gap-2"><Chevron className="h-3 w-3 shrink-0" /> Investissement estimé : {euro(r.capex)}</li>
              </ul>

              <a
                href="#contact"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-madic-red px-5 py-3 text-sm font-bold text-white transition-all hover:scale-[1.01] hover:bg-madic-red-dark"
              >
                Affiner avec un expert MADIC
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </a>
            </div>
          </div>
        </div>

        <p className="reveal mx-auto mt-5 max-w-5xl text-xs italic text-madic-grey-dark">
          Estimation indicative et non contractuelle, fondée sur les hypothèses saisies. Les revenus
          réels dépendent de la fréquentation effective, de la tarification appliquée, des coûts
          d'exploitation et de maintenance, des frais de raccordement et des éventuelles subventions.
          Cette simulation ne constitue pas un engagement de MADIC sur un niveau de chiffre d'affaires.
        </p>
      </div>
    </section>
  );
}
