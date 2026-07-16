// Trafic routier (TMJA) via les données open data du réseau routier national
// (Cerema / data.gouv.fr), converties hors ligne en lat/lon dans data/tmja.json.
// Renvoie la section comptée la plus proche du point (distance point -> segment).
// Couverture : grands axes (autoroutes, nationales, grosses départementales), hors zones urbaines.
// ?lat=..&lon=..

import sections from "@/data/tmja.json";

// Projection locale approximative (mètres) autour d'un point de référence.
function toLocal(lat, lon, refLat, refLon) {
  const x = (lon - refLon) * Math.cos((refLat * Math.PI) / 180) * 111320;
  const y = (lat - refLat) * 110540;
  return [x, y];
}

// Distance (m) du point P au segment [A,B].
function segDistM(pLat, pLon, aLat, aLon, bLat, bLon) {
  const [ax, ay] = toLocal(aLat, aLon, pLat, pLon);
  const [bx, by] = toLocal(bLat, bLon, pLat, pLon);
  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy;
  let t = len2 === 0 ? 0 : -(ax * dx + ay * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  const cx = ax + t * dx;
  const cy = ay + t * dy;
  return Math.hypot(cx, cy);
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));
  if (!lat || !lon) {
    return Response.json({ error: "lat et lon requis." }, { status: 400 });
  }

  let best = null;
  for (const s of sections) {
    const d = segDistM(lat, lon, s.a[0], s.a[1], s.b[0], s.b[1]);
    if (!best || d < best.distanceM) {
      best = { route: s.r, tmja: s.t, pctPL: s.p, distanceM: Math.round(d) };
    }
  }

  return Response.json({ nearest: best, source: "TMJA réseau national (Cerema, data.gouv.fr)" });
}
