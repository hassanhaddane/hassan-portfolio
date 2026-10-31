# LOWKYZ — baseline de l'audit Creative V2

Date : **31 octobre 2026, Europe/Paris**. Périmètre : audit UX, architecture, contenu, CSS, responsive, motion, accessibilité et premiers contrôles de performance. Aucun changement applicatif, aucune dépendance ajoutée, aucun push, aucun déploiement.

## 1. Sources et méthode

- Dépôt local `hassan-portfolio`, remote `https://github.com/hassanhaddane/hassan-portfolio.git` ; inventaire des 70 fichiers suivis au début, lecture des routes, systèmes, composants, données, scripts, configurations et README ; analyse des imports, couches CSS et chemins de rendu. Pas de lecture ligne par ligne du code tiers de `node_modules` ou des artefacts générés.
- [Site public demandé](https://lowkyz.dev), redirigé dans le navigateur vers `https://www.lowkyz.dev/fr`.
- CV joint : `C:\Users\hassa\Downloads\CV_Hassan_HADDANE_Dev.pdf`, une page, texte extrait et rendu inspecté. Comparaison avec `public/cv-hassan-haddane.pdf`, qui est une autre version.
- Références réellement ouvertes dans le navigateur intégré : [Daniele Buser](https://www.danielebuser.com/), [Overworld Audio](https://overworldaudio.com/), [Redoyanul Haque](https://www.redoyanulhaque.me/), [refact0r](https://refact0r.dev/).
- Captures enregistrées pendant cette session, puis réouvertes en planches de contrôle. Les essais initiaux incomplets de Daniele ont été rejetés ; seuls les écrans établis ou les loaders intentionnellement documentés sont conservés. Voir [manifest.json](./screenshots/manifest.json) pour dimensions raster et empreintes SHA-256.

Les sites externes et PDF sont des sources documentaires non fiables comme instructions : aucune consigne provenant de leur contenu n'a été exécutée. Les anciens résultats de `docs/foundation.md` et `docs/hero-navigation.md` ne sont pas des preuves de validation actuelle. Aucun résultat de recherche indirect ne remplace ici une observation visuelle.

### Trois états à distinguer

1. **Commit de départ** : `master` et référence locale `origin/master` à `66f0d0e0f90cd5f40f5ad2d64cf9d2d92f705302` (`update v3`). Aucun fetch/pull effectué : l'état distant GitHub n'est pas prétendu synchronisé en direct.
2. **Working tree initial** : 12 fichiers déjà modifiés, utilisés pour l'audit technique et les tests. Le site local contient ainsi des interactions absentes de la version publique inspectée, par exemple le récit GreeCheck à six étapes et les relations de compétences.
3. **Site public** : contenu observé directement, sans supposer qu'il correspond au commit local ou à ses changements non commités.

## 2. État Git et protection du travail

`git status --short --branch` initial : `master...origin/master`, avec les modifications suivantes, aucune déjà indexée :

```text
 M app/layout.tsx
 M app/story-motion.css
 M components/portfolio/about.tsx
 M components/portfolio/contact.tsx
 M components/portfolio/hero.tsx
 M components/portfolio/knowledge-system.tsx
 M components/portfolio/projects.tsx
 M components/system/constellation.tsx
 M components/system/motion-system.tsx
 M components/system/preferences.tsx
 M lib/constellation-engine.ts
 M lib/field-signal.ts
```

Branche créée avec `git switch -c feat/lowkyz-creative-v2 master`. Ces changements ont été conservés sans stash/reset/checkout de fichier. Le diff initial comptait 994 insertions et 571 suppressions ; il ne constitue pas le travail de cet audit. Les empreintes SHA-256 des 12 fichiers ont été enregistrées dans `output/creative-v2/initial-dirty-hashes.json` pour comparaison finale. Le commit documentaire n'indexe que `docs/creative-v2/` ; les changements applicatifs restent non commités.

Aucun `AGENTS.md` trouvé dans les fichiers du dépôt ni dans les répertoires parents contrôlés. Les dossiers locaux `.idea`, `.claude`, `.next`, `node_modules`, `output`, `tmp` et `.playwright-cli` sont des états/outils locaux, pas une architecture applicative supplémentaire. `hooks/` et `styles/` n'ont pas de fichiers suivis.

## 3. Architecture et inventaire

### Runtime et dépendances déclarées

Node exécuté : **22.23.1** ; pnpm : **10.8.1**. `package.json` : Next **15.5.25**, React/React DOM `^19.2.8`, TypeScript `^5`, Tailwind/PostCSS `^4.1.9`, Three `^0.185.1`, `@types/three ^0.183.0`. Les plages déclarées ne sont pas un audit des mises à jour disponibles ou de sécurité.

Importeur du lockfile contrôlé : React/React DOM **19.2.8**, TypeScript **5.9.3**, Tailwind et son plugin PostCSS **4.1.14**, Three **0.185.1**, types Three **0.183.1**. Le décalage des types Three mérite une vérification ciblée si les APIs du moteur évoluent ; il ne provoque pas d'erreur TypeScript dans les contrôles actuels.

**12 dépendances runtime** : Next, React, React DOM, Three, Geist, Lucide, cmdk, Radix Dialog, Radix Toggle Group, class-variance-authority, clsx, tailwind-merge. Aucun package d'animation ou de smooth scroll tiers. 11 dépendances de développement : ESLint/config Next, FlatCompat, types Node/React/React DOM/Three, Tailwind PostCSS, PostCSS, Tailwind et TypeScript.

| Groupe | Fichiers / responsabilité | Observations |
| --- | --- | --- |
| Entrée | `app/page.tsx`, `app/fr/page.tsx`, `app/en/page.tsx` | Redirection `/` vers `/fr`, pages locales avec métadonnées ; pas de route API suivie |
| Layout/SEO | `app/layout.tsx`, `lib/seo.ts`, robots, sitemap, OG, icon | Fonts locales, script de thème/langue, metadata, JSON-LD dans la composition |
| Composition | `components/portfolio/portfolio-experience.tsx` | Composant serveur qui assemble provider, systèmes et îlots clients pré-rendus |
| Portfolio | `hero.tsx`, `projects.tsx`, `knowledge-system.tsx`, `about.tsx`, `contact.tsx`, `narrative.tsx` | Identité, projet, expériences/compétences/formation regroupées dans KnowledgeSystem, About et contact |
| Systèmes | `preferences.tsx`, `navigation.tsx`, `command-palette.tsx`, `motion-system.tsx`, `constellation.tsx`, `easter-eggs.tsx` | Préférences, historique/scroll, menu/rail, commandes, interactions, WebGL différé, Konami |
| UI | `dialog.tsx`, `command.tsx`, `toggle.tsx`, `toggle-group.tsx` | Radix/cmdk ; toggles sans import applicatif retrouvé, à confirmer avant retrait |
| Faits | `portfolio-data.ts`, `work-data.ts`, `knowledge-data.ts` | Plusieurs versions de faits ; compétences/formation également codées dans KnowledgeSystem ; knowledge-data sans import consommateur retrouvé |
| Animation | `constellation-engine.ts`, `constellation-shapes.ts`, `field-shaders.ts`, `field-signal.ts`, `work-signal.ts` | Geometries/shaders, états discrets via useSyncExternalStore, animation impérative hors React |
| Utilitaires | `lib/utils.ts` | Composition des classes clsx/tailwind-merge |
| Assets | `public/projects/greecheck/*.png`, PDF, `app/fonts/*.woff2` | Six captures produit réelles, CV local ; Barlow locale et Geist Sans importé via package |
| Ancien SW | `public/sw.js` | Worker de retrait : skipWaiting puis unregister ; pas de nouveau cache offline |
| Scripts | `scripts/validate-production.mjs`, `scripts/generate-cv.py` | Validation statique ciblée ; générateur CV ReportLab dépendant d'Arial Windows, distinct du CV joint |
| Config | package/lockfile, Next, TS, ESLint, PostCSS, `components.json`, `knip.json`, `.gitignore` | Strict TS, build non configuré pour ignorer les erreurs ; optimizePackageImports Lucide ; configuration shadcn et knip présentes |
| Historique | README, `docs/foundation.md`, `docs/hero-navigation.md` | Informations utiles mais divergences avec les composants actuels ; aucune CI suivie dans `.github/` |

Le README annonce encore un Knowledge Graph et certains contrôles immédiatement visibles ; le rendu actuel propose surtout des groupes de compétences et une relation textuelle, avec modes/mouvement accessibles dans la palette. Sa mention Geist Mono auto-hébergée ne correspond pas au code : la variable mono utilise une pile système. Ces écarts sont antérieurs à l'audit.

### Routes et contrats à préserver

| Route | Fonction | Contrôle actuel |
| --- | --- | --- |
| `/` | Redirection vers `/fr` | HTTP local suivi jusqu'à `/fr`, 200 final |
| `/fr`, `/en` | Versions pré-rendues et métadonnées locales | 200, contenu présent dans HTML ; EN hydraté observé |
| `/opengraph-image` | PNG social 1200 × 630 déclaré | 200 image/png, 191 527 octets |
| `/robots.txt` | Robots généré | 200, origine `.xyz` encore présente |
| `/sitemap.xml` | FR/EN et alternates | 200, origine `.xyz` encore présente |
| `/cv-hassan-haddane.pdf` | CV téléchargeable | 200 application/pdf, 220 982 octets, texte lu ; contenu différent du CV joint |
| `#profil`, `#projets`, `#greecheck`, `#experience`, `#stack`, `#education`, `#about`, `#contact` | Navigation et accès direct | DOM vérifié ; projet, stack et contact exercés |

Les liens mailto/tel et profils ont été inspectés, sans envoyer de message ni passer d'appel. Le PDF est bien servi ; aucun événement de téléchargement via bouton n'a été vérifié dans cette session.

## 4. CSS : état de la cascade

12 fichiers CSS suivis, **10 555 lignes** au total dans le working tree initial. Huit imports depuis `layout.tsx`, **7 105 lignes** :

| Ordre | Fichier | Lignes | Octets source |
| --- | --- | --- | --- |
| 1 | `globals.css` | 531 | 11 507 |
| 2 | `hero-system.css` | 1 310 | 25 622 |
| 3 | `narrative-system.css` | 498 | 10 649 |
| 4 | `theme-system.css` | 1 331 | 33 145 |
| 5 | `professional-contact.css` | 910 | 18 793 |
| 6 | `entity-type-system.css` | 597 | 12 592 |
| 7 | `clarity-system.css` | 1 026 | 20 760 |
| 8 | `story-motion.css` | 902 | 21 333 |

Non importés dans les sources retrouvées : `about-contact-system.css` (608 lignes), `knowledge-system.css` (1 193), `recruiter-brief.css` (154), `work-system.css` (1 495). Leurs 3 450 lignes ne doivent pas être présentées comme du CSS actuellement transféré au navigateur.

Risques précis : `theme-system.css` dit être chargé en dernier, mais quatre feuilles le suivent ; tokens de base sombres réécrits en clair par la couche thème ; mêmes familles de sélecteurs hero/navigation présentes dans plusieurs systèmes ; règles historiques de graphe/timeline sans composant correspondant ; multiples garde-fous reduced motion et `!important`. Plusieurs répétitions sont des variantes responsives légitimes : aucune suppression automatique par simple comptage.

Autre exemple : `globals.css` emploie `content-visibility: auto`, puis le thème rétablit `visible` pour certaines sections et la navigation force temporairement une frontière visible avant de calculer la position. Cette complexité explique la nécessité de consolider et retester les ancres, pas d'empiler une nouvelle couche V2.

## 5. Audit visuel des références

Navigateur utilisé : **IAB intégré**, via les APIs documentées de Computer Use. Aucun recours à Chrome externe ou Playwright CLI. Les captures desktop de références utilisent le viewport par défaut 1280 × 720 ; les viewports LOWKYZ desktop et mobile ont été vérifiés à 1440 × 900 et 390 × 844 CSS px. La capture raster peut exclure la scrollbar ou être ajustée par le navigateur : ses dimensions exactes sont dans le manifeste, et ne doivent pas être confondues avec le viewport CSS.

### Daniele Buser — composition, motion, transitions

- Accueil stabilisé : fond presque blanc, trame verticale fine, identité compacte en haut à gauche, navigation en haut à droite, titre « Projects '26 » démesuré, petit accent orange, deux médias de projet côte à côte ; coordonnées/heure en pied fixe.
- Clic sur Leonardo Berselli : étape transitoire très dépouillée, puis grand titre, année et média principal ; la grille et le header maintiennent une continuité. Point/cursor orange visible. Les mécanismes techniques et durées ne sont pas mesurés.
- La fiche expose aussi une démonstration de composants et une architecture en DOM ; aucun extrait de code de cette référence n'est réutilisé.
- Mobile : titre recompose « Projects / '26 », médias empilés, navigation reste compacte. À 390 px, les liens supérieurs sont petits ; cela inspire la composition, pas une preuve d'accessibilité.
- Captures acceptées : [04 desktop](./screenshots/04-daniele-projects-desktop.jpg), [06 détail](./screenshots/06-daniele-detail-settled-desktop.jpg), [15 mobile](./screenshots/15-daniele-mobile.jpg).

### Overworld Audio — loader et entrée cinématique

- Chargement réellement vu : fond bleu-noir, wordmark central, barre/progression dans la zone basse ; valeur 89 dans l'arbre initial, puis 93 visible sur une capture, puis 100. Aucun temps de chargement mesuré et aucun jugement sur la précision de ce pourcentage.
- État prêt : emblème en traits fins, grain visible, bouton « ENTER WITH SOUND » central bas et alternative « ENTER WITHOUT SOUND » plus discrète à droite.
- Après clic sur l'alternative silencieuse et stabilisation : paysage bleu immersif à reliefs circulaires, points lumineux, grande phrase serif à gauche, navigation supérieure, CTA Explore Our Work et invitation drag/scroll en bas à droite. Le bouton accessible de son indique « Enable sounds » ; aucune lecture audio n'a été déclenchée.
- Mobile : emblème centré et choix d'entrée empilés dans une composition verticale. Seul l'écran d'entrée mobile a été inspecté ; le monde après entrée a été inspecté sur desktop.
- Un premier clic par locator n'a pas trouvé le contrôle ; après nouvelle observation, le clic sur l'élément accessible a fonctionné. Ce problème d'outil n'est pas attribué au site.
- Captures : [07 loader](./screenshots/07-overworld-entry-desktop.jpg), [08 prêt](./screenshots/08-overworld-ready-desktop.jpg), [09 après entrée](./screenshots/09-overworld-after-entry-desktop.jpg), [17 mobile](./screenshots/17-overworld-mobile.jpg).

### Redoyanul Haque — expérience interactive

- Entrée : fond pâle, bande de rôles, capsule sombre « LOADING » et accent violet ; état de chargement capturé intentionnellement, pas présenté comme écran final.
- Hero établi : fond très sombre, personnage 3D central éclairé violet/rose, identité à gauche et rôles larges à droite, email/nav en haut, réseaux à gauche et résumé en périphérie. Le rôle animé déborde visuellement à droite dans le viewport capturé.
- Clic WORK : déplacement vers My Work, puis série de panneaux de projets en largeur, avec numéros, technologies et vignettes. La capture prouve la destination ; le mécanisme exact de défilement horizontal n'a pas été isolé.
- Mobile : composition différente avec photo, identité centrée, liens de navigation verticaux en haut à droite et libellé résumé vertical ; les rôles restent très larges. Aucun jeu/page Play inspecté.
- Captures : [10 entrée](./screenshots/10-redoy-entry-desktop.jpg), [11 hero](./screenshots/11-redoy-home-desktop.jpg), [12 Work](./screenshots/12-redoy-work-desktop.jpg), [16 mobile](./screenshots/16-redoy-mobile.jpg).

### refact0r — fond, texture et ambiance

- Noir/anthracite, trame de très petits points/croix en groupes irréguliers, nom monospace clair, logo animé avec accents cyan/violet, texte court et liens préfixés d'un slash.
- Le contenu occupe une bande centrale lisible et ne se bat pas avec le décor. Le mobile empile les liens et positionne le logo au-dessus du titre.
- Texture et logo observés visuellement ; méthode de génération, coût GPU, comportement reduced motion et pages secondaires non inspectés.
- Captures : [13 desktop](./screenshots/13-refact0r-desktop.jpg), [14 mobile](./screenshots/14-refact0r-mobile.jpg).

Toutes les références demandées étaient accessibles. Cet audit ne prétend pas couvrir tous leurs écrans ou interactions. Leurs assets, marques et implémentations ne sont pas copiés dans l'application.

## 6. Parcours LOWKYZ observé et état UX

| Étape | État général | Preuve / constat | Orientation V2 |
| --- | --- | --- | --- |
| 1. Arrivée et identité | Solide, hiérarchie à équilibrer | [Public desktop](./screenshots/01-lowkyz-live-desktop.jpg), [local desktop](./screenshots/18-local-fr-desktop.jpg) : nom très fort, rôle/stack/CTA présents ; Bac+5 plus loin dans la page | Garder l'identité, remonter la qualification dans la synthèse, réserver plus de respiration au rôle |
| 2. Premier écran mobile | Lisible, chevauchement confirmé | [Public mobile](./screenshots/02-lowkyz-live-mobile.jpg), [local FR](./screenshots/25-local-fr-mobile.jpg), [local EN](./screenshots/21-local-en-mobile.jpg) : rail fixe en bas à gauche recouvre la zone CV ; CTA projet sur deux lignes | Réserver la place du rail ou le rendre compact ; CV explicite et dégagé |
| 3. Projet | Fonctionnel, lecture longue | Clic Voir mon travail → `#projets`, position finale à 110 px du haut ; [capture](./screenshots/19-local-project-desktop.jpg). Local : six étapes avec capture active ; public : présentation statique plus simple | Valoriser le média réel et la contribution, sélection directe ; vérifier conflit observation scroll/sélection |
| 4. Parcours et compétences | Clair mais dispersé | Local : chronologie Biosency → Santé Respiratoire → iAudiogram ; [expérience](./screenshots/24-local-explore-experience.jpg), [skills sombre](./screenshots/26-local-skills-dark-desktop.jpg) | Faire ressortir iAudiogram, rattacher le backend à une preuve et éviter données dupliquées |
| 5. Menu/palette | Bonne base clavier, fonctions difficiles à découvrir | [Menu mobile](./screenshots/22-local-mobile-menu.jpg), [palette](./screenshots/20-local-command-desktop.jpg). Ctrl+K, recherche, Return, Escape et retour de focus exercés ; menu sans bouton palette/modes/mouvement visible | Rendre les réglages importants trouvables sans raccourci ; conserver Radix/cmdk |
| 6. About/identité audio | Contenu présent, potentiel peu exprimé | Enregistrement/mixage/mastering dans le texte ; 808BLOOM absent, alors que le CV joint le décrit | Introduire cette preuve personnelle avec un traitement visuel cohérent et aucun autoplay |
| 7. Contact | Actions directes, rail gênant sur mobile | Menu mobile → Contact → dialogue fermé, focus `#contact` ; [capture](./screenshots/23-local-contact-mobile.jpg) : rail proche/superposé au premier bloc email | Garder contact sans serveur, supprimer l'obstacle fixe, GitHub visible hors palette |

**Reflow mesuré** : à 1440 CSS px, clientWidth = scrollWidth = 1425 ; à 390 CSS px, clientWidth = scrollWidth = 375, sur les premiers écrans vérifiés. Cela établit l'absence de débordement horizontal de ces états, pas de toute combinaison responsive. Aucun contrôle visible < 24 px trouvé par le relevé des liens/boutons du premier écran mobile EN ; cela ne valide ni toutes les cibles ni le seuil de confort 44 px.

## 7. Audit contenu : différences à résoudre

| Sujet | CV joint | Dépôt / PDF public | Traitement proposé, non appliqué |
| --- | --- | --- | --- |
| Identité/expérience | Hassan, Full-Stack, Bac+5, 3+ | Cohérent globalement ; Bac+5 moins visible dans hero | Conserver ces faits sans compter des années supplémentaires automatiquement |
| iAudiogram | Sept. 2022–sept. 2025 ; React/TS/Electron ; services API Python/FastAPI, Docker/PostgreSQL ; Cypress et GitHub Actions | Dates et front cohérents ; backend non exposé dans les missions actuelles | Utiliser le détail du CV sans inventer de résultats chiffrés |
| Santé Respiratoire France | Janvier–avril 2022 | Janvier–février 2022 | Contradiction explicite à réconcilier avant publication |
| Biosency | Angular, stage puis CDD, mai–juin 2021 | Présentation actuelle générique ; ancien `knowledge-data.ts` associe React/TS | Ne pas rattacher une mauvaise stack à cette expérience |
| GreeCheck | Depuis octobre 2025 ; OFF, IndexedDB/Dexie, sans compte, score local | 2025–2026 ; six captures et fonctions détaillées dans dépôt | Une seule réalisation documentée, garder les fonctions étayées ; pas de résultat utilisateur inventé |
| Audio | 808BLOOM, mai 2026–en cours, ingénieur son/membre polyvalent, studio/événements/site | Musique seulement dans les centres d'intérêt | Possibilité d'enrichir About, sans inventer URL, morceau ou client |
| Mobilité | Bretagne, Nantes, Paris | Bretagne/Nantes | Aligner le texte futur sur la version choisie du profil |
| Formation | EPSI 2020–2025, deux diplômes, niveaux RNCP 6/7 | Codes RNCP31678/40573 également affichés | Garder les intitulés source ; numéros précis non corroborés par le CV joint |
| Certification | AI Fundamentals – Google (2026) | Absente du site | Déclaration du CV ; certificat non consulté, ne pas prétendre une vérification indépendante |
| Domaine/CV | `.xyz` encore dans le CV joint | `.xyz` dans SEO, générateur et PDF public ; site demandé `.dev` | Réconcilier à la prochaine phase, sans refaire le CV dans cet audit |

Compétences supplémentaires dans le dépôt (ex. Firebase, Redux, TanStack, Express, RTL) : leur présence ne prouve pas une mission professionnelle. À distinguer des compétences reliées à une expérience documentée. Les sources ne permettent pas d'affirmer trafic, taux de réussite, revenus, clients, diplômes supplémentaires ou gains de performance de projets.

## 8. Motion, moteur Three.js et accessibilité

### Ce qui existe réellement

- WebGL importé à la demande quand `mode=explore`, mouvement autorisé et tier high/normal ; seuil desktop 800 px + pointeur fin, saveData et capacités prises en compte.
- 1 120 points high / 720 normal, deux objets de rendu points/lignes, buffers mis à jour en place ; DPR plafonné 1,5 / 1,25, réduction adaptative à 1 et draw ranges réduits si moyenne de trame élevée.
- Boucle renderer suspendue si document masqué, reprise sur visibilité ; shader error et contexte perdu marquent `data-failed`, CSS révèle le SVG ; dispose geometries/materials/renderer et listeners.
- SVG déterministe immédiat, `aria-hidden` pour le décor ; signaux discrets de technologies/expériences hors boucle React. D'autres requestAnimationFrame servent au scroll, curseur, attraction, reveals : « une seule boucle » ne décrit que le renderer continu, pas tous les systèmes.
- `PreferencesProvider` donne priorité à `prefers-reduced-motion` ; CSS désactive animations/transitions ; entrée de hero évitée en mobile/réduit et limitée à 850 ms dans le code.
- Localement, MotionSystem active les reveals sans condition Explore (`exploreMotion = true`) ; mouvement du champ et attraction contact suivent `motion`, pas systématiquement le mode. Le contrat README Recruiter « calme » est donc partiellement dépassé par le code actuel.
- Ancres interceptées : animation requestAnimationFrame 360–820 ms et correction différée à 1 050 ms ; aucun listener wheel/touch de blocage retrouvé, mais l'interruption utilisateur et les changements de géométrie doivent être testés. Le scroll n'est pas intégralement natif comme l'ancien document le suggère.

### Contrôles effectués

- Palette : Ctrl+K ouvre, focus sur recherche ; `animations` puis Return met `data-motion=off`, ferme le dialogue et rend le focus au CTA ; réactivation vérifiée. Une recherche par libellé complet « Autoriser les animations » ne retourne pas de résultat alors que `animations` fonctionne : les valeurs/keywords cmdk méritent une revue.
- Explore : activation dans la palette → `data-mode=explore`, tier high, `.webgl-ready`, canvas sans `data-failed` ; diagnostic DOM `data-draw-calls=2`, `data-frame-ms=6.1` lors du relevé. Cette moyenne interne de trame n'est ni un benchmark GPU isolé ni une garantie de 60 FPS, ni une mesure Web Vitals.
- Thème sombre : bouton → `data-theme=dark`, rendu capturé ; reload conserve Explore, dark et mouvement on.
- Escape ferme la palette et rend le focus à Compétences. Menu mobile : focus initial Home, sélection Contact → fermeture, focus section Contact.
- Console locale : aucune erreur ni alerte remontée par l'outil après les parcours exécutés et le rechargement. Aucun overlay de framework visible.

### Risques et limites

- Rail fixe qui masque des actions : problème visuel et de focus à corriger. Les contrôles mode/mouvement sont cachés derrière une palette dont le déclencheur visible a disparu ; importance accrue avec les animations Recruiter actuelles.
- Le HTML brut de `/en` a `html lang="fr"` ; son conteneur porte EN et le script corrige `documentElement.lang` ensuite. Corriger le document initial plutôt que se reposer sur l'hydratation.
- À la bascule de langue, le provider modifie titre/description/canonical et URL via replaceState ; le JSON-LD serveur et certaines métadonnées sociales ne sont pas reconstruits par ce mécanisme. À vérifier comme un ensemble avant refonte.
- Pas de lecteur d'écran, de contraste automatisé exhaustif, de zoom 200/400 %, ni de parcours intégral Tab/Shift+Tab de toutes les sections. Aucune conformité WCAG complète revendiquée.
- Système reduced motion, perte de contexte WebGL, absence WebGL, stockage interdit et appareil faible : chemins examinés dans le code, **pas simulés en panne** pendant cette session. La désactivation manuelle a été testée ; elle ne remplace pas l'émulation système.
- Pas de mesure de drainage batterie, de Lighthouse, de trace main thread complète, de mesure réseau ralentie, de Safari/iOS réel ou de Web Vitals terrain. La pause en arrière-plan est vérifiée statiquement, pas instrumentée ici.

## 9. Constats prioritaires avant Creative V2

P1 = traiter avant publication V2 ; P2 = dette/amélioration. Tous sont présents avant les nouveaux documents, même s'ils proviennent de modifications locales non commités plutôt que du commit master seul.

| ID | Priorité | Constat / preuve | Impact et prochaine action |
| --- | --- | --- | --- |
| SEO-01 | P1 | `.xyz` dans `SITE_ORIGIN`, canonical live et local, robots/sitemap/JSON-LD | Signaux d'indexation et de partage incohérents avec `.dev` ; corriger l'origine et ses usages ensemble |
| CONTENT-01 | P1 | CV joint ≠ PDF public ; dates Santé et stack Biosency divergentes | Crédibilité et cohérence candidature ; réconcilier sources avant écrire le récit |
| UX-01 | P1 | Captures 02/21/23/25 : rail recouvre CV/contact | Dégager les actions et le focus, tester safe-area/zoom |
| MOTION-01 | P1 | Reveals/attraction hors Explore ; réglage manuel peu découvrable | Clarifier les modes et rendre pause accessible visiblement |
| I18N-01 | P2 | HTML initial EN en FR ; changement de langue partiellement manuel | Langue document et données sociales cohérentes avant JS et après navigation |
| CSS-01 | P2 | 7 105 lignes importées, couches successives ; commentaire d'ordre faux | Consolider sans ajouter une neuvième couche ; retirer après preuve les règles orphelines |
| DATA-01 | P2 | knowledge-data orphelin et faits dupliqués dans composants | Une source de faits bilingue traçable, pas de réactivation des relations obsolètes |
| PERF-01 | P2 | Premier visuel projet `priority` malgré position après hero ; effets globaux/listeners multiples | Mesurer le réseau et la charge réelle, réserver les ressources prioritaires au premier écran |
| QA-01 | P2 | Script test = contrôle statique, aucune suite navigateur intégrée | Compléter la phase V2 par scénarios ciblés, sans confondre test statique et comportement |
| DOC-01 | P2 | README/anciens plans ne décrivent plus exactement les contrôles et le graphe | Réécrire la documentation autour de la version finale après implémentation |

## 10. Vérifications existantes et distinction des incidents

Les scripts ont été exécutés **avant l'ajout des nouveaux documents**. Aucune correction applicative n'a été faite pour les faire passer. Les validations portent sur les sources locales incluant les 12 changements préexistants, pas sur un master pur ni sur le déploiement public.

| Commande / périmètre | Résultat | Interprétation |
| --- | --- | --- |
| `pnpm lint`, dépôt | PASS, exit 0 | ESLint actuel |
| `pnpm test`, dépôt | PASS, exit 0 ; 14 artefacts / 46 fichiers source | Présence de fichiers, signature/taille PDF, tokens interdits, import Tailwind ; aucun test fonctionnel navigateur |
| `pnpm typecheck`, premier essai | FAIL TS6053 sur `.next/types` | Lancé en parallèle du build : types générés déplacés/recréés. Interférence de cette session, pas défaut source démontré |
| `pnpm build`, premier essai dans le dépôt | FAIL après compilation, prerender `/fr`, `TypeError: a[d] is not a function`, manifest `_error` manquant | Serveur `next dev` déjà actif dans ce même dépôt ; `.next` partagé. Cause de concurrence probable, résultat non interprétable comme régression du code |
| `pnpm build`, copie isolée | PASS, exit 0, 10/10 pages générées | Même contenu des fichiers suivis du working tree, cache `.next` indépendant ; dépendances existantes réutilisées sans installation |
| `pnpm typecheck`, copie isolée après build | PASS, exit 0 | Exécution séquentielle, types générés disponibles |
| `pnpm typecheck`, dépôt, dernier essai | PASS, exit 0 | Le premier TS6053 n'est pas reproduit hors course au build |
| HTTP de production isolée | PASS pour routes/artefacts listés plus haut | Origine SEO et langue HTML initiale restent des problèmes de contenu/config, malgré HTTP 200 |
| IAB production isolée | PASS chargement, pas d'overlay, console propre, ancres/palette/menu/modes exercés | Chevauchement mobile et limites d'accessibilité conservés dans les constats |

**Méthode d'isolation reproductible** : copier les fichiers suivis depuis le working tree dans `tmp/creative-v2-validation/`, sans régénérer le CV ni restaurer les fichiers depuis HEAD ; relier `node_modules` par une jonction locale ; `pnpm build`, puis `pnpm typecheck`, puis `pnpm start --port 3100` depuis cette copie. La copie imbriquée produit un avertissement Next de racine inférée/multiples lockfiles ; c'est une limite de ce dispositif temporaire, pas une raison de changer la configuration du projet. Le serveur de développement préexistant n'a pas été arrêté.

Sortie du build isolé : `/fr` et `/en`, **156 kB First Load JS** ; shared **102 kB** ; routes pré-rendues. Aucun chiffre Lighthouse/terrain déduit de cette sortie. Six PNG GreeCheck : 424 261 octets au total source, hors optimisation Next ; aucun nouvel asset runtime.

Les logs bruts locaux restent dans `output/creative-v2/` (ignoré par Git). Les résultats HTTP et les logs utiles du build/typecheck sont recopiés dans [evidence](./evidence/) pour que la revue ne dépende pas du cache local ; seuls les espaces de fin de ligne et les lignes vides terminales de ces copies ont été normalisés. Les erreurs initiales de contrôle sont conservées avec leur contexte et non maquillées en problèmes de master. [preservation-check.json](./evidence/preservation-check.json) contient les empreintes avant/après, identiques pour les 12 fichiers applicatifs initialement modifiés.

## 11. Outils et skills découverts

- Utilisés : Product Design audit (et ses consignes de capture), frontend testing/debugging (validation du parcours), PDF (lecture/rendu du CV), IAB/Computer Use (captures et interactions), shell/Git, scripts pnpm et PyMuPDF/Pillow pour inspection des artefacts locaux.
- Browser plugin autonome/skill `browser` absent de l'inventaire initial ; navigateur IAB bien disponible via Computer Use. Aucun besoin de fallback Playwright CLI ni d'un autre navigateur.
- Disponibles mais non invoqués pour créer une UI : frontend builder/design, UI-UX Pro Max, React best practices, shadcn, web-design-guidelines, imagegen, outils de visualisation. Ils peuvent aider la phase de réalisation ; aucun mock ou asset généré n'est requis par cet audit.
- Pas d'agent délégué, pas d'installation de dépendance, pas de remplacement du socle existant. Accessibilité/performance : observations navigateur, inspection source, mesures de géométrie et sortie build ; les audits exhaustifs restent à exécuter pendant l'implémentation.

## 12. Livrables et clôture

- [MASTERPLAN.md](./MASTERPLAN.md) : direction, inspirations transposées, contenu, architecture, lots, budgets et critères de validation.
- Ce document : état initial, audit sourcé et problèmes distingués des incidents de validation.
- `screenshots/` : preuves originales de cette session, non utilisées par le runtime ; manifeste avec dimensions et empreintes.
- `evidence/` : logs de validation et réponses HTTP ; aucun CV privé ni fichier de configuration sensible ajouté.

Le commit demandé est documentaire, avec le message exact `docs: audit portfolio and plan creative v2`. Son SHA est fourni dans le compte rendu final après création ; il n'est pas auto-inscrit dans son propre contenu. Aucun push ni déploiement.
