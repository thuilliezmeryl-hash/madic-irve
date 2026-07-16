// Commerces et services a proximité via Overpass API (OpenStreetMap) — gratuit, sans clé.
// ?lat=..&lon=..&radius=metres (defaut 1500)

// Categories détectées et leur temps de stationnement indicatif (minutes).
// « nwr » (node + way + relation) : les grandes surfaces (Intermarché, Décathlon,
// McDonald's…) sont presque toujours cartographiées comme des bâtiments (way),
// pas comme des points — une requête « node » seule les rate.
const CATEGORIES = [
  { key: "restaurant", label: "Restaurants", stayMin: 75, filter: 'nwr["amenity"="restaurant"]' },
  { key: "fast_food", label: "Restauration rapide", stayMin: 25, filter: 'nwr["amenity"="fast_food"]' },
  { key: "cafe", label: "Cafés", stayMin: 30, filter: 'nwr["amenity"="cafe"]' },
  { key: "supermarket", label: "Supermarchés", stayMin: 45, filter: 'nwr["shop"="supermarket"]' },
  { key: "mall", label: "Centres commerciaux", stayMin: 90, filter: 'nwr["shop"="mall"]' },
  { key: "diy", label: "Bricolage / jardinage", stayMin: 60, filter: 'nwr["shop"~"^(doityourself|garden_centre)$"]' },
  { key: "sports_shop", label: "Magasins de sport", stayMin: 60, filter: 'nwr["shop"="sports"]' },
  { key: "hotel", label: "Hôtels", stayMin: 600, filter: 'nwr["tourism"="hotel"]' },
  { key: "cinema", label: "Cinémas", stayMin: 120, filter: 'nwr["amenity"="cinema"]' },
  { key: "fitness", label: "Salles de sport", stayMin: 75, filter: 'nwr["leisure"="fitness_centre"]' },
  { key: "fuel", label: "Stations-service", stayMin: 15, filter: 'nwr["amenity"="fuel"]' },
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const radius = searchParams.get("radius") || "1500";

  if (!lat || !lon) {
    return Response.json({ error: "lat et lon requis." }, { status: 400 });
  }

  const around = `(around:${radius},${lat},${lon})`;
  const query =
    `[out:json][timeout:25];(` +
    CATEGORIES.map((c) => `${c.filter}${around};`).join("") +
    `);out center 300;`;

  try {
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "MADIC-IRVE-EtudeDeSite/1.0 (contact.irve@madic.com)",
        Accept: "application/json",
      },
      body: "data=" + encodeURIComponent(query),
      next: { revalidate: 86400 },
    });
    if (!res.ok) {
      return Response.json({ error: `Overpass a répondu ${res.status}.`, results: [], counts: {} }, { status: 502 });
    }
    const data = await res.json();
    const elements = data.elements || [];

    const results = [];
    const counts = {};
    let stayWeighted = 0;

    for (const el of elements) {
      const tags = el.tags || {};
      const cat = CATEGORIES.find((c) => {
        if (c.key === "restaurant") return tags.amenity === "restaurant";
        if (c.key === "fast_food") return tags.amenity === "fast_food";
        if (c.key === "cafe") return tags.amenity === "cafe";
        if (c.key === "supermarket") return tags.shop === "supermarket";
        if (c.key === "mall") return tags.shop === "mall";
        if (c.key === "diy") return tags.shop === "doityourself" || tags.shop === "garden_centre";
        if (c.key === "sports_shop") return tags.shop === "sports";
        if (c.key === "hotel") return tags.tourism === "hotel";
        if (c.key === "cinema") return tags.amenity === "cinema";
        if (c.key === "fitness") return tags.leisure === "fitness_centre";
        if (c.key === "fuel") return tags.amenity === "fuel";
        return false;
      });
      if (!cat) continue;
      const plat = el.lat ?? el.center?.lat;
      const plon = el.lon ?? el.center?.lon;
      if (plat == null || plon == null) continue;
      counts[cat.key] = (counts[cat.key] || 0) + 1;
      stayWeighted += cat.stayMin;
      results.push({
        lat: plat,
        lon: plon,
        category: cat.key,
        categoryLabel: cat.label,
        name: tags.name || cat.label,
      });
    }

    const total = results.length;
    const avgStayMin = total ? Math.round(stayWeighted / total) : null;
    const summary = CATEGORIES.filter((c) => counts[c.key]).map((c) => ({
      key: c.key,
      label: c.label,
      count: counts[c.key],
    }));

    return Response.json({ results, summary, total, avgStayMin });
  } catch (e) {
    return Response.json({ error: "Impossible de contacter Overpass.", results: [], summary: [], total: 0 }, { status: 502 });
  }
}
