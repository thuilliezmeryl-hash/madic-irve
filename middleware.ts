/**
 * Authentification par rôle (Lot 2) — remplace le gate par code partagé.
 *
 * - Routes publiques : /connexion, /inscription, /api/auth/*
 * - Tout le reste exige une session valide.
 * - Contrôle par rôle :
 *     /admin*  → admin
 *     /agence* → agence ou admin
 *     configurateur & devis → gérant ou admin (les comptes agence sont
 *     redirigés vers leur espace)
 */
import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifierJetonSession } from "@/lib/session";

const PUBLIQUES = ["/connexion", "/inscription"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    PUBLIQUES.some((p) => pathname === p) ||
    pathname.startsWith("/api/auth/")
  ) {
    return NextResponse.next();
  }

  const session = await verifierJetonSession(
    request.cookies.get(SESSION_COOKIE)?.value
  );

  if (!session) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ erreur: "Authentification requise." }, { status: 401 });
    }
    const url = request.nextUrl.clone();
    url.pathname = "/connexion";
    url.search = "";
    return NextResponse.redirect(url);
  }

  const rediriger = (chemin: string) => {
    const url = request.nextUrl.clone();
    url.pathname = chemin;
    url.search = "";
    return NextResponse.redirect(url);
  };

  // Racine : chacun vers son espace.
  if (pathname === "/") {
    if (session.role === "admin") return rediriger("/admin");
    if (session.role === "agence") return rediriger("/agence");
    return rediriger("/configurateur");
  }

  if (pathname.startsWith("/api/agence") && session.role === "gerant") {
    return NextResponse.json({ erreur: "Action réservée à l'agence." }, { status: 403 });
  }

  if (pathname.startsWith("/admin") && session.role !== "admin") {
    return session.role === "agence" ? rediriger("/agence") : rediriger("/configurateur");
  }
  if (pathname.startsWith("/agence") && session.role === "gerant") {
    return rediriger("/configurateur");
  }
  if (
    (pathname.startsWith("/configurateur") || pathname.startsWith("/devis")) &&
    session.role === "agence"
  ) {
    return rediriger("/agence");
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt).*)",
  ],
};
