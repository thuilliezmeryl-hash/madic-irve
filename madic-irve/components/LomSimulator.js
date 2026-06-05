"use client";
import { useState } from "react";
import { Chevron } from "./icons";

/**
 * Simulateur indicatif d'obligations loi LOM.
 * Règles retenues :
 *  - Existant ouvert au public (>20 places) : max( 1 borne / 20 places ; 5 % des places ), min 1 borne, dont 1 PMR.
 *  - Existant privatif / tertiaire (>20 places) : 1 borne installée min + 1 pré-équipement / 20 places.
 *  - Neuf ou rénové (>=10 places, permis depuis 11/03/2021) : 20 % pré-équipement (arrondi sup),
 *    1 borne installée (2 dont 1 PMR au-delà de 200 places).
 * Sorties : bornes à installer + places à pré-équiper + PMR. Estimation non contractuelle.
 */

const buildingTypes = [
  { id: "public-existant", label: "Bâtiment existant ouvert au public", hint: "Supermarché, retail, centre commercial (permis avant le 11/03/2021)" },
  { id: "prive-existant", label: "Bâtiment existant privatif / tertiaire", hint: "Bureaux, dépôt, site industriel (permis avant le 11/03/2021)" },
  { id: "neuf", label: "Bâtiment neuf ou rénové", hint: "Permis déposé depuis le 11/03/2021" },
];

const ceil = (n) => Math.ceil(n);

function compute(typeId, places) {
  const p = Number(places);
  if (!p || p <= 0) return null;

  if (typeId === "neuf") {
    if (p < 10) {
      return { soumis: false, message: "En dessous de 10 places, l'obligation de pré-équipement ne s'applique pas pour un bâtiment neuf ou rénové." };
    }
    const preEquip = ceil(p * 0.2);
    const bornes = p > 200 ? 2 : 1;
    const pmr = p > 200 ? 1 : 1;
    return { soumis: true, bornes, preEquip, pmr, note: "20 % des places pré-équipées, avec au moins une borne installée accessible PMR." };
  }

  if (typeId === "public-existant") {
    if (p <= 20) {
      return { soumis: false, message: "En dessous de 21 places, l'obligation d'équipement ne s'applique pas pour un bâtiment existant. Une borne reste recommandée." };
    }
    const parTranche = Math.floor(p / 20);
    const cinqPourcent = ceil(p * 0.05);
    const bornes = Math.max(parTranche, cinqPourcent, 1);
    return { soumis: true, bornes, preEquip: null, pmr: 1, note: "Pour un établissement public : le plus élevé entre 5 % des places et une borne par tranche de 20, avec au moins une borne accessible PMR." };
  }

  // prive-existant
  if (p <= 20) {
    return { soumis: false, message: "En dessous de 21 places, l'obligation d'équipement ne s'applique pas pour un bâtiment existant. Une borne reste recommandée." };
  }
  const bornes = Math.max(Math.floor(p / 20), 1);
  return { soumis: true, bornes, preEquip: bornes, pmr: 1, note: "Au moins une borne installée, et une place pré-équipée par tranche de 20 emplacements." };
}

function ResultStat({ value, label }) {
  return (
    <div className="rounded-xl bg-white p-4 text-center ring-1 ring-madic-grey/15">
      <p className="text-3xl font-extrabold text-madic-red">{value}</p>
      <p className="mt-1 text-xs leading-snug text-madic-grey-dark">{label}</p>
    </div>
  );
}

export default function LomSimulator({ defaultType = "prive-existant" }) {
  const [type, setType] = useState(defaultType);
  const [places, setPlaces] = useState("");
  const [result, setResult] = useState(null);
  const [touched, setTouched] = useState(false);

  const onCompute = () => {
    setTouched(true);
    setResult(compute(type, places));
  };

  return (
    <section id="simulateur" className="scroll-mt-24 bg-white py-20 md:py-28" aria-labelledby="sim-title">
      <div className="mx-auto max-w-content px-5 md:px-8">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="section-label text-madic-red">Outil gratuit</p>
          <h2 id="sim-title" className="mt-3 text-3xl font-extrabold tracking-tight text-[#16202c] md:text-4xl">
            Simulateur de places obligatoires
          </h2>
          <p className="mt-4 text-madic-grey-dark">
            Estimez en quelques secondes le nombre de bornes que la loi LOM impose pour votre
            parking, selon le type de bâtiment et le nombre de places.
          </p>
        </div>

        <div className="reveal mx-auto mt-12 max-w-4xl overflow-hidden rounded-2xl border border-madic-grey/25 bg-[#fafbfc] shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Saisie */}
            <div className="border-b border-madic-grey/20 p-7 lg:border-b-0 lg:border-r md:p-8">
              <fieldset>
                <legend className="text-sm font-bold text-[#16202c]">Type de bâtiment</legend>
                <div className="mt-3 space-y-2.5">
                  {buildingTypes.map((b) => (
                    <label
                      key={b.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors ${
                        type === b.id ? "border-madic-red bg-madic-red/5" : "border-madic-grey/30 bg-white hover:border-madic-red/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name="building"
                        value={b.id}
                        checked={type === b.id}
                        onChange={(e) => { setType(e.target.value); setResult(null); setTouched(false); }}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-madic-red"
                      />
                      <span>
                        <span className="block text-sm font-semibold text-[#16202c]">{b.label}</span>
                        <span className="block text-xs text-madic-grey-dark">{b.hint}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="mt-6">
                <label htmlFor="places" className="block text-sm font-bold text-[#16202c]">
                  Nombre de places de parking
                </label>
                <input
                  id="places"
                  type="number"
                  min="1"
                  inputMode="numeric"
                  value={places}
                  onChange={(e) => { setPlaces(e.target.value); setResult(null); setTouched(false); }}
                  placeholder="ex. 80"
                  className="mt-2 w-full rounded-lg border border-madic-grey/40 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-madic-red"
                />
              </div>

              <button
                onClick={onCompute}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-madic-red px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-madic-red/25 transition-all hover:scale-[1.01] hover:bg-madic-red-dark"
              >
                Calculer mes obligations
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </button>
            </div>

            {/* Résultat */}
            <div className="p-7 md:p-8">
              {!touched && (
                <div className="flex h-full min-h-[220px] flex-col items-center justify-center text-center text-madic-grey-dark">
                  <p className="text-sm">Renseignez votre parking puis lancez le calcul pour afficher une estimation de vos obligations.</p>
                </div>
              )}

              {touched && result && !result.soumis && (
                <div className="flex h-full min-h-[220px] flex-col justify-center">
                  <p className="text-sm font-semibold text-[#16202c]">Résultat</p>
                  <p className="mt-3 text-sm leading-relaxed text-madic-grey-dark">{result.message}</p>
                </div>
              )}

              {touched && result && result.soumis && (
                <div>
                  <p className="text-sm font-semibold text-[#16202c]">Estimation pour votre parking</p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <ResultStat value={result.bornes} label="borne(s) de recharge à installer" />
                    {result.preEquip !== null ? (
                      <ResultStat value={result.preEquip} label="place(s) à pré-équiper" />
                    ) : (
                      <ResultStat value={result.pmr} label="borne(s) accessible(s) PMR" />
                    )}
                  </div>
                  <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-madic-grey-dark">
                    <Chevron className="mt-0.5 h-3 w-3 shrink-0" />
                    {result.note}
                  </p>
                  <a
                    href="#contact"
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-madic-red px-5 py-3 text-sm font-bold text-madic-red transition-colors hover:bg-madic-red hover:text-white"
                  >
                    Valider avec un expert MADIC
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="reveal mx-auto mt-5 max-w-4xl text-xs italic text-madic-grey-dark">
          Estimation indicative fondée sur les seuils généraux de la loi LOM et du Code de la
          construction et de l'habitation. Elle ne tient pas compte des cas particuliers
          (exemptions, coût disproportionné des travaux, usages mixtes) et ne constitue pas un
          avis juridique. Seule une étude personnalisée permet de déterminer vos obligations exactes.
        </p>
      </div>
    </section>
  );
}
