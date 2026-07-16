// Image de carte statique : assemble les tuiles OpenStreetMap cote serveur.
// Necessaire car les tuiles ne peuvent pas etre capturees depuis le navigateur
// (restriction CORS sur le canvas). Sert une PNG centree sur lat/lon.
// ?lat=..&lon=..&zoom=10&size=320
//
// Volume faible (une image par rapport genere) et cache agressif, conformement
// a la politique d'usage des tuiles OSM. Pour un usage intensif, il faudra
// passer par un fournisseur de cartes dedie ou auto-heberger les tuiles.

import sharp from "sharp";

export const runtime = "nodejs";

const TILE = 256;
const UA = "MADIC-IRVE-EtudeDeSite/1.0 (contact.irve@madic.com)";

const lonToX = (lon, z) => ((lon + 180) / 360) * Math.pow(2, z);
const latToY = (lat, z) => {
  const r = (lat * Math.PI) / 180;
  return ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * Math.pow(2, z);
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));
  const zoom = Math.min(16, Math.max(3, Number(searchParams.get("zoom") || 10)));
  const size = Math.min(640, Math.max(120, Number(searchParams.get("size") || 320)));

  if (!Number.isFinite(lat) || !Number.isFinite(lon) || (lat === 0 && lon === 0)) {
    return new Response("Paramètres lat et lon requis.", { status: 400 });
  }

  const n = Math.pow(2, zoom);
  const centerX = lonToX(lon, zoom) * TILE;
  const centerY = latToY(lat, zoom) * TILE;
  const left = centerX - size / 2;
  const top = centerY - size / 2;

  const x0 = Math.floor(left / TILE);
  const y0 = Math.floor(top / TILE);
  const x1 = Math.floor((left + size - 1) / TILE);
  const y1 = Math.floor((top + size - 1) / TILE);

  const jobs = [];
  for (let ty = y0; ty <= y1; ty++) {
    if (ty < 0 || ty >= n) continue;
    for (let tx = x0; tx <= x1; tx++) {
      const wx = ((tx % n) + n) % n; // enroulement est/ouest
      jobs.push(
        fetch(`https://tile.openstreetmap.org/${zoom}/${wx}/${ty}.png`, {
          headers: { "User-Agent": UA },
          next: { revalidate: 604800 },
        })
          .then(async (r) =>
            r.ok
              ? { buf: Buffer.from(await r.arrayBuffer()), left: (tx - x0) * TILE, top: (ty - y0) * TILE }
              : null
          )
          .catch(() => null)
      );
    }
  }

  const tiles = (await Promise.all(jobs)).filter(Boolean);
  if (!tiles.length) return new Response("Tuiles indisponibles.", { status: 502 });

  try {
    // Deux passes obligatoires : sharp applique extract() avant composite() si on
    // enchaine les deux, ce qui recadre le fond vide au lieu de la mosaique.
    const mosaic = await sharp({
      create: {
        width: (x1 - x0 + 1) * TILE,
        height: (y1 - y0 + 1) * TILE,
        channels: 3,
        background: "#e9edf2",
      },
    })
      .composite(tiles.map((t) => ({ input: t.buf, left: t.left, top: t.top })))
      .png()
      .toBuffer();

    const png = await sharp(mosaic)
      .extract({
        left: Math.max(0, Math.round(left - x0 * TILE)),
        top: Math.max(0, Math.round(top - y0 * TILE)),
        width: size,
        height: size,
      })
      .png()
      .toBuffer();

    return new Response(png, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400, s-maxage=604800",
      },
    });
  } catch (e) {
    return new Response("Assemblage de la carte impossible.", { status: 502 });
  }
}
