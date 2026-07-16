"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ouvrirRapport } from "./rapportEtude";

/**
 * Module « Étude de site » (P0) — aide à la vente IRVE.
 *
 * L'utilisateur choisit un emplacement (recherche d'adresse ou clic sur la carte).
 * Le module interroge, cote serveur : Nominatim (adresse), OpenChargeMap (bornes
 * concurrentes), Overpass/OSM (commerces). Il en déduit un score d'attractivité /100
 * puis, via un entonnoir d'hypothèses MODIFIABLES, une estimation de sessions/jour,
 * de chiffre d'affaires et de retour sur investissement.
 *
 * Toutes les hypothèses sont explicites et ajustables : c'est une ESTIMATION,
 * pas un engagement contractuel.
 */

const FRANCE = { lat: 46.6, lon: 2.4, zoom: 6 };

// Modèles de borne (capex indicatif, points de charge, puissance par point).
const MODELS = [
  { id: "walbox", name: "WalBox AC", price: 4000, points: 1, kw: 22 },
  { id: "22gl", name: "22GL", price: 12000, points: 2, kw: 22 },
  { id: "pulse2080", name: "Pulse 20-80", price: 30000, points: 2, kw: 80 },
  { id: "pulse400", name: "Pulse 400", price: 150000, points: 2, kw: 400 },
];

const euro = (n) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(
    isFinite(n) ? n : 0
  );
const num = (n) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(isFinite(n) ? n : 0);
const fmtDist = (m) => (m < 1000 ? `${m} m` : `${(m / 1000).toFixed(1)} km`);

function rating(score) {
  if (score >= 80) return { label: "Excellent investissement", color: "#16a34a", emoji: "🟢" };
  if (score >= 65) return { label: "Bon potentiel", color: "#ca8a04", emoji: "🟡" };
  if (score >= 45) return { label: "À étudier", color: "#ea580c", emoji: "🟠" };
  return { label: "Peu rentable", color: "#dc2626", emoji: "🔴" };
}

/**
 * Champ d'entonnoir à double saisie liée : pourcentage OU nombre de véhicules/jour.
 * `base` est l'effectif de l'étape précédente (ex. trafic pour le % de VE) ;
 * modifier l'un des deux champs recalcule l'autre.
 */
function FunnelField({ label, baseLabel, pct, onPct, base }) {
  const count = Math.round((Number(base) || 0) * (Number(pct) || 0) / 100);
  const pctShown = Math.round((Number(pct) || 0) * 100) / 100;
  return (
    <div className="block">
      <span className="mb-1 block text-[11px] font-semibold text-[#16202c]">{label}</span>
      <div className="flex gap-1.5">
        <div className="flex min-w-0 flex-1 items-center rounded-lg border border-madic-grey/40 bg-white focus-within:border-madic-red">
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={pctShown}
            onChange={(e) => onPct(Number(e.target.value))}
            className="w-full min-w-0 rounded-lg bg-transparent px-2.5 py-2 text-sm outline-none"
          />
          <span className="px-1.5 text-[11px] text-madic-grey-dark">%</span>
        </div>
        <div className="flex min-w-0 flex-1 items-center rounded-lg border border-madic-grey/40 bg-white focus-within:border-madic-red">
          <input
            type="number"
            min="0"
            value={count}
            onChange={(e) => {
              const b = Number(base) || 0;
              onPct(b > 0 ? (Number(e.target.value) / b) * 100 : 0);
            }}
            className="w-full min-w-0 rounded-lg bg-transparent px-2.5 py-2 text-sm outline-none"
          />
          <span className="whitespace-nowrap px-1.5 text-[11px] text-madic-grey-dark">véh./j</span>
        </div>
      </div>
      <span className="mt-0.5 block text-[10px] text-madic-grey-dark">{baseLabel}</span>
    </div>
  );
}

function Field({ label, children, suffix }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold text-[#16202c]">{label}</span>
      <div className="flex items-center rounded-lg border border-madic-grey/40 bg-white focus-within:border-madic-red">
        {children}
        {suffix && <span className="px-2 text-[11px] text-madic-grey-dark">{suffix}</span>}
      </div>
    </label>
  );
}

export default function EtudeDeSite() {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const layersRef = useRef(null);

  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [selected, setSelected] = useState(null); // { lat, lon, label }
  const [loadingData, setLoadingData] = useState(false);
  const [chargers, setChargers] = useState([]);
  const [chargersMsg, setChargersMsg] = useState("");
  const [pois, setPois] = useState({ results: [], summary: [], total: 0, avgStayMin: null });
  const [pop, setPop] = useState(null); // { commune, department, radii: [{ km, population }] }
  const [trafficInfo, setTrafficInfo] = useState(null); // { route, tmja, pctPL, distanceM, autofilled }

  // Hypothèses de l'entonnoir (toutes modifiables).
  const [traffic, setTraffic] = useState(30000); // véhicules/jour
  const [pctVE, setPctVE] = useState(15); // % de véhicules électriques
  const [pctNeed, setPctNeed] = useState(6); // % ayant besoin de recharge
  const [pctChoose, setPctChoose] = useState(3); // % qui choisissent notre station
  const [kwhSession, setKwhSession] = useState(30);
  const [priceSell, setPriceSell] = useState(0.45);
  const [priceBuy, setPriceBuy] = useState(0.2);
  const [access, setAccess] = useState(60); // accessibilité 0-100 (saisie manuelle P0)
  const [modelId, setModelId] = useState("pulse2080");
  const [qty, setQty] = useState(2);

  // --- Initialisation de la carte (une seule fois) ---
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;
    const map = L.map(containerRef.current).setView([FRANCE.lat, FRANCE.lon], FRANCE.zoom);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }).addTo(map);
    layersRef.current = L.layerGroup().addTo(map);
    map.on("click", (e) => selectSite(e.latlng.lat, e.latlng.lng));
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Sélection d'un site (clic ou recherche) ---
  const selectSite = async (lat, lon, label) => {
    setSelected({ lat, lon, label: label || "Chargement de l'adresse…" });
    if (mapRef.current) mapRef.current.setView([lat, lon], 13);
    if (!label) {
      try {
        const r = await fetch(`/api/geocode?lat=${lat}&lon=${lon}`);
        const d = await r.json();
        const found = d.results && d.results[0];
        setSelected({ lat, lon, label: found ? found.label : `${lat.toFixed(4)}, ${lon.toFixed(4)}` });
      } catch {
        setSelected({ lat, lon, label: `${lat.toFixed(4)}, ${lon.toFixed(4)}` });
      }
    }
    fetchData(lat, lon);
  };

  const doSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setSearchError("");
    try {
      const r = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
      const d = await r.json();
      const first = d.results && d.results[0];
      if (first) selectSite(first.lat, first.lon, first.label);
      else setSearchError("Adresse introuvable.");
    } catch {
      setSearchError("Erreur lors de la recherche.");
    } finally {
      setSearching(false);
    }
  };

  const fetchData = async (lat, lon) => {
    setLoadingData(true);
    setChargersMsg("");
    const [chRes, poiRes, popRes, trafRes] = await Promise.allSettled([
      fetch(`/api/chargers?lat=${lat}&lon=${lon}&distance=10`).then((r) => r.json()),
      fetch(`/api/pois?lat=${lat}&lon=${lon}&radius=1500`).then((r) => r.json()),
      fetch(`/api/population?lat=${lat}&lon=${lon}`).then((r) => r.json()),
      fetch(`/api/traffic?lat=${lat}&lon=${lon}`).then((r) => r.json()),
    ]);
    if (chRes.status === "fulfilled") {
      setChargers(chRes.value.results || []);
      if (chRes.value.error) setChargersMsg(chRes.value.error);
    } else {
      setChargers([]);
      setChargersMsg("Bornes indisponibles.");
    }
    if (poiRes.status === "fulfilled") {
      setPois({
        results: poiRes.value.results || [],
        summary: poiRes.value.summary || [],
        total: poiRes.value.total || 0,
        avgStayMin: poiRes.value.avgStayMin ?? null,
      });
    } else {
      setPois({ results: [], summary: [], total: 0, avgStayMin: null });
    }
    if (popRes.status === "fulfilled" && !popRes.value.error) setPop(popRes.value);
    else setPop(null);
    if (trafRes.status === "fulfilled" && trafRes.value.nearest) {
      const n = trafRes.value.nearest;
      const autofilled = n.distanceM <= 2000;
      if (autofilled) setTraffic(n.tmja);
      setTrafficInfo({ ...n, autofilled });
    } else {
      setTrafficInfo(null);
    }
    setLoadingData(false);
  };

  // --- Dessin des couches sur la carte ---
  useEffect(() => {
    const map = mapRef.current;
    const group = layersRef.current;
    if (!map || !group || !selected) return;
    group.clearLayers();

    const { lat, lon } = selected;
    const myKw = (MODELS.find((m) => m.id === modelId) || MODELS[0]).kw;

    // Rayons 5 / 10 / 20 km
    [
      { r: 5000, color: "#eab308" },
      { r: 10000, color: "#64748b" },
      { r: 20000, color: "#dc2626" },
    ].forEach(({ r, color }) =>
      L.circle([lat, lon], { radius: r, color, weight: 1, fill: false, dashArray: "4 4", opacity: 0.5 }).addTo(group)
    );

    // Commerces (violet, petits) — dessous
    pois.results.forEach((p) =>
      L.circleMarker([p.lat, p.lon], { radius: 3.5, color: "#7c3aed", weight: 1, fillColor: "#a78bfa", fillOpacity: 0.75 })
        .addTo(group)
        .bindPopup(`${p.categoryLabel}${p.name ? " · " + p.name : ""}`)
    );

    // Bornes concurrentes : couleur selon la puissance face au projet, taille selon la puissance.
    chargers.forEach((c) => {
      const ratio = c.maxKw > 0 ? c.maxKw / myKw : null;
      let color, niveau;
      if (ratio === null) { color = "#94a3b8"; niveau = "puissance inconnue"; }
      else if (ratio >= 0.7) { color = "#dc2626"; niveau = "concurrent direct"; }
      else if (ratio >= 0.3) { color = "#f59e0b"; niveau = "concurrent partiel"; }
      else { color = "#94a3b8"; niveau = "bien plus lent"; }
      const radius = Math.max(4, Math.min(12, 4 + (c.maxKw || 0) / 45));
      L.circleMarker([c.lat, c.lon], { radius, color: "#ffffff", weight: 1.5, fillColor: color, fillOpacity: 0.9 })
        .addTo(group)
        .bindPopup(`<b>${c.title}</b><br>${c.operator}<br>${c.points} pt(s) · ${c.maxKw || "?"} kW<br><i>${niveau}</i>`);
    });

    // Site étudié : gros repère MADIC, au-dessus de tout.
    L.circleMarker([lat, lon], { radius: 12, color: "#ffffff", weight: 4, fillColor: "#d70926", fillOpacity: 1 })
      .addTo(group)
      .bindPopup("Site étudié");
  }, [selected, chargers, pois, modelId]);

  // --- Calcul économique + score ---
  const calc = useMemo(() => {
    const model = MODELS.find((m) => m.id === modelId) || MODELS[0];

    // Économie (calculée d'abord : le ROI alimente le score).
    const sessionsDay = traffic * (pctVE / 100) * (pctNeed / 100) * (pctChoose / 100);
    const kwhYear = sessionsDay * 365 * Number(kwhSession || 0);
    const caYear = kwhYear * Number(priceSell || 0);
    const energyCost = kwhYear * Number(priceBuy || 0);
    const opex = caYear * 0.12; // maintenance + supervision indicatifs (12 % du CA)
    const marginYear = caYear - energyCost - opex;
    const capex = model.price * Math.max(1, Number(qty || 1));
    const roi = marginYear > 0 ? capex / marginYear : Infinity;

    // Concurrence pondérée par la puissance : une borne bien plus lente que le
    // modèle installé (ex. 22 kW face à du 400 kW DC) n'est pas un vrai concurrent.
    let effectiveCompetition = 0;
    let directCompetitors = 0;
    for (const c of chargers) {
      const ratio = c.maxKw > 0 ? c.maxKw / model.kw : null;
      let w;
      if (ratio === null) w = 0.3; // puissance inconnue : demi-doute
      else if (ratio >= 0.7) w = 1; // comparable ou supérieure : concurrent direct
      else if (ratio >= 0.3) w = 0.5; // intermédiaire : concurrent partiel
      else w = 0.1; // beaucoup plus lente : quasi négligeable
      if (w === 1) directCompetitors++;
      effectiveCompetition += w;
    }

    // Score /100 : critères saturants à des seuils réalistes.
    const sat = (v, cap) => Math.min(v / cap, 1) * 100;
    const pop10 = pop?.radii?.find((r) => r.km === 10)?.population || 0;
    const trafficScore = sat(traffic, 40000); // plein dès 40 000 véh./j
    const populationScore = sat(pop10, 50000); // plein dès 50 000 hab. à 10 km
    const commerceScore = sat(pois.total, 30);
    const competitionScore = Math.max(0, 1 - effectiveCompetition / 15) * 100;
    const accessScore = access;
    const stationScore = pois.avgStayMin ? sat(pois.avgStayMin, 60) : 50; // neutre si inconnu
    const roiScore = !isFinite(roi)
      ? 0
      : roi <= 1
        ? 100
        : roi <= 3
          ? 100 - (roi - 1) * 20 // 1 an -> 100, 3 ans -> 60
          : roi <= 8
            ? 60 - (roi - 3) * 10 // 3 ans -> 60, 8 ans -> 10
            : 10;
    const score = Math.round(
      0.25 * trafficScore +
        0.2 * roiScore +
        0.15 * competitionScore +
        0.1 * populationScore +
        0.1 * commerceScore +
        0.1 * accessScore +
        0.1 * stationScore
    );

    return { score, directCompetitors, sessionsDay, kwhYear, caYear, marginYear, capex, roi };
  }, [traffic, pctVE, pctNeed, pctChoose, kwhSession, priceSell, priceBuy, access, pois.total, pois.avgStayMin, pop, chargers, modelId, qty]);

  const r = rating(calc.score);

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm md:p-6">
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-widest text-madic-red">Aide à la vente</p>
        <h2 className="mt-1 text-2xl font-extrabold text-madic-navy">Étude de site</h2>
        <p className="mt-1 text-sm text-madic-grey-dark">
          Cherchez une adresse ou cliquez sur la carte : le module récupère les bornes concurrentes et les
          commerces alentour, calcule un score de potentiel et estime le retour sur investissement.
        </p>
      </div>

      {/* Recherche */}
      <form onSubmit={doSearch} className="mb-4 flex flex-col gap-2 sm:flex-row">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Adresse, ville, lieu… (ex. Rezé, ou une aire d'autoroute)"
          className="w-full rounded-lg border border-madic-grey/40 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-madic-red"
        />
        <button
          type="submit"
          disabled={searching}
          className="shrink-0 rounded-full bg-madic-red px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-madic-red-dark disabled:opacity-60"
        >
          {searching ? "Recherche…" : "Analyser"}
        </button>
      </form>
      {searchError && <p className="mb-3 text-xs font-semibold text-red-600">{searchError}</p>}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
        {/* Carte */}
        <div>
          <div ref={containerRef} className="h-[460px] w-full overflow-hidden rounded-2xl ring-1 ring-madic-grey/20" />
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-madic-grey-dark">
            <span><span className="inline-block h-3 w-3 rounded-full border border-white bg-madic-red align-middle shadow" /> Site</span>
            <span><span className="inline-block h-2.5 w-2.5 rounded-full align-middle" style={{ backgroundColor: "#dc2626" }} /> Concurrent direct</span>
            <span><span className="inline-block h-2.5 w-2.5 rounded-full align-middle" style={{ backgroundColor: "#f59e0b" }} /> Concurrent partiel</span>
            <span><span className="inline-block h-2.5 w-2.5 rounded-full align-middle" style={{ backgroundColor: "#94a3b8" }} /> Plus lent</span>
            <span><span className="inline-block h-2 w-2 rounded-full bg-violet-400 align-middle" /> Commerces</span>
            <span>Taille = puissance · Cercles : 5 / 10 / 20 km</span>
          </div>
        </div>

        {/* Panneau résultats */}
        <div className="space-y-4">
          {!selected ? (
            <div className="flex h-full min-h-[200px] items-center justify-center rounded-2xl bg-madic-grey/5 p-6 text-center text-sm text-madic-grey-dark">
              Choisissez un emplacement pour lancer l'analyse.
            </div>
          ) : (
            <>
              <div className="rounded-2xl bg-madic-navy/5 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-madic-grey-dark">Site étudié</p>
                <p className="mt-0.5 text-sm font-medium text-[#16202c]">{selected.label}</p>
                {loadingData && <p className="mt-1 text-xs text-madic-grey-dark">Récupération des données…</p>}
              </div>

              {/* Score */}
              <div className="rounded-2xl border border-madic-grey/20 p-4 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-madic-grey-dark">Score de potentiel</p>
                <p className="mt-1 text-4xl font-extrabold" style={{ color: r.color }}>{calc.score}<span className="text-lg text-madic-grey-dark">/100</span></p>
                <p className="mt-1 text-sm font-bold" style={{ color: r.color }}>{r.emoji} {r.label}</p>
              </div>

              {/* Données récupérées */}
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="rounded-xl bg-madic-grey/5 p-3">
                  <p className="text-2xl font-extrabold text-[#16202c]">{chargers.length}</p>
                  <p className="text-[11px] text-madic-grey-dark">bornes concurrentes (10 km)</p>
                  {chargers.length > 0 && (
                    <p className="text-[11px] font-semibold text-madic-red">
                      dont {calc.directCompetitors} de puissance comparable
                    </p>
                  )}
                </div>
                <div className="rounded-xl bg-madic-grey/5 p-3">
                  <p className="text-2xl font-extrabold text-[#16202c]">{pois.total}</p>
                  <p className="text-[11px] text-madic-grey-dark">commerces (1,5 km)</p>
                </div>
              </div>
              {pop && (
                <div className="rounded-xl bg-madic-grey/5 p-3 text-center">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-madic-grey-dark">Population</p>
                  <p className="mt-1 text-sm text-[#16202c]">
                    <strong>{num(pop.radii.find((r) => r.km === 5)?.population || 0)}</strong> à 5 km ·{" "}
                    <strong>{num(pop.radii.find((r) => r.km === 10)?.population || 0)}</strong> à 10 km ·{" "}
                    <strong>{num(pop.radii.find((r) => r.km === 20)?.population || 0)}</strong> à 20 km
                  </p>
                  {pop.commune && (
                    <p className="mt-0.5 text-[11px] text-madic-grey-dark">
                      Commune : {pop.commune.nom} ({num(pop.commune.population)} hab.)
                    </p>
                  )}
                </div>
              )}
              {trafficInfo && (
                <div className="rounded-xl bg-madic-grey/5 p-3">
                  {trafficInfo.autofilled ? (
                    <p className="text-sm text-[#16202c]">
                      🚗 <strong>Trafic auto : {num(trafficInfo.tmja)} véh./j</strong>
                      <span className="text-madic-grey-dark"> ({trafficInfo.route}, à {fmtDist(trafficInfo.distanceM)}) · source Cerema</span>
                    </p>
                  ) : (
                    <p className="text-sm text-madic-grey-dark">
                      🚗 Aucun axe majeur compté à proximité (le plus proche : {trafficInfo.route} à {fmtDist(trafficInfo.distanceM)}). Trafic à saisir à la main.
                    </p>
                  )}
                </div>
              )}
              {chargersMsg && <p className="text-[11px] italic text-amber-700">{chargersMsg}</p>}
              {pois.summary.length > 0 && (
                <p className="text-[11px] text-madic-grey-dark">
                  {pois.summary.map((s) => `${s.count} ${s.label.toLowerCase()}`).join(" · ")}
                  {pois.avgStayMin ? ` · stationnement moyen ≈ ${pois.avgStayMin} min` : ""}
                </p>
              )}

              {/* Résultat économique */}
              <div className="rounded-2xl bg-madic-ink p-4 text-white">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-white/50">CA annuel estimé</p>
                    <p className="text-3xl font-extrabold">{euro(calc.caYear)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] uppercase tracking-wider text-white/50">Retour</p>
                    <p className="text-2xl font-extrabold text-madic-red">{isFinite(calc.roi) ? `${calc.roi.toFixed(1)} ans` : "n/a"}</p>
                  </div>
                </div>
                <p className="mt-2 text-xs text-white/60">
                  ≈ {num(calc.sessionsDay)} session(s)/jour · marge {euro(calc.marginYear)}/an · investissement {euro(calc.capex)}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  ouvrirRapport({
                    siteLabel: selected.label,
                    lat: selected.lat,
                    lon: selected.lon,
                    communeNom: pop?.commune?.nom || null,
                    score: calc.score,
                    rating: r,
                    caYear: calc.caYear,
                    marginYear: calc.marginYear,
                    sessionsDay: calc.sessionsDay,
                    roi: calc.roi,
                    capex: calc.capex,
                    traffic,
                    trafficAuto: !!trafficInfo?.autofilled,
                    trafficRoute: trafficInfo?.route || "",
                    pop5: pop?.radii?.find((x) => x.km === 5)?.population || 0,
                    pop10: pop?.radii?.find((x) => x.km === 10)?.population || 0,
                    pop20: pop?.radii?.find((x) => x.km === 20)?.population || 0,
                    poisTotal: pois.total,
                    poisSummary: pois.summary,
                    avgStayMin: pois.avgStayMin,
                    chargers,
                    directCompetitors: calc.directCompetitors,
                    pctVE,
                    pctNeed,
                    pctChoose,
                    kwhSession,
                    priceSell,
                    priceBuy,
                    modelName: (MODELS.find((m) => m.id === modelId) || MODELS[0]).name,
                    modelKw: (MODELS.find((m) => m.id === modelId) || MODELS[0]).kw,
                    qty: Math.max(1, Number(qty || 1)),
                  })
                }
                disabled={loadingData}
                className="w-full rounded-full bg-madic-navy px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-madic-navy/90 disabled:opacity-50"
              >
                📄 Générer le rapport PDF
              </button>
            </>
          )}
        </div>
      </div>

      {/* Hypothèses (entonnoir) */}
      <div className="mt-5 rounded-2xl border border-madic-grey/20 bg-[#fafbfc] p-4">
        <p className="mb-3 text-sm font-bold text-[#16202c]">
          Hypothèses de l'entonnoir <span className="font-normal text-madic-grey-dark">(ajustez selon le site)</span>
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <Field label="Trafic" suffix="véh./j">
            <input type="number" min="0" value={traffic} onChange={(e) => setTraffic(Number(e.target.value))} className="w-full rounded-lg bg-transparent px-2.5 py-2 text-sm outline-none" />
          </Field>
          <FunnelField
            label="Véhicules électriques"
            baseLabel="% du trafic"
            pct={pctVE}
            onPct={setPctVE}
            base={traffic}
          />
          <FunnelField
            label="Ont besoin de recharge"
            baseLabel="% des véhicules électriques"
            pct={pctNeed}
            onPct={setPctNeed}
            base={(Number(traffic) || 0) * (Number(pctVE) || 0) / 100}
          />
          <FunnelField
            label="Choisissent la station"
            baseLabel="% de ceux qui ont besoin (= sessions/jour)"
            pct={pctChoose}
            onPct={setPctChoose}
            base={(Number(traffic) || 0) * (Number(pctVE) || 0) / 100 * (Number(pctNeed) || 0) / 100}
          />
          <Field label="kWh par session" suffix="kWh">
            <input type="number" min="0" value={kwhSession} onChange={(e) => setKwhSession(Number(e.target.value))} className="w-full rounded-lg bg-transparent px-2.5 py-2 text-sm outline-none" />
          </Field>
          <Field label="Prix de revente" suffix="€/kWh">
            <input type="number" min="0" step="0.01" value={priceSell} onChange={(e) => setPriceSell(Number(e.target.value))} className="w-full rounded-lg bg-transparent px-2.5 py-2 text-sm outline-none" />
          </Field>
          <Field label="Prix d'achat élec." suffix="€/kWh">
            <input type="number" min="0" step="0.01" value={priceBuy} onChange={(e) => setPriceBuy(Number(e.target.value))} className="w-full rounded-lg bg-transparent px-2.5 py-2 text-sm outline-none" />
          </Field>
          <Field label="Accessibilité" suffix="/100">
            <input type="number" min="0" max="100" value={access} onChange={(e) => setAccess(Number(e.target.value))} className="w-full rounded-lg bg-transparent px-2.5 py-2 text-sm outline-none" />
          </Field>
          <label className="block">
            <span className="mb-1 block text-[11px] font-semibold text-[#16202c]">Modèle de borne</span>
            <select value={modelId} onChange={(e) => setModelId(e.target.value)} className="w-full rounded-lg border border-madic-grey/40 bg-white px-2.5 py-2 text-sm outline-none focus:border-madic-red">
              {MODELS.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </label>
          <Field label="Nombre de bornes">
            <input type="number" min="1" value={qty} onChange={(e) => setQty(Number(e.target.value))} className="w-full rounded-lg bg-transparent px-2.5 py-2 text-sm outline-none" />
          </Field>
        </div>
      </div>

      <p className="mt-4 text-[11px] italic leading-relaxed text-madic-grey-dark">
        Estimation indicative et non contractuelle. Les données proviennent d'OpenStreetMap et d'OpenChargeMap
        (couverture variable). Le trafic et les taux de conversion sont des hypothèses à valider : le résultat ne
        constitue pas un engagement de MADIC sur un niveau de chiffre d'affaires.
      </p>
    </div>
  );
}
