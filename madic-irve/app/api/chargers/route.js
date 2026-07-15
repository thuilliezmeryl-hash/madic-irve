// Bornes de recharge existantes (concurrence) via OpenChargeMap.
// La clé OCM_API_KEY est lue cote serveur (jamais exposée au navigateur).
// ?lat=..&lon=..&distance=km

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const distance = searchParams.get("distance") || "10";
  const key = process.env.OCM_API_KEY;

  if (!key) {
    return Response.json(
      { error: "Clé OpenChargeMap absente (variable OCM_API_KEY à définir).", results: [] },
      { status: 503 }
    );
  }
  if (!lat || !lon) {
    return Response.json({ error: "lat et lon requis." }, { status: 400 });
  }

  const url =
    `https://api.openchargemap.io/v3/poi?output=json&countrycode=FR` +
    `&latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}` +
    `&distance=${encodeURIComponent(distance)}&distanceunit=KM&maxresults=100&compact=true&verbose=false&key=${key}`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return Response.json({ error: `OpenChargeMap a répondu ${res.status}.`, results: [] }, { status: 502 });
    }
    const data = await res.json();

    const results = (Array.isArray(data) ? data : [])
      .filter((p) => p.AddressInfo && p.AddressInfo.Latitude && p.AddressInfo.Longitude)
      .map((p) => {
        const conns = p.Connections || [];
        const maxKw = conns.reduce((m, c) => Math.max(m, c.PowerKW || 0), 0);
        return {
          id: p.ID,
          lat: p.AddressInfo.Latitude,
          lon: p.AddressInfo.Longitude,
          title: p.AddressInfo.Title || "Borne",
          operator: (p.OperatorInfo && p.OperatorInfo.Title) || "Opérateur inconnu",
          points: p.NumberOfPoints || conns.length || 1,
          maxKw,
          distanceKm: p.AddressInfo.Distance ? Math.round(p.AddressInfo.Distance * 10) / 10 : null,
        };
      });

    return Response.json({ results });
  } catch (e) {
    return Response.json({ error: "Impossible de contacter OpenChargeMap.", results: [] }, { status: 502 });
  }
}
