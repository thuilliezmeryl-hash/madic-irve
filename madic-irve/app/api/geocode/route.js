// Geocodage via Nominatim (OpenStreetMap) — gratuit, sans clé.
// Appel cote serveur pour respecter la politique d'usage (User-Agent + 1 req/s)
// et mettre en cache. ?q=adresse (recherche) OU ?lat=..&lon=.. (reverse).

const UA = "MADIC-IRVE-EtudeDeSite/1.0 (contact.irve@madic.com)";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  let url;
  if (q) {
    url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&addressdetails=1&countrycodes=fr&q=${encodeURIComponent(q)}`;
  } else if (lat && lon) {
    url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;
  } else {
    return Response.json({ error: "Paramètre q, ou lat et lon, requis." }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, "Accept-Language": "fr" },
      next: { revalidate: 86400 },
    });
    if (!res.ok) {
      return Response.json({ error: `Nominatim a répondu ${res.status}.` }, { status: 502 });
    }
    const data = await res.json();

    // Normalisation : renvoie toujours une liste de { label, lat, lon }.
    const list = Array.isArray(data) ? data : [data];
    const results = list
      .filter((d) => d && d.lat && d.lon)
      .map((d) => ({
        label: d.display_name,
        lat: Number(d.lat),
        lon: Number(d.lon),
      }));

    return Response.json({ results });
  } catch (e) {
    return Response.json({ error: "Impossible de contacter Nominatim." }, { status: 502 });
  }
}
