# Phase 01 / LOWKYZ — 4 novembre 2026

## Audit et décisions

Base : branche propre `feat/lowkyz-creative-v2`, HEAD `0127986`. Travail isolé dans `codex/lowkyz-phase-01`. Les composants actifs, leurs imports, les routes, données, styles, animations, scripts de validation, dépendances et images ont été examinés avant la reconstruction.

Le principal problème structurel était l’accumulation de feuilles de styles successives et d’implémentations historiques non montées. Les styles ont été consolidés ; les anciens composants, le laboratoire interactif et les préférences de présentation ont été retirés. Les captures et les documents historiques sont conservés comme sources, pas utilisés comme composants.

Conservés : App Router, contenus et provenance, URLs des six études de cas existantes, download du CV, SEO, JSON-LD, sitemap, coordonnées, vrais visuels, fonts locales, dialogues accessibles, palette de commandes et runtime de mouvement. Deux routes CEO1.9 sont ajoutées, sans modifier les six précédentes.

## Références observées

- [Overworld Audio](https://overworldaudio.com/) : entrée centrée sur son identité, texture sombre, profondeur et dévoilement. Observé dans le navigateur ; extraction HTTP directe limitée par un 403. On retient la mise en scène du logo et une sortie brève ; aucun son ni navigation spatiale reproduits.
- [Daniele Buser](https://www.danielebuser.com/) : composition éditoriale, grande typographie, grille et grands aperçus. HTML public avec bundles Next.js observé ; aucune disposition distinctive copiée.
- [Redoyanul Haque](https://www.redoyanulhaque.me/) : entrée animée et composition typographique énergique, bundle client /assets observé. On retient le sentiment de présence ; aucune animation copiée.
- [refact0r](https://refact0r.dev/) : fond sombre et détails numériques discrets, interface minimaliste. Observé dans le navigateur ; extraction HTTP directe limitée par un 403. On retient la texture, pas la mise en page ni les motifs.

Direction propre : graphite #101210, blanc minéral #f2f0e6, accent citron #c4f578 déjà présent. Barlow Condensed et Geist existantes. Lettrage LOWKYZ dessiné en SVG, repères de séquence et partition abstraite déterministe. Pas de bitmap généré ni fausse maquette. Les images de projets restent des captures, sans altération de leurs interfaces.

## Architecture de la page

Six destinations : accueil, projets, expérience, expertise, à propos, contact. Formation intégrée au parcours. Hero avec spécialité, personnalité, localisation, mobilité et trois actions. Projets en compositions alternées puis final panoramique CEO1.9. Les détails secondaires du parcours sont développables ; contexte, rôle, dates et contributions principales restent visibles.

Expertise en six familles, sans maîtrise chiffrée. Les technologies avec une relation documentée renvoient au travail correspondant. Les outils mentionnés dans le CV sans relation vérifiée restent de simples mentions. Firebase n’est pas ajouté sans preuve ; OpenStreetMap n’est pas affirmé dans la stack présentée, le dépôt GreeCheck actuel n’exposant pas de route map lors de l’inspection.

L’intro ne conditionne pas l’accès : fin automatique, passage, Échap, accès direct par ancre, mouvement réduit, pause d’onglet, focus et contenu sous-jacent. Aucune attente de téléchargement artificielle. Fallback CSS pour éviter un overlay bloquant si le JavaScript ne démarre pas.

## Sources de contenu

Les deux PDF (download et repository) ont le même SHA-256 :
`bba20e7d3fd52dcd072bad9f5ab79b7d973799b21bcebedaa8945ee5f17bfbfd`.
Texte extrait, page rendue et portrait inspecté. Aucun remplacement du PDF ni retouche de son ancien domaine.

Dates confirmées : iAudiogram sept. 2022–sept. 2025, Santé Respiratoire France janv.–avr. 2022, Biosency mai–juin 2021. Flask est une compétence du CV, sans attribution spécifique à iAudiogram dans le portfolio. Aucun indicateur d’impact ajouté.

Les études de cas distinguent contexte, problème, rôle, décisions, mise en œuvre et résultat observable. Tech Express conserve ses limites de formulaire de démonstration. Le dépôt public Tech Express n’étant pas accessible lors du contrôle, aucun lien de code n’est ajouté.

## Nouvelle source CEO1.9

URL : https://ceo19.vercel.app/en — HTTP 200 le 4 novembre 2026.
Dépôt : https://github.com/hassanhaddane/ceo19 — public.
Package inspecté : Next.js, React, TypeScript, Three.js et GSAP.

Capture `public/projects/ceo19/home-desktop.jpg` : navigateur à 1440 × 900, intro passée, son désactivé, accueil réel. Aucun mockup. Les liens de musique, le sélecteur de sorties et les archives sont présents dans le document. L’accueil et la section musique ont été observés ; aucun achat ni formulaire soumis. Ne pas transformer cette observation en validation des paiements ou de toute intégration externe.
