# LOWKYZ — QA phase 02 / 4 novembre 2026

Ce rapport distingue les validations locales du 4 novembre et les contrôles sur le domaine public des 4 et 5 novembre 2026.

## Validations automatisées

- `pnpm lint` : OK, aucune erreur ni avertissement ESLint.
- `pnpm typecheck` : OK, TypeScript strict.
- `pnpm test` : OK, 22 artefacts et 49 fichiers source, dont les anciennes fonctionnalités supprimées et le hash du CV approuvé.
- `pnpm build` : OK, 18 sorties statiques ; accueil FR/EN et huit études de cas pré-rendus. First Load JS annoncé par Next : 160 kB pour l’accueil, 108 kB pour les études de cas.
- `pnpm test:e2e` : **24/24**, Chromium 156, build servi par `pnpm start --port 3101`, Node 22.23.1 / pnpm 10.8.1. Rapport JSON et captures dans `output/phase-02/` (non versionné).

Couverture navigateur :

- Accueils FR/EN et huit études de cas aux largeurs **320, 390, 768, 1024, 1440 et 1920 px** : aucun débordement horizontal ni titre hors viewport ; images chargées avec largeur naturelle non nulle.
- Ancres natives, indication active, historique précédent/suivant, retour accueil/projets, projet suivant, changement de langue avec destination conservée et palette Ctrl+K.
- Menu mobile, Échap, retour du focus, skip link, clavier, copie d’email réussie/refusée, téléchargement du vrai PDF et hash SHA-256 inchangé.
- Intro : signal/identité/sortie automatique, replay, skip, absence de répétition après reload et retour d’étude de cas, accès direct par ancre, composition et skip aux six largeurs.
- Mouvement réduit système et préférence persistante : accès immédiat et arrêt des effets. WebGL réellement exécuté sur un profil capable, suspendu hors scène et repris dans l’expertise ; retour SVG et contexte GPU effectivement libéré à la désactivation.
- Sans WebGL, images volontairement bloquées et JavaScript désactivé : contenu et navigation de base accessibles. Ces pannes provoquées sont distinctes des parcours normaux, dont les erreurs console, hydratation, exceptions et réponses HTTP en erreur sont surveillées.
- Canonical FR/EN, Open Graph, sitemap, robots, routes inconnues en HTTP 404 et URL externes attendues. Les slugs inconnus passent par `notFound()` sans l’erreur serveur `NoFallbackError` observée avec `dynamicParams=false`.

## Contrôles visuels et relecture

Inspection des captures desktop/mobile : hiérarchie du hero et des CTA, espaces entre les mots des titres masqués, grandes captures authentiques, timeline compacte, expertise, portrait, contact et études de cas. Contrôle interactif complémentaire dans le navigateur intégré. Captures retenues : [desktop](desktop.jpg), [mobile](mobile.jpg), [signature](signature.jpg).

Mouvement limité : parallaxe plafonnée à 16 px, aperçu à 5/4 px, drift ambiant à 9/6 px, une seule réaction magnétique sur le CTA principal. Pas de parallaxe sur pointeur tactile ou petit écran. Aucune dépendance d’animation supplémentaire. Transitions natives entre documents en amélioration progressive ; liens standards lorsque non prises en charge.

Relecture React et cycle de vie : géométrie déterministe partagée et arrondie pour l’hydratation, aucune mise à jour React par frame, mesures de layout mises en cache, RAF événementiel partagé, nettoyage des écouteurs/observers/timers et destruction des ressources GPU. Import Three.js différé et conditionnel. Rendu et animations non essentiels suspendus quand l’onglet est masqué. Fallback SVG si les informations matérielles sont indisponibles.

Corrections issues des audits : contraste des labels pendant les reveals, noms accessibles cohérents avec le texte visible des liens, zones cliquables techniques d’au moins 24 px, tailles d’images adaptées aux compositions, suppression du curseur décoratif et des anciens styles de reveal.

## Mesures Lighthouse réelles

Lighthouse **13.6.0**, Chromium 156 headless, Windows, `/fr` sur le build local. Une mesure finale par profil, simulation Lighthouse par défaut. Résultats de laboratoire variables selon la machine et la charge ; aucune promesse de score de terrain. Configuration et valeurs brutes : [measurements.json](measurements.json). Rapports HTML/JSON complets locaux : `output/phase-02/lighthouse-{mobile,desktop}-final.report.*`.

| Profil  | Performance | Accessibilité | Bonnes pratiques | SEO |   LCP |    TBT |   CLS |
| ------- | ----------: | ------------: | ---------------: | --: | ----: | -----: | ----: |
| Mobile  |          99 |           100 |              100 | 100 | 1,0 s | 100 ms | 0,017 |
| Desktop |          99 |           100 |              100 | 100 | 0,3 s |   0 ms | 0,025 |

L’INP réel nécessite des données de terrain ; il n’est pas mesuré ni déduit du TBT. La signature dure 2,08 s après hydratation, sans pourcentage de chargement fictif ni attente d’image/police ; le contenu se charge en parallèle. Skip, Échap, ancres et mouvement réduit donnent un accès direct.

## Liens externes, sources et limites

GET publics du 4 novembre : GreeCheck, 808BLOOM, Tech Express V1/V2, CEO1.9, les deux dépôts GitHub exposés et le profil GitHub répondent **200**. Ouverture réelle du bouton GreeCheck dans un nouvel onglet également testée. LinkedIn renvoie **999** au contrôle automatisé : URL conservée depuis les sources, accessibilité publique non validée par cette requête.

Le PDF et les données de phase 01 sont préservés. Son ancien domaine n’est pas réécrit. Aucun résultat commercial ou paiement externe n’est affirmé. Lab et modes de présentation restent absents du runtime ; les documents de l’ancienne version restent des archives historiques.

Non couverts : appareils physiques, Safari/Firefox, lecteur d’écran réel, INP terrain, paiement/boutiques des projets externes et envoi d’un véritable email. L’état masqué de l’onglet a été relu dans le code ; les tests de cycle de vie GPU portent sur la visibilité des scènes et le mouvement réduit.

## Production vérifiée

Le push de `master` a déclenché le déploiement de production `dpl_BCRW1HD2viyTkzUQe5zcmwA6QsvH`, passé à **Ready** avec le SHA d’intégration `a1ae94d2e5de7f05113fb64313b61bb802a0cfd5`. Les deux domaines publics pointent vers ce déploiement. HTTP redirige en 308 vers HTTPS, puis le domaine racine redirige en 308 vers `www`, avec conservation du chemin. La page `/fr` répond 200 avec canonical vers `https://www.lowkyz.dev/fr`. Le CV public répond 200 avec le type `application/pdf`. [Déploiement Vercel](https://vercel.com/hassanhaddane33s-gmailcoms-projects/hassan-portfolio/BCRW1HD2viyTkzUQe5zcmwA6QsvH)

La suite Playwright corrigée passe **24/24** sur `https://lowkyz.dev`. Le premier passage avait échoué sur la casse du nom du CV, que Vercel indique en minuscules dans `Content-Disposition`. Le test vérifie désormais le nom sans tenir compte de la casse et contrôle le SHA-256 du fichier effectivement téléchargé. Les captures publiques à 390 et 1440 px montrent la même composition que le build local. L’émulation tactile iPhone 13 dans Chromium confirme l’ouverture du menu, l’ancre Projets et l’accès à l’étude de cas GreeCheck. Les previews protégées n’ont pas fait l’objet d’une passe distincte.

Le contrôle de l’historique utilise le mouvement réduit pour isoler la restauration native de la position. Après le changement de langue, le test attend que la navigation signale la section active avant d’envoyer Ctrl+K. Ce scénario passe trois fois de suite sur le domaine public.

Lighthouse 13.6.0 sur `https://www.lowkyz.dev/fr`, une mesure de laboratoire par profil le 5 novembre.

| Profil | Performance | Accessibilité | Bonnes pratiques | SEO | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | 94 | 100 | 100 | 100 | 1,1 s | 240 ms | 0 |
| Desktop | 100 | 100 | 100 | 100 | 0,3 s | 0 ms | 0 |
