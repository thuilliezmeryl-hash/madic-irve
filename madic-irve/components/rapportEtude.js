// Génération du rapport d'étude de site (impression -> PDF via le navigateur).
// Construit une page A4 autonome avec les données de l'analyse, puis lance
// l'impression : le commercial l'enregistre en PDF et la présente au client.

const euro = (n) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(
    isFinite(n) ? n : 0
  );
const num = (n) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(isFinite(n) ? n : 0);
const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Fléchon hexagonal MADIC (repris de components/icons.js), en blanc sur le repère.
const CHEVRON = "M9 5 L17 12 L9 19 L6 19 L13 12 L6 5 Z";

/**
 * Schéma de situation : vraie carte OpenStreetMap en fond (assemblée par
 * /api/staticmap, les tuiles n'étant pas capturables depuis le navigateur),
 * surmontée d'un calque SVG (rayons, concurrents, site) calé sur l'échelle
 * réelle de la carte au zoom choisi.
 */
function schemaBlock(d) {
  const size = 320;
  const zoom = 10;
  const cx = size / 2;
  const cy = size / 2;
  const R = 10000; // rayon représenté : 10 km

  // Échelle exacte des tuiles OSM au zoom donné, pour que le calque colle au fond.
  const mPerPx = (156543.03392 * Math.cos((d.lat * Math.PI) / 180)) / Math.pow(2, zoom);
  const mToPx = 1 / mPerPx;
  const cos = Math.cos((d.lat * Math.PI) / 180);

  const rings = [5000, 10000]
    .map(
      (r) =>
        `<circle cx="${cx}" cy="${cy}" r="${(r * mToPx).toFixed(1)}" fill="none" stroke="#16202c" stroke-opacity="0.45" stroke-width="1" stroke-dasharray="4 3"/>`
    )
    .join("");
  const ringLabels = [5000, 10000]
    .map(
      (r) =>
        `<text x="${cx}" y="${(cy - r * mToPx - 3).toFixed(1)}" font-size="8" font-weight="700" fill="#16202c" fill-opacity="0.6" text-anchor="middle">${r / 1000} km</text>`
    )
    .join("");

  const dots = (d.chargers || [])
    .filter((c) => c.lat && c.lon)
    .map((c) => {
      const dx = (c.lon - d.lon) * cos * 111320;
      const dy = (c.lat - d.lat) * 110540;
      if (Math.hypot(dx, dy) > R) return "";
      const x = cx + dx * mToPx;
      const y = cy - dy * mToPx;
      const ratio = c.maxKw > 0 ? c.maxKw / (d.modelKw || 80) : null;
      const color = ratio === null ? "#94a3b8" : ratio >= 0.7 ? "#dc2626" : ratio >= 0.3 ? "#f59e0b" : "#94a3b8";
      const rr = Math.max(2.5, Math.min(7, 2.5 + (c.maxKw || 0) / 70));
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rr.toFixed(1)}" fill="${color}" fill-opacity="0.95" stroke="#fff" stroke-width="1"/>`;
    })
    .join("");

  // Repère du site : point rouge MADIC + fléchon blanc par-dessus.
  const site =
    `<circle cx="${cx}" cy="${cy}" r="11" fill="#d70926" stroke="#fff" stroke-width="2.5"/>` +
    `<g transform="translate(${cx - 7},${cy - 7}) scale(0.583)"><path d="${CHEVRON}" fill="#fff"/></g>`;

  const mapUrl = `/api/staticmap?lat=${d.lat}&lon=${d.lon}&zoom=${zoom}&size=${size}`;
  return `<div style="position:relative;width:${size}px;height:${size}px;flex:0 0 auto">
    <img src="${mapUrl}" width="${size}" height="${size}" alt="Carte du site" style="position:absolute;left:0;top:0;border-radius:6px;border:1px solid #e3e7ee">
    <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" style="position:absolute;left:0;top:0" xmlns="http://www.w3.org/2000/svg">${rings}${ringLabels}${dots}${site}</svg>
  </div>`;
}

export function ouvrirRapport(d) {
  const dateStr = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const r = d.rating;

  const chargerRows = (d.chargers || [])
    .slice()
    .sort((a, b) => (a.distanceKm ?? 99) - (b.distanceKm ?? 99))
    .slice(0, 10)
    .map(
      (c) => `<tr>
        <td>${esc(c.title)}</td>
        <td>${esc(c.operator)}</td>
        <td class="r">${c.points}</td>
        <td class="r">${c.maxKw ? num(c.maxKw) + " kW" : "?"}</td>
        <td class="r">${c.distanceKm != null ? c.distanceKm.toFixed(1) + " km" : "?"}</td>
      </tr>`
    )
    .join("");

  const poiCells = (d.poisSummary || [])
    .map((s) => `<span class="chip">${s.count} ${esc(s.label.toLowerCase())}</span>`)
    .join(" ");

  const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>Étude de site IRVE - ${esc(d.communeNom || d.siteLabel)}</title>
<style>
  * { box-sizing: border-box; margin: 0; }
  @page { size: A4; margin: 14mm 13mm; }
  body { font-family: "Segoe UI", system-ui, -apple-system, sans-serif; color: #16202c; font-size: 10.5pt; line-height: 1.45;
    -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .head { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #d70926; padding-bottom: 4mm; margin-bottom: 5mm; }
  .head h1 { font-size: 16pt; letter-spacing: -0.01em; }
  .head .brand { font-size: 13pt; font-weight: 800; color: #d70926; text-align: right; }
  .head .brand small { display: block; font-weight: 600; color: #5c6672; font-size: 8pt; letter-spacing: .12em; text-transform: uppercase; }
  .meta { color: #5c6672; font-size: 9pt; margin-top: 1mm; }
  .site { background: #f4f6f9; border-radius: 3mm; padding: 3.5mm 4.5mm; margin-bottom: 5mm; }
  .site .lbl { font-size: 7.5pt; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #8a94a1; }
  .site .val { font-weight: 600; margin-top: 1mm; }
  .cols { display: flex; gap: 4mm; margin-bottom: 5mm; }
  .card { flex: 1; border: 1px solid #e3e7ee; border-radius: 3mm; padding: 3.5mm 4mm; text-align: center; }
  .card .lbl { font-size: 7.5pt; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #8a94a1; }
  .card .big { font-size: 20pt; font-weight: 800; margin-top: 1mm; }
  .card .sub { font-size: 8.5pt; color: #5c6672; }
  .score { color: ${r.color}; }
  .dark { background: #0a1422; color: #fff; border: 0; }
  .dark .lbl { color: rgba(255,255,255,.55); }
  .dark .sub { color: rgba(255,255,255,.65); }
  .roi { color: #ff5566; }
  h2 { font-size: 11pt; margin: 5mm 0 2.5mm; padding-left: 2.5mm; border-left: 3mm solid #d70926; }
  table { width: 100%; border-collapse: collapse; font-size: 9pt; }
  th, td { text-align: left; padding: 1.6mm 2.5mm; border-bottom: 1px solid #e9edf2; }
  th { font-size: 7.5pt; letter-spacing: .08em; text-transform: uppercase; color: #8a94a1; }
  td.r, th.r { text-align: right; font-variant-numeric: tabular-nums; }
  .chip { display: inline-block; background: #f4f6f9; border-radius: 2mm; padding: 1mm 2.5mm; font-size: 8.5pt; margin: .6mm .6mm .6mm 0; }
  .hyp { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2mm; }
  .hyp div { border: 1px solid #e9edf2; border-radius: 2mm; padding: 2mm 2.5mm; }
  .hyp .k { font-size: 7.5pt; color: #8a94a1; text-transform: uppercase; letter-spacing: .06em; }
  .hyp .v { font-weight: 700; font-size: 10pt; }
  .disc { margin-top: 6mm; padding-top: 3mm; border-top: 1px solid #e3e7ee; font-size: 7.5pt; color: #8a94a1; font-style: italic; }
  .nores { color: #8a94a1; font-style: italic; font-size: 9pt; }
</style>
</head>
<body>
  <div class="head">
    <div>
      <h1>Étude de site &mdash; recharge électrique</h1>
      <div class="meta">Rapport généré le ${dateStr}</div>
    </div>
    <img id="logo" src="/logos/madic-group-quadri.png" alt="MADIC" style="height:12mm;width:auto">
  </div>

  <div class="site">
    <div class="lbl">Site étudié</div>
    <div class="val">${esc(d.siteLabel)}</div>
    <div class="meta">Coordonnées : ${d.lat.toFixed(5)}, ${d.lon.toFixed(5)}${d.communeNom ? " · Commune : " + esc(d.communeNom) : ""}</div>
  </div>

  <div class="cols">
    <div class="card">
      <div class="lbl">Score de potentiel</div>
      <div class="big score">${d.score}<span style="font-size:11pt;color:#8a94a1">/100</span></div>
      <div class="sub" style="color:${r.color};font-weight:700">${r.emoji} ${esc(r.label)}</div>
    </div>
    <div class="card dark">
      <div class="lbl">CA annuel estimé</div>
      <div class="big">${euro(d.caYear)}</div>
      <div class="sub">&asymp; ${num(d.sessionsDay)} session(s)/jour · marge ${euro(d.marginYear)}/an</div>
    </div>
    <div class="card dark">
      <div class="lbl">Retour sur investissement</div>
      <div class="big roi">${isFinite(d.roi) ? d.roi.toFixed(1) + " ans" : "n/a"}</div>
      <div class="sub">Investissement ${euro(d.capex)} (${esc(d.modelName)} &times; ${d.qty})</div>
    </div>
  </div>

  <h2>Environnement du site</h2>
  <table>
    <tr><th>Indicateur</th><th>Valeur</th><th>Source</th></tr>
    <tr><td>Trafic routier</td><td><strong>${num(d.traffic)} véh./jour</strong>${d.trafficAuto ? " (" + esc(d.trafficRoute) + ")" : " (saisie manuelle)"}</td><td>${d.trafficAuto ? "Comptage Cerema / data.gouv.fr" : "Estimation utilisateur"}</td></tr>
    <tr><td>Population</td><td><strong>${num(d.pop5)}</strong> à 5 km · <strong>${num(d.pop10)}</strong> à 10 km · <strong>${num(d.pop20)}</strong> à 20 km</td><td>geo.api.gouv.fr</td></tr>
    <tr><td>Commerces (1,5 km)</td><td><strong>${d.poisTotal}</strong>${d.avgStayMin ? " · stationnement moyen &asymp; " + d.avgStayMin + " min" : ""}</td><td>OpenStreetMap</td></tr>
    <tr><td>Bornes concurrentes (10 km)</td><td><strong>${(d.chargers || []).length}</strong>${d.directCompetitors != null ? " · dont <strong>" + d.directCompetitors + "</strong> de puissance comparable au projet" : ""}</td><td>OpenChargeMap</td></tr>
  </table>
  ${poiCells ? `<div style="margin-top:2mm">${poiCells}</div>` : ""}

  <h2>Schéma de situation</h2>
  <div style="display:flex; gap:6mm; align-items:center">
    ${schemaBlock(d)}
    <div style="font-size:9pt; color:#5c6672; line-height:1.7">
      <div><span style="color:#d70926; font-size:12pt">&#9679;</span> Site étudié</div>
      <div><span style="color:#dc2626; font-size:12pt">&#9679;</span> Concurrent direct (puissance comparable)</div>
      <div><span style="color:#f59e0b; font-size:12pt">&#9679;</span> Concurrent partiel</div>
      <div><span style="color:#94a3b8; font-size:12pt">&#9679;</span> Borne plus lente</div>
      <div style="margin-top:2mm; font-size:8pt">Taille des points proportionnelle à la puissance. Cercles : 5 et 10 km.</div>
    </div>
  </div>

  <h2>Concurrence à proximité</h2>
  ${
    chargerRows
      ? `<table>
    <tr><th>Station</th><th>Réseau</th><th class="r">Points</th><th class="r">Puissance max</th><th class="r">Distance</th></tr>
    ${chargerRows}
  </table>${(d.chargers || []).length > 10 ? `<div class="meta" style="margin-top:1.5mm">${(d.chargers || []).length - 10} autre(s) station(s) dans un rayon de 10 km.</div>` : ""}`
      : `<div class="nores">Aucune borne concurrente recensée dans un rayon de 10 km.</div>`
  }

  <h2>Hypothèses de calcul</h2>
  <div class="hyp">
    <div><div class="k">Trafic</div><div class="v">${num(d.traffic)} véh./j</div></div>
    <div><div class="k">Véhicules électriques</div><div class="v">${d.pctVE} %</div></div>
    <div><div class="k">Besoin de recharge</div><div class="v">${d.pctNeed} %</div></div>
    <div><div class="k">Choisissent la station</div><div class="v">${d.pctChoose} %</div></div>
    <div><div class="k">kWh / session</div><div class="v">${d.kwhSession} kWh</div></div>
    <div><div class="k">Prix de revente</div><div class="v">${String(d.priceSell).replace(".", ",")} €/kWh</div></div>
    <div><div class="k">Prix d'achat élec.</div><div class="v">${String(d.priceBuy).replace(".", ",")} €/kWh</div></div>
    <div><div class="k">Matériel</div><div class="v">${esc(d.modelName)} &times; ${d.qty}</div></div>
  </div>

  <div class="disc">
    Estimation indicative et non contractuelle, générée par l'outil d'étude de site MADIC IRVE.
    Les données proviennent de sources ouvertes (OpenStreetMap, OpenChargeMap, Cerema, geo.api.gouv.fr)
    dont la couverture peut varier. Les taux de conversion sont des hypothèses à valider par une étude
    personnalisée. Ce document ne constitue pas un engagement de MADIC sur un niveau de chiffre d'affaires.
  </div>

  <script>window.addEventListener("load", function () { setTimeout(function () { window.print(); }, 250); });</script>
</body>
</html>`;

  const w = window.open("", "_blank");
  if (!w) {
    alert("Le navigateur a bloqué l'ouverture du rapport. Autorisez les pop-ups pour ce site.");
    return;
  }
  w.document.write(html);
  w.document.close();
}
