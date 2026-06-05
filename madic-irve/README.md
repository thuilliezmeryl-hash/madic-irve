# MADIC IRVE — Landing page génération de leads

Landing page premium pour les solutions de recharge électrique professionnelles (IRVE) de MADIC.
Objectif : générer des demandes de devis qualifiées via le formulaire de contact.

## Stack

- **Next.js 16** (App Router) + **React 19**
- **Tailwind CSS 3**
- Typographie **Montserrat** auto-hébergée (aucune dépendance externe au runtime — conforme à la charte institutionnelle MADIC)
- 100 % statique, prête pour **Vercel**

## Conformité charte graphique MADIC group (V4 - 2024)

| Élément | Valeur |
|---|---|
| Rouge MADIC (Couleur A) | `#d70926` |
| Rouge ombre chevron (B) | `#ae1022` |
| Gris MADIC (C) | `#afb6bd` |
| Gris ombre (D) | `#808b94` |
| Noir | `#000000` |
| Bleu nuit corporate | `#002653` |
| Typographie | Montserrat (institutionnelle) |
| Symbole | Hexagone + chevron/fléchon (reconstruit en SVG) |

Le chevron rouge sert de puce de liste (cf. charte p.24). Le logo respecte les couleurs,
proportions et le wordmark « MADIC group » sans déformation.

## Démarrer en local

```bash
npm install
npm run dev      # http://localhost:3000
```

## Build de production

```bash
npm run build
npm start
```

## Déploiement Vercel

1. Pousser le dépôt sur GitHub.
2. Sur [vercel.com](https://vercel.com) → **New Project** → importer le repo.
3. Framework détecté automatiquement : **Next.js**. Aucune variable d'environnement requise.
4. **Deploy**. C'est tout.

## Structure

```
app/
  layout.js        # SEO, metadata, JSON-LD, font Montserrat locale
  page.js          # assemblage des sections + reveal au scroll
  globals.css      # variables charte, utilitaires, accessibilité
components/
  Header.js        # nav sticky + menu mobile
  Hero.js          # titre, double CTA, visuel SVG, chiffres clés
  HeroVisual.js    # scène vectorielle (ombrières PV, bornes, VE)
  Partners.js      # grille logos + bandeau défilant
  Products.js      # 4 gammes (WalBox, 22GL, Pulse 20-80, Pulse 400)
  ProductArt.js    # silhouettes SVG des bornes
  Benefits.js      # 8 cartes « Pourquoi MADIC »
  Solar.js         # photovoltaïque + schéma de flux
  Fleet.js         # gestion de flotte + mockup dashboard
  ROI.js           # cartes KPI
  Contact.js       # section formulaire
  ContactForm.js   # formulaire validé (RGPD, erreurs, confirmation)
  Footer.js        # coordonnées, liens, mentions, réseaux
  Logo.js          # logo MADIC SVG (variantes color/white/red)
  icons.js         # pictogrammes line-art (inspirés charte p.25)
  useReveal.js     # IntersectionObserver pour animations au scroll
public/fonts/      # Montserrat 400/500/600/700/800 (woff2)
```

## Brancher le formulaire

Le formulaire (`components/ContactForm.js`) simule l'envoi (timeout). Pour le rendre
opérationnel, remplacer le bloc `setTimeout(...)` dans `onSubmit` par un appel réel, ex :

```js
await fetch("/api/lead", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(v),
});
```

Options possibles : route API Next.js, **EmailJS**, ou un endpoint CRM (SOOdispatch).

## Logos partenaires

Les références partenaires sont affichées sous forme de **wordmarks textuels** pour éviter
toute reproduction inexacte de marques tierces. Pour utiliser les logos officiels, déposer
les fichiers SVG/PNG dans `public/partners/` et remplacer le texte par `<img>` dans
`components/Partners.js` (en respectant les droits de chaque marque).

## Accessibilité & SEO

- Métadonnées Open Graph, robots, canonical, JSON-LD Organization
- Hiérarchie de titres `h1`→`h2`→`h3`, landmarks (`header`, `main`, `nav`, `footer`)
- `aria-label`, `aria-invalid`, `aria-describedby`, `role="alert"` sur le formulaire
- Focus visible (contour rouge), `prefers-reduced-motion` respecté
- Contrastes conformes WCAG AA
