"use client";
import { useState, useMemo } from "react";
import { Chevron } from "./icons";

/**
 * Simulateur Offre Location MADIC — Pulse 80 DC
 * Données issues de l'offre commerciale Carrefour (mai 2025) :
 *   - Loyer : 800 €/mois HT par borne (48 mois, maint. préventive + curative incluses)
 *   - Supervision Road : 20,80 €/mois HT par borne (hors loyer, à charge du magasin)
 *   - GC/Elec forfait moyen : 6 400 € par borne (amorti 10 ans = ~53 €/mois)
 *   - Puissance requise : 80 kW par borne (Pulse 80 DC / 2 PDC)
 *   - Tarif vente kWh DC : 0,55 € / achat : 0,17 €
 *   - Charges/jour/PDC : 2,5 en moyenne
 * Estimation non contractuelle.
 */

// ─── Forfaits GC/VRD ──────────────────────────────────────────────────────────
const GC_ITEMS = [
  { id: "balisage", label: "Balisage", price: 480, perBorne: true },
  { id: "potelets", label: "2 Potelets de protection", price: 500, perBorne: true },
  { id: "massifs_potelets", label: "2 Massifs potelets", price: 380, perBorne: true },
  { id: "massif_beton", label: "Massif borne dans béton", price: 1615, perBorne: true },
  { id: "depl_engin", label: "Déplacement + amené engin", price: 1350, perBorne: false },
  { id: "panneaux", label: "Panneaux routiers stationnement IRVE", price: 470, perBorne: true },
];

const ELEC_ITEMS = [
  { id: "depl_elec", label: "Déplacement électricien", price: 285, perBorne: false },
  { id: "caneco", label: "Note de calcul Canéco", price: 460, perBorne: false },
  { id: "consignation", label: "Mise en sécurité (consignation)", price: 220, perBorne: false },
  { id: "raccordement", label: "Modification & raccordement TGBT existant", price: 450, perBorne: false },
  { id: "disjoncteur", label: "Disjoncteur NS160A 36KA 4x160A", price: 1300, perBorne: true },
];

const CABLE_OPTIONS = [
  { id: "cable_15", label: "Câble 5G25 jusqu'à 15 m", price: 470 },
  { id: "cable_30", label: "Câble 5G25 jusqu'à 30 m", price: 720 },
  { id: "cable_50", label: "Câble 5G25 jusqu'à 50 m", price: 1045 },
  { id: "cable_80", label: "Câble 5G25 jusqu'à 80 m", price: 1540 },
];

const MASSIF_OPTIONS = [
  { id: "massif_vert", label: "Massif borne dans espace vert", price: 960 },
  { id: "massif_enrobe", label: "Massif borne dans enrobé", price: 1430 },
  { id: "massif_beton", label: "Massif borne dans béton", price: 1615 },
];

const euro = (n) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(
    isFinite(n) ? n : 0
  );

const LOYER_BORNE = 800;
const SUPERVISION = 20.80;
const GC_ELEC_FORFAIT = 6400; // par borne, amorti 10 ans
const KW_PAR_BORNE = 80;
const CHARGES_PAR_JOUR = 2.5;
const KWH_PAR_CHARGE = 40; // 20→80 % ≈ 40 kWh
const PRIX_VENTE_KWH = 0.55;
const PRIX_ACHAT_KWH = 0.17;
const DUREE_MOIS = 48;

function SectionTitle({ children, sub }) {
  return (
    <div className="mb-5">
      <p className="section-label text-madic-red">{children}</p>
      {sub && <p className="mt-0.5 text-xs text-madic-grey-dark">{sub}</p>}
    </div>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-3xl border border-madic-grey/20 bg-white p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function KpiBox({ label, value, sub, highlight }) {
  return (
    <div className={`rounded-2xl p-4 text-center ${highlight ? "bg-madic-red text-white" : "bg-madic-navy/5"}`}>
      <p className={`text-2xl font-extrabold ${highlight ? "text-white" : "text-madic-navy"}`}>{value}</p>
      <p className={`mt-0.5 text-xs font-semibold ${highlight ? "text-white/80" : "text-madic-grey-dark"}`}>{label}</p>
      {sub && <p className={`mt-0.5 text-[11px] ${highlight ? "text-white/60" : "text-madic-grey"}`}>{sub}</p>}
    </div>
  );
}

function NumField({ label, value, onChange, suffix, min = "0", step = "1", hint }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-[#16202c]">{label}</span>
      {hint && <span className="mb-1.5 block text-[11px] text-madic-grey-dark">{hint}</span>}
      <div className="flex items-center rounded-xl border border-madic-grey/40 bg-white focus-within:border-madic-red focus-within:ring-2 focus-within:ring-madic-red/10 transition-all">
        <input
          type="number"
          min={min}
          step={step}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl bg-transparent px-3 py-2.5 text-sm font-semibold outline-none"
        />
        {suffix && <span className="whitespace-nowrap px-3 text-xs text-madic-grey-dark">{suffix}</span>}
      </div>
    </label>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <div
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${checked ? "bg-madic-red" : "bg-madic-grey/40"}`}
      >
        <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : ""}`} />
      </div>
      <span className="text-sm font-medium text-[#16202c]">{label}</span>
    </label>
  );
}

export default function LocationSimulator() {
  // ── Étape active ──────────────────────────────────────────────────────────
  const [step, setStep] = useState(1); // 1=borne, 2=GC/elec, 3=puissance, 4=résultats

  // ── Borne ─────────────────────────────────────────────────────────────────
  const [nbBornes, setNbBornes] = useState(2);
  const [chargesJour, setChargesJour] = useState(CHARGES_PAR_JOUR);
  const [prixVente, setPrixVente] = useState(PRIX_VENTE_KWH);
  const [prixAchat, setPrixAchat] = useState(PRIX_ACHAT_KWH);

  // ── GC / Elec ─────────────────────────────────────────────────────────────
  const [massif, setMassif] = useState("massif_beton");
  const [cable, setCable] = useState("cable_30");
  const [gcOptions, setGcOptions] = useState({ balisage: true, potelets: true, massifs_potelets: true, depl_engin: true, panneaux: true });
  const [elecOptions, setElecOptions] = useState({ depl_elec: true, caneco: true, consignation: true, raccordement: true, disjoncteur: true });

  // ── Puissance ─────────────────────────────────────────────────────────────
  const [puissanceSouscrite, setPuissanceSouscrite] = useState(250); // kVA, Tarif Jaune typique hypermarché
  const [puissanceActuelle, setPuissanceActuelle] = useState(180);   // kW consommation max actuelle magasin
  const [fp, setFp] = useState(0.92); // facteur de puissance typique commerce

  // ── Calculs ───────────────────────────────────────────────────────────────
  const calc = useMemo(() => {
    const nb = Math.max(1, Math.round(nbBornes));

    // Loyers
    const loyerBornes = LOYER_BORNE * nb;
    const supervision = SUPERVISION * nb;
    const gcMensuel = (GC_ELEC_FORFAIT * nb) / 120; // amorti 10 ans
    const loyerTotal = loyerBornes + supervision + gcMensuel;

    // CA
    const kwhMois = nb * 2 * chargesJour * KWH_PAR_CHARGE * 30; // 2 PDC par borne
    const caMois = kwhMois * prixVente;
    const coutElecMois = kwhMois * prixAchat;
    const margeBrute = caMois - coutElecMois - loyerTotal;
    const margeSur4ans = margeBrute * DUREE_MOIS;
    const margeSurEnsuite = (caMois - coutElecMois - (LOYER_BORNE * 0.52 * nb) - supervision) ; // après 48 mois loyer réduit (estimé 415€)

    // Puissance
    const puissanceDispoKw = puissanceSouscrite * fp;
    const puissanceRestante = puissanceDispoKw - puissanceActuelle;
    const puissanceNecessaire = KW_PAR_BORNE * nb;
    const deficit = puissanceNecessaire - puissanceRestante;
    const compatible = puissanceRestante >= puissanceNecessaire;
    const gestionDynamique = !compatible && deficit <= 20; // DLM peut absorber jusqu'à 20 kW de dépassement

    // GC total
    let gcTotal = 0;
    GC_ITEMS.forEach((item) => {
      if (item.id === "massif_beton") return; // remplacé par le sélecteur massif
      if (gcOptions[item.id]) gcTotal += item.perBorne ? item.price * nb : item.price;
    });
    const massifSel = MASSIF_OPTIONS.find((m) => m.id === massif);
    if (massifSel) gcTotal += massifSel.price * nb;

    let elecTotal = 0;
    ELEC_ITEMS.forEach((item) => {
      if (elecOptions[item.id]) elecTotal += item.perBorne ? item.price * nb : item.price;
    });
    const cableSel = CABLE_OPTIONS.find((c) => c.id === cable);
    if (cableSel) elecTotal += cableSel.price * nb;

    const investTotal = gcTotal + elecTotal;
    const investMensuel = investTotal / 120;

    return {
      nb, loyerBornes, supervision, gcMensuel, loyerTotal,
      kwhMois, caMois, coutElecMois, margeBrute, margeSur4ans,
      puissanceDispoKw, puissanceRestante, puissanceNecessaire, compatible, gestionDynamique, deficit,
      gcTotal, elecTotal, investTotal, investMensuel, margeSurEnsuite,
    };
  }, [nbBornes, chargesJour, prixVente, prixAchat, puissanceSouscrite, puissanceActuelle, fp, massif, cable, gcOptions, elecOptions]);

  const steps = [
    { n: 1, label: "Borne" },
    { n: 2, label: "GC / Élec" },
    { n: 3, label: "Puissance" },
    { n: 4, label: "Résultats" },
  ];

  return (
    <div className="reveal">
      {/* En-tête */}
      <div className="mb-8">
        <p className="section-label text-madic-red">Simulateur</p>
        <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-madic-navy md:text-4xl">
          Offre Location Pulse 80 DC
        </h2>
        <p className="mt-2 text-sm text-madic-grey-dark">
          Configurez votre projet en 4 étapes. Estimation non contractuelle — loyer 48 mois, maintenance incluse.
        </p>
      </div>

      {/* Stepper */}
      <div className="mb-8 flex items-center gap-0">
        {steps.map((s, i) => (
          <div key={s.n} className="flex flex-1 items-center">
            <button
              onClick={() => setStep(s.n)}
              className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all ${
                step === s.n
                  ? "bg-madic-red text-white shadow-lg shadow-madic-red/30"
                  : step > s.n
                  ? "bg-madic-navy text-white"
                  : "bg-madic-grey/25 text-madic-grey-dark"
              }`}
            >
              {step > s.n ? (
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.704 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.411 0z" clipRule="evenodd" />
                </svg>
              ) : s.n}
            </button>
            <span className={`ml-2 hidden text-xs font-semibold sm:block ${step === s.n ? "text-madic-navy" : "text-madic-grey-dark"}`}>
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <div className={`mx-3 h-0.5 flex-1 rounded-full ${step > s.n ? "bg-madic-navy" : "bg-madic-grey/30"}`} />
            )}
          </div>
        ))}
      </div>

      {/* ── Étape 1 : Nombre de bornes ──────────────────────────────────────── */}
      {step === 1 && (
        <Card>
          <SectionTitle sub="Pulse 80 DC — 2 points de charge par borne — Location 48 mois">
            Nombre de bornes
          </SectionTitle>

          {/* Sélecteur rapide */}
          <div className="mb-6 grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((n) => (
              <button
                key={n}
                onClick={() => setNbBornes(n)}
                className={`rounded-2xl border-2 py-4 text-center transition-all ${
                  nbBornes === n
                    ? "border-madic-red bg-madic-red/5"
                    : "border-madic-grey/25 hover:border-madic-grey"
                }`}
              >
                <span className={`block text-2xl font-extrabold ${nbBornes === n ? "text-madic-red" : "text-madic-navy"}`}>{n}</span>
                <span className="block text-[11px] font-semibold text-madic-grey-dark">borne{n > 1 ? "s" : ""}</span>
                <span className="mt-1 block text-[11px] text-madic-grey">{n * 2} PDC</span>
              </button>
            ))}
          </div>

          <div className="mb-6">
            <NumField
              label="Ou saisir un nombre personnalisé"
              value={nbBornes}
              onChange={(v) => setNbBornes(Math.max(1, Number(v)))}
              suffix="borne(s)"
              min="1"
            />
          </div>

          {/* Résumé rapide */}
          <div className="rounded-2xl bg-madic-navy/5 p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-madic-navy">Récapitulatif de la sélection</p>
            <div className="space-y-2 text-sm">
              {[
                ["Borne", `Pulse 80 DC / 2 PDC — Fabriqué en France`],
                ["Points de charge", `${calc.nb * 2} PDC total`],
                ["Puissance totale", `${calc.nb * 80} kW installés`],
                ["Loyer location", `${euro(LOYER_BORNE * calc.nb)} / mois HT`],
                ["Durée", `48 mois — reconduction possible`],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-madic-grey-dark">
                    <Chevron className="h-3 w-3 text-madic-red" />
                    {k}
                  </span>
                  <span className="font-semibold text-madic-navy">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Inclus */}
          <div className="mt-4 rounded-2xl border border-green-100 bg-green-50 p-4">
            <p className="mb-2 text-xs font-bold text-green-800">✓ Inclus dans le loyer</p>
            <ul className="space-y-1 text-xs text-green-700">
              <li>— Maintenance préventive (1 passage/an : filtres, serrage, essais en charge, rapport)</li>
              <li>— Maintenance curative : déplacement + main-d'œuvre + pièces</li>
              <li>— MADIC reste propriétaire du matériel</li>
            </ul>
            <p className="mt-2 text-xs font-semibold text-amber-700">⚠ Non compris : supervision/interopérabilité Road (20,80 €/mois/borne), sinistres et vandalisme</p>
          </div>

          <button onClick={() => setStep(2)} className="mt-6 w-full rounded-full bg-madic-red py-3.5 text-sm font-bold text-white shadow-lg shadow-madic-red/25 hover:bg-madic-red-dark transition-colors">
            Configurer le génie civil → Étape 2
          </button>
        </Card>
      )}

      {/* ── Étape 2 : GC / Électricité ──────────────────────────────────────── */}
      {step === 2 && (
        <Card>
          <SectionTitle sub="Sélectionnez les prestations nécessaires pour votre site. Tarifs MADIC (indicatifs HT).">
            Génie civil & électricité
          </SectionTitle>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* GC */}
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-madic-navy">Travaux GC / VRD</p>

              <div className="mb-3">
                <p className="mb-2 text-xs font-semibold text-[#16202c]">Type de massif borne</p>
                <div className="space-y-2">
                  {MASSIF_OPTIONS.map((m) => (
                    <label key={m.id} className={`flex cursor-pointer items-center justify-between rounded-xl border-2 px-3 py-2.5 transition-all ${massif === m.id ? "border-madic-red bg-madic-red/5" : "border-madic-grey/25 hover:border-madic-grey"}`}>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="massif" checked={massif === m.id} onChange={() => setMassif(m.id)} className="accent-madic-red" />
                        <span className="text-sm font-medium">{m.label}</span>
                      </div>
                      <span className="text-xs font-bold text-madic-navy">{euro(m.price * calc.nb)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                {GC_ITEMS.filter((i) => i.id !== "massif_beton").map((item) => (
                  <label key={item.id} className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 hover:bg-madic-grey/10 transition-colors">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={!!gcOptions[item.id]} onChange={(e) => setGcOptions((p) => ({ ...p, [item.id]: e.target.checked }))} className="h-4 w-4 accent-madic-red" />
                      <span className="text-sm">{item.label}</span>
                    </div>
                    <span className="text-xs font-bold text-madic-grey-dark">{euro(item.perBorne ? item.price * calc.nb : item.price)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Elec */}
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-madic-navy">Prestations électriques</p>

              <div className="mb-3">
                <p className="mb-2 text-xs font-semibold text-[#16202c]">Longueur câble 5G25 (TGBT → borne)</p>
                <div className="space-y-2">
                  {CABLE_OPTIONS.map((c) => (
                    <label key={c.id} className={`flex cursor-pointer items-center justify-between rounded-xl border-2 px-3 py-2.5 transition-all ${cable === c.id ? "border-madic-red bg-madic-red/5" : "border-madic-grey/25 hover:border-madic-grey"}`}>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="cable" checked={cable === c.id} onChange={() => setCable(c.id)} className="accent-madic-red" />
                        <span className="text-sm font-medium">{c.label}</span>
                      </div>
                      <span className="text-xs font-bold text-madic-navy">{euro(c.price * calc.nb)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                {ELEC_ITEMS.map((item) => (
                  <label key={item.id} className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 hover:bg-madic-grey/10 transition-colors">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={!!elecOptions[item.id]} onChange={(e) => setElecOptions((p) => ({ ...p, [item.id]: e.target.checked }))} className="h-4 w-4 accent-madic-red" />
                      <span className="text-sm">{item.label}</span>
                    </div>
                    <span className="text-xs font-bold text-madic-grey-dark">{euro(item.perBorne ? item.price * calc.nb : item.price)}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Total GC */}
          <div className="mt-6 rounded-2xl bg-madic-navy/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-madic-navy">Investissement GC + Électricité total</p>
                <p className="text-[11px] text-madic-grey-dark">Amorti sur 10 ans = {euro(calc.investTotal / 120)}/mois</p>
              </div>
              <p className="text-2xl font-extrabold text-madic-navy">{euro(calc.investTotal)}</p>
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 rounded-full border-2 border-madic-grey/30 py-3 text-sm font-semibold text-[#16202c] hover:border-madic-grey transition-colors">← Retour</button>
            <button onClick={() => setStep(3)} className="flex-[2] rounded-full bg-madic-red py-3 text-sm font-bold text-white shadow-lg shadow-madic-red/25 hover:bg-madic-red-dark transition-colors">Vérifier la puissance disponible → Étape 3</button>
          </div>
        </Card>
      )}

      {/* ── Étape 3 : Puissance disponible ──────────────────────────────────── */}
      {step === 3 && (
        <Card>
          <SectionTitle sub="Renseignez les données de votre compteur pour vérifier la faisabilité électrique.">
            Puissance disponible sur site
          </SectionTitle>

          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <NumField
              label="Puissance souscrite (abonnement)"
              hint="Lisible sur votre contrat Enedis / facture Tarif Jaune (en kVA)"
              value={puissanceSouscrite}
              onChange={(v) => setPuissanceSouscrite(Number(v))}
              suffix="kVA"
              step="10"
            />
            <NumField
              label="Consommation maximale actuelle"
              hint="Puissance de pointe constatée sur votre site (relevée sur facture ou compteur Linky)"
              value={puissanceActuelle}
              onChange={(v) => setPuissanceActuelle(Number(v))}
              suffix="kW"
              step="10"
            />
            <NumField
              label="Facteur de puissance (cos φ)"
              hint="Typiquement 0,85 à 0,95 pour un commerce. Visible sur votre facture."
              value={fp}
              onChange={(v) => setFp(parseFloat(v) || 0.9)}
              suffix="cos φ"
              step="0.01"
              min="0.7"
            />
          </div>

          {/* Bilan visuel */}
          <div className="rounded-2xl bg-madic-navy/5 p-5">
            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-madic-navy">Bilan de puissance</p>

            <div className="space-y-3">
              {[
                { label: "Puissance active disponible", value: `${Math.round(calc.puissanceDispoKw)} kW`, note: `${puissanceSouscrite} kVA × ${fp} cos φ` },
                { label: "Consommation actuelle", value: `${puissanceActuelle} kW`, note: "Pointe magasin" },
                { label: "Réserve disponible", value: `${Math.round(calc.puissanceRestante)} kW`, note: "Avant bornes", highlight: calc.puissanceRestante < 0 },
                { label: `Puissance requise — ${calc.nb} borne${calc.nb > 1 ? "s" : ""} Pulse 80`, value: `${calc.puissanceNecessaire} kW`, note: "80 kW / borne" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between rounded-xl bg-white px-4 py-2.5 shadow-sm">
                  <div>
                    <p className="text-sm font-semibold">{row.label}</p>
                    <p className="text-[11px] text-madic-grey-dark">{row.note}</p>
                  </div>
                  <p className={`text-base font-extrabold ${row.highlight ? "text-amber-600" : "text-madic-navy"}`}>{row.value}</p>
                </div>
              ))}
            </div>

            {/* Verdict */}
            <div className={`mt-4 rounded-2xl p-4 ${calc.compatible ? "bg-green-50 border border-green-100" : calc.gestionDynamique ? "bg-amber-50 border border-amber-100" : "bg-red-50 border border-red-100"}`}>
              {calc.compatible ? (
                <>
                  <p className="font-bold text-green-800">✓ Puissance suffisante</p>
                  <p className="mt-1 text-xs text-green-700">Votre abonnement actuel permet d'alimenter {calc.nb} borne{calc.nb > 1 ? "s" : ""} Pulse 80. Aucune modification de l'abonnement nécessaire.</p>
                </>
              ) : calc.gestionDynamique ? (
                <>
                  <p className="font-bold text-amber-800">⚡ Faisable avec gestion dynamique de puissance</p>
                  <p className="mt-1 text-xs text-amber-700">
                    Il manque {Math.round(calc.deficit)} kW. La gestion dynamique de puissance (DLM, incluse dans la Pulse 80) peut adapter la charge des bornes en temps réel pour éviter de dépasser votre abonnement. Aucune modification de contrat requise.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-bold text-red-800">⚠ Puissance insuffisante — augmentation d'abonnement recommandée</p>
                  <p className="mt-1 text-xs text-red-700">
                    Il manque {Math.round(calc.deficit)} kW. Contactez votre fournisseur d'énergie pour augmenter votre abonnement Tarif Jaune, ou réduisez le nombre de bornes. Un câblage depuis le TGBT avec 60 à 80 kW disponibles par borne est requis.
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button onClick={() => setStep(2)} className="flex-1 rounded-full border-2 border-madic-grey/30 py-3 text-sm font-semibold hover:border-madic-grey transition-colors">← Retour</button>
            <button onClick={() => setStep(4)} className="flex-[2] rounded-full bg-madic-red py-3 text-sm font-bold text-white shadow-lg shadow-madic-red/25 hover:bg-madic-red-dark transition-colors">Voir mon récapitulatif → Étape 4</button>
          </div>
        </Card>
      )}

      {/* ── Étape 4 : Résultats ─────────────────────────────────────────────── */}
      {step === 4 && (
        <div className="space-y-6">
          {/* KPIs principaux */}
          <Card>
            <SectionTitle>Récapitulatif de votre projet</SectionTitle>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <KpiBox label="Loyer mensuel total" value={euro(calc.loyerTotal)} sub={`${calc.nb} borne${calc.nb > 1 ? "s" : ""} tout inclus`} highlight />
              <KpiBox label="CA estimé / mois" value={euro(calc.caMois)} sub="Revente kWh" />
              <KpiBox label="Marge brute / mois" value={euro(calc.margeBrute)} sub="CA − élec − loyer" />
              <KpiBox label="Investissement GC+Élec" value={euro(calc.investTotal)} sub="Hors loyer, une seule fois" />
            </div>
          </Card>

          {/* Détail coûts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <SectionTitle sub="Mensuel HT">Détail des coûts mensuels</SectionTitle>
              <div className="space-y-2">
                {[
                  ["Loyer location (48 mois)", euro(calc.loyerBornes)],
                  ["Supervision Road (hors loyer)", euro(calc.supervision)],
                  ["GC + Élec amorti 10 ans", euro(calc.gcMensuel)],
                  ["Coût électricité acheté", euro(calc.coutElecMois)],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-madic-grey/10">
                    <span className="flex items-center gap-1.5 text-sm text-madic-grey-dark">
                      <Chevron className="h-3 w-3 text-madic-red" /> {k}
                    </span>
                    <span className="font-bold text-madic-navy">{v}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between rounded-xl bg-madic-red/5 px-3 py-2.5">
                  <span className="text-sm font-bold text-madic-red">Total charges / mois</span>
                  <span className="font-extrabold text-madic-red">{euro(calc.loyerTotal + calc.coutElecMois)}</span>
                </div>
              </div>
            </Card>

            <Card>
              <SectionTitle sub="Sur la durée du contrat 48 mois">Revenus et rentabilité</SectionTitle>
              <div className="space-y-2">
                {[
                  [`kWh revendus / mois (${calc.nb * 2} PDC)`, `${Math.round(calc.kwhMois).toLocaleString("fr-FR")} kWh`],
                  ["CA recharge / mois", euro(calc.caMois)],
                  ["Marge brute / mois", euro(calc.margeBrute)],
                  ["Marge brute sur 4 ans", euro(calc.margeSur4ans)],
                  ["Marge brute / an après 4 ans*", euro(calc.margeSurEnsuite * 12)],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-madic-grey/10">
                    <span className="flex items-center gap-1.5 text-sm text-madic-grey-dark">
                      <Chevron className="h-3 w-3 text-madic-red" /> {k}
                    </span>
                    <span className="font-bold text-madic-navy">{v}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-madic-grey">* Après 48 mois : remplacement borne, nouvelle offre ou démontage. Loyer reconduit estimé.</p>
            </Card>
          </div>

          {/* Paramètres ajustables */}
          <Card>
            <SectionTitle sub="Modifiez les hypothèses de taux de charge et prix kWh pour affiner la simulation.">
              Hypothèses de taux de charge
            </SectionTitle>
            <div className="grid gap-4 sm:grid-cols-3">
              <NumField label="Charges / jour / PDC" value={chargesJour} onChange={(v) => setChargesJour(Number(v))} suffix="ch/j" step="0.5" min="0" hint="Moyenne : 2,5 pour un hypermarché" />
              <NumField label="Prix de revente kWh DC" value={prixVente} onChange={(v) => setPrixVente(Number(v))} suffix="€/kWh" step="0.01" min="0" hint="Tarif pratiqué auprès des conducteurs VE" />
              <NumField label="Prix d'achat kWh" value={prixAchat} onChange={(v) => setPrixAchat(Number(v))} suffix="€/kWh" step="0.01" min="0" hint="Votre tarif Tarif Jaune / heures creuses" />
            </div>
          </Card>

          {/* Récap puissance */}
          <div className={`rounded-3xl border p-5 ${calc.compatible ? "border-green-100 bg-green-50" : calc.gestionDynamique ? "border-amber-100 bg-amber-50" : "border-red-100 bg-red-50"}`}>
            <p className={`text-sm font-bold ${calc.compatible ? "text-green-800" : calc.gestionDynamique ? "text-amber-800" : "text-red-800"}`}>
              {calc.compatible ? "✓ Puissance disponible OK" : calc.gestionDynamique ? "⚡ Faisable avec DLM" : "⚠ Révision abonnement nécessaire"}
              {" "}— Réserve disponible : {Math.round(calc.puissanceRestante)} kW / {calc.puissanceNecessaire} kW requis
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button onClick={() => setStep(1)} className="flex-1 rounded-full border-2 border-madic-grey/30 py-3.5 text-sm font-semibold hover:border-madic-grey transition-colors">← Modifier ma configuration</button>
            <a href="/#contact" className="flex-[2] rounded-full bg-madic-red py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-madic-red/25 hover:bg-madic-red-dark transition-colors">
              Obtenir mon étude personnalisée MADIC →
            </a>
          </div>

          <p className="text-center text-xs text-madic-grey-dark">
            Estimation non contractuelle. Prix HT. Basé sur l'offre MADIC Pulse 80 DC — Location 48 mois avec maintenance complète incluse.
          </p>
        </div>
      )}
    </div>
  );
}
