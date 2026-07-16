// Population autour d'un point via geo.api.gouv.fr (gratuit, sans clé).
// Approche : on identifie la commune du point et son département, on récupère
// toutes les communes du département (population + centre), puis on somme la
// population des communes dont le centre est dans chaque rayon.
// Approximation près des frontières départementales — suffisant pour une estimation.
// ?lat=..&lon=..  (rayons fixes 5 / 10 / 20 km)

const RADII_KM = [5, 10, 20];

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));
  if (!lat || !lon) {
    return Response.json({ error: "lat et lon requis." }, { status: 400 });
  }

  try {
    // 1. Commune contenant le point + département.
    const cRes = await fetch(
      `https://geo.api.gouv.fr/communes?lat=${lat}&lon=${lon}&fields=nom,codeDepartement,population,centre&format=json&geometry=centre`,
      { next: { revalidate: 86400 } }
    );
    if (!cRes.ok) return Response.json({ error: `geo.api.gouv.fr a répondu ${cRes.status}.` }, { status: 502 });
    const communes = await cRes.json();
    const here = Array.isArray(communes) && communes[0];
    if (!here || !here.codeDepartement) {
      return Response.json({ commune: null, department: null, radii: RADII_KM.map((km) => ({ km, population: 0 })) });
    }

    // 2. Toutes les communes du département.
    const dRes = await fetch(
      `https://geo.api.gouv.fr/departements/${here.codeDepartement}/communes?fields=nom,population,centre&format=json&geometry=centre`,
      { next: { revalidate: 86400 } }
    );
    const depCommunes = dRes.ok ? await dRes.json() : [];

    // 3. Somme par rayon.
    const radii = RADII_KM.map((km) => {
      let pop = 0;
      for (const c of depCommunes) {
        const coords = c.centre && c.centre.coordinates;
        if (!coords) continue;
        const [clon, clat] = coords;
        if (haversineKm(lat, lon, clat, clon) <= km) pop += c.population || 0;
      }
      return { km, population: pop };
    });

    return Response.json({
      commune: here.nom ? { nom: here.nom, population: here.population || 0 } : null,
      department: here.codeDepartement,
      radii,
    });
  } catch (e) {
    return Response.json({ error: "Impossible de contacter geo.api.gouv.fr." }, { status: 502 });
  }
}
