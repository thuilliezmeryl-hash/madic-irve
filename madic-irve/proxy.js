import { NextResponse } from "next/server";

/**
 * Gate d'accès temporaire (le temps de finir les développements).
 *
 * Protège TOUT le site derrière un login + mot de passe (fenêtre native du navigateur,
 * "Basic Auth"). Les identifiants sont lus dans les variables d'environnement,
 * JAMAIS écrits dans le code : indispensable car le dépôt est public.
 *
 * Activation :
 *   - En production/preview : définir SITE_USER et SITE_PASSWORD dans
 *     Vercel > Project Settings > Environment Variables.
 *   - En local : les mettre dans madic-irve/.env.local (ignoré par git).
 *
 * Si les deux variables ne sont pas définies, le site reste ouvert (aucun blocage
 * accidentel tant que la protection n'est pas configurée).
 *
 * Note : en Next.js 16, ce fichier remplace l'ancienne convention "middleware".
 */
export function proxy(request) {
  const user = process.env.SITE_USER;
  const password = process.env.SITE_PASSWORD;

  // Protection non configurée -> on laisse passer.
  if (!user || !password) return NextResponse.next();

  const header = request.headers.get("authorization");
  if (header) {
    const [scheme, encoded] = header.split(" ");
    if (scheme === "Basic" && encoded) {
      const decoded = atob(encoded);
      const sep = decoded.indexOf(":");
      const providedUser = decoded.slice(0, sep);
      const providedPassword = decoded.slice(sep + 1);
      if (providedUser === user && providedPassword === password) {
        return NextResponse.next();
      }
    }
  }

  return new NextResponse("Authentification requise.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Acces restreint MADIC IRVE"',
    },
  });
}

// Protège toutes les routes, sauf les fichiers internes de Next et le favicon.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
