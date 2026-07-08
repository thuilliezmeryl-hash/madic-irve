# MADIC — Plateforme d'estimation maintenance pétrole

**Lot 1** : configurateur station (étapes 0 à 9), moteur de calcul côté serveur,
récapitulatif avec estimation budgétaire.
**Lot 2** : devis PDF (structure Annexe 1 M2-DC039), authentification par rôle
(gérant / agence / admin), rattachement station ↔ agence par département,
historique des devis avec statuts.
**Lot 3** : espace agence — tableau de bord (à traiter / historique), vue
détaillée d'un devis, commenter / ajuster / valider / refuser (avec motif),
notifications email (soumission → agence ; statut & commentaires → gérant).

Voir `SPEC.md` (cahier des charges) et `CLAUDE.md` (conventions) dans le dépôt
de documentation du projet.

## Démarrage

```bash
npm install
cp .env.example .env.local
# Renseigner dans .env.local :
#   DATABASE_URL=<Postgres : Vercel Postgres / Neon / Supabase>
#   SESSION_SECRET=$(openssl rand -hex 32)
#   ACCESS_CODE=<code d'invitation défini par Meryl — jamais commité>

# Initialiser la base (schéma + compte admin + agences/rattachements d'exemple)
DATABASE_URL=... ADMIN_EMAIL=meryl@madic.fr ADMIN_PASSWORD=... npm run db:seed

npm run dev
```

Puis ouvrir http://localhost:3000 — redirection vers `/connexion`.
Les gérants créent leur compte sur `/inscription` avec le code d'invitation
(`ACCESS_CODE`) ; les comptes agence/admin sont créés via `db/seed.mjs` ou en
SQL (interface d'administration prévue au Lot 4).

```bash
npm test        # tests unitaires (moteur de calcul, ajustements agence)
npm run build   # build de production — à exécuter avant tout déploiement
```

**Sécurité — version de Next.js** : le projet exige `next ^14.2.33`. Ne pas
redescendre sous 14.2.25 : les versions antérieures (dont 14.2.15) sont
vulnérables à CVE-2025-29927, un contournement du middleware — précisément
le mécanisme qui porte l'authentification de cette plateforme. Les routes API
revérifient la session (défense en profondeur), mais la version corrigée est
impérative. Lancer `npm audit` après chaque `npm install`.

## Déploiement Vercel

Définir `DATABASE_URL`, `SESSION_SECRET` et `ACCESS_CODE` dans les settings du
projet Vercel (Production + Preview). **Fail closed** : sans `SESSION_SECRET`,
aucune session n'est valide ; sans `ACCESS_CODE`, les inscriptions sont
fermées ; sans `DATABASE_URL`, toute opération en base échoue explicitement.

## Architecture & sécurité (SPEC §7)

```
data/grille_tarifaire.json      ← source de vérité des prix, SERVEUR UNIQUEMENT
lib/pricing/engine.ts           ← moteur de calcul : fonction pure (grille, config) → devis
lib/pricing/grille.server.ts    ← seul point de chargement de la grille (import "server-only")
lib/pricing/types.ts            ← types partagés, AUCUN tarif (importable côté client)
app/api/devis/calculer/route.ts ← calcul serveur : reçoit la config, renvoie lignes + total
app/configurateur/page.tsx      ← Server Component : catalogue sans prix → wizard client
components/configurateur/       ← wizard 10 étapes (client)
middleware.ts + lib/session.ts  ← gate d'accès : cookie signé HMAC, 30 jours
app/acces + app/api/acces       ← écran et vérification du code partagé
```

Garanties de confidentialité des tarifs :

- La grille n'est importée **que** par `grille.server.ts`, qui commence par
  `import "server-only"` : tout import (même indirect) depuis un composant
  client **fait échouer le build**.
- Le client ne reçoit que deux choses : le **catalogue sans prix**
  (libellés/descriptions, construit champ par champ dans `catalogueClient()`,
  jamais par spread de l'objet grille) et le **résultat calculé** (lignes
  retenues + totaux) renvoyé par `POST /api/devis/calculer`.
- La grille est dans `/data`, jamais dans `/public`.
- Avant tout déploiement : vérifier qu'aucun tarif n'apparaît dans le bundle
  client, par ex. `grep -r "1241" .next/static/` après `npm run build`
  (1241 € = tarif GPL, jamais utilisé par l'UI V1 : il ne doit apparaître
  nulle part côté client).

## Règles métier implémentées

- **Durée d'engagement** (1/3/5 ans) choisie à l'étape 0, appliquée à toutes
  les lignes du devis.
- **Distributeurs monoproduit** : ligne déterminée par le débit (3/5/8,
  2×5 m³/h) ; cas E85 (1.16/1.17) et pétrole lampant (1.14) détectés
  automatiquement via le carburant affecté à l'étape 4.
- **Distributeurs multiproduits** : ligne déterminée par la combinaison
  (nb carburants × nb pistolets × nb faces) + enrouleur ; convention grille
  `pistolets = carburants × faces`. Combinaison hors grille → ligne « tarif à
  confirmer » (jamais de 0 € silencieux).
- **RV2** : détection automatique des pistolets affectés à des carburants
  blancs ; variante classique (paliers SF 1/2/3, DF 2/4/6 — arrondi au palier
  supérieur) ou boucle fermée (1 ligne par volucompteur SF/DF) ; choix
  exclusif, ou « aucun ».
- **GPL** : présent dans la grille mais jamais exposé par le configurateur V1.
- **Équipements station** (étapes 7/8) : présent/absent + quantité pour les
  lignes `quantifiable`.
- **Prix `null` dans la grille** (onduleurs 1000/2000 VA, écran multimédia
  3/5 ans, bloc divers 3/5 ans…) : ligne affichée avec badge « tarif à
  confirmer », **exclue du total**, comptée dans `nbLignesAConfirmer`.
- **Hors contrat** (RP, VPRIM) : listé à titre informatif au récapitulatif,
  jamais chiffré ni intégré au total (Art. 6 du contrat M2-DC039).

## Points en attente (cf. SPEC §9)

- Tarifs manquants à confirmer avec Meryl (onduleurs, écran multimédia 3/5
  ans, bloc divers, hors contrat) — le moteur les gère déjà en « à confirmer ».
- Ordre d'appariement labels/prix du bloc `maintenance_divers` à valider
  (`note_mapping_incertain` dans la grille).
- Liste définitive des carburants blancs/lourds.
- Photos des automates (`photo_url`) : la structure de données et l'UI de
  l'étape 6 les affichent dès qu'elles seront renseignées (V2).

## Lots suivants

- **Lot 2** : devis PDF (structure Annexe 1 du contrat M2-DC039),
  authentification par rôle, rattachement station ↔ agence — le bouton
  « Générer le devis PDF » de l'étape 9 est déjà en place (désactivé).
- **Lot 3** : espace agence (validation/refus, commentaires, notifications).
- **Lot 4** : admin national (gestion grille tarifaire en base, révision
  annuelle des prix — indices INSEE S/IPP/G).
