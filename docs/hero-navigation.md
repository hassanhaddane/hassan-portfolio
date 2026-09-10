# Hero et navigation — direction définitive

## Composition retenue

Référence visuelle : `C:/Users/hassa/.codex/generated_images/01a06c1a-2110-7e12-a709-f500ab85087b/exec-3f8f14b3-2083-4964-b56e-dd25a145d2af.png`.

Le nom est l'architecture du viewport. Deux lignes condensées, seconde ligne décalée, et une fibre diagonale continue entre les lettres. Pas de colonne réservée à une illustration. Les annotations d'expérience et la stack occupent les contreformes de la composition. La trame est un objet mathématique interactif, réalisé en WebGL/SVG conformément à la demande, pas une image générée livrée en fond.

Palette conservée : obsidienne #080a0e, blanc #f3f1eb, cobalt #3267ff, lime #c4f578 réservé au statut. Barlow Condensed 700/800 pour le nom, Geist Sans pour la lecture, Geist Mono pour les repères. Typographie fluide, traits fins, surfaces ouvertes, angles nets. Flèches et téléchargement Lucide 1.5px.

## Contenu du premier écran

- LOWKYZ/ ; navigation Work, Experience, Stack, About ; FR / EN ; commande ; Contact.
- Hassan Haddane. Développeur Web Full-Stack / Full-Stack Web Developer.
- 03+ ans d'expérience / years of experience. Recherche CDI / Open to a permanent role.
- Des interfaces aux systèmes. Du code à la mise en ligne. / From interfaces to systems. From code to production.
- React / Next.js / TypeScript ; Python / FastAPI ; Docker / CI/CD.
- Rennes — France. Mobile Bretagne / Nantes · Permis B / Mobile across Brittany / Nantes · Driving licence.
- Voir mon travail / View my work ; CV ; GitHub ; LinkedIn ; Email.
- Recruiter / Explore, contrôle du mouvement ; indication discrète du signal sélectionné.

Faits fournis explicitement dans la demande du 4 septembre 2026. Aucune métrique de projet inventée. La formulation CDI remplace les anciennes mentions freelance de la recherche actuelle.

## Parcours et composants

Ordre : 01 Intro (#profil), 02 Work (#projets), 03 Experience (#parcours), 04 System (#stack), 05 About (#about), 06 Contact (#contact). Ancienne ancre #essentiel conservée dans About.

Hero : identité, expérience, TechnologySignals, actions, localisation, liens et VisitControls. Navigation : masthead transformable, menu mobile accessible via Dialog, ChapterRail. Entrée locale à la session : signature puis masque typographique, maximum 850 ms ; aucune attente réseau artificielle.

## Mouvement et technique

Une seule hiérarchie : entrée brève, puis respiration discrète de la fibre ; réaction localisée au survol/focus/toucher d'une technologie ; convergence au scroll et morphing selon le chapitre. Les données du pointeur et du scroll vivent dans des refs, jamais dans une boucle de rendu React. Store de signal indépendant et réutilisable.

Three.js importé uniquement lorsque Explore, mouvement et capacités matérielles le permettent. Deux draw calls, buffers réutilisés, shaders de lumière, densité bornée, résolution plafonnée et baisse adaptative, pause hors onglet. SVG déterministe immédiat pour les autres situations, sans dépendance WebGL initiale. Préférences persistées, état de chapitre et palette séparés du contexte de contenu.

Mobile : composition dédiée, deux lignes de nom, expérience compacte, trois rangées techniques, localisation et CTA dans le premier écran. Menu explicite, rail réduit au chapitre courant et à six crans. Aucune action dépend exclusivement du hover. Réduction du mouvement système prioritaire ; toutes les informations existent dans le HTML initial.

## Validation prévue

Build TypeScript/Next et lint. IAB : 1440×900, 1920×1080, 1366×768, 390×844, 430×932. Navigation des six chapitres, clavier/palette, FR/EN, modes, mouvement, signaux, menu mobile, persistance, erreurs console, débordements et captures. Comparaison à la référence sur copie, hiérarchie, typographie, palette, fibre et composition mobile. Les mesures de laboratoire ne seront pas présentées comme des Core Web Vitals terrain.

## Résultat de validation

Build de production terminé, TypeScript valide. Page pré-rendue ; First Load JS annoncé par Next : 154 kB pour la page complète. Aucune nouvelle dépendance pour cette étape. 122 règles CSS remplacées ont été supprimées.

Environnement : serveur de production local, `http://localhost:3000/`, navigateur intégré IAB. Aucun remplacement par un navigateur externe. Parcours testé : entrée → technologies → modes → chapitres → menu/palette → CV.

| Contrôle | Résultat |
| --- | --- |
| Identité et écran initial | Nom professionnel, rôle, expérience, CDI, stack, mobilité et actions présents |
| 1440 × 900 | Hero de 900 px, aucun débordement horizontal |
| 1920 × 1080 | Hero de 1080 px, aucun débordement horizontal |
| 1366 × 768 | CTA jusqu'à 679 px, mobilité jusqu'à 741 px, aucun débordement horizontal |
| 390 × 844 | Nom terminé à 350 px dans 375 px utiles ; CTA jusqu'à 710 px ; contrôles jusqu'à 797 px |
| 430 × 932 | Anglais vérifié ; nom terminé à 390 px dans 415 px utiles ; CTA jusqu'à 731 px |
| Navigation | Six chapitres, repère actif, navbar flottante, ancres et changement de forme du champ vérifiés |
| Palette | Ctrl+K, recherche, navigation About, focus sur la section, réglages et fermeture vérifiés |
| Menu mobile | Focus initial sur Intro ; choix Work → fermeture → focus sur #projets ; accès à la palette fonctionnel |
| Signaux | Survol réel React, passage clavier vers Next.js, sélection Python sur mobile ; familles 0, 1 et 3 observées |
| Mouvement manuel | Désactivation → SVG, aucune animation de filament, scroll immédiat ; réactivation du WebGL vérifiée |
| Persistance | Mode Explore et mouvement désactivé conservés après rechargement ; introduction sautée |
| CV | Événement de téléchargement effectivement déclenché par le bouton CV |
| Console finale | Aucune erreur ni alerte remontée sur la version finale |

Corrections issues de la QA : coordonnées SVG arrondies pour éviter les écarts d'hydratation ; identifiant GLSL réservé remplacé ; repli SVG sur erreur de compilation ; marge droite du nom mobile corrigée ; focus du menu et de sa destination explicites ; démarrage du moteur protégé contre un redimensionnement pendant son chargement. L'introduction reste compatible avec le nettoyage des effets React en développement.

### Comparaison visuelle finale

La référence générée et les captures finales desktop/mobile ont été ouvertes avec `view_image` dans la même passe de QA. Comparaison effectuée sur les points suivants :

| Point | Référence / rendu / décision |
| --- | --- |
| Copie | Nom, rôle, 03+, CDI, trois lignes de stack et actions conservés ; FastAPI et CI/CD sont eux aussi interactifs |
| Composition | Nom sur deux lignes avec deuxième ligne décalée, expérience dans l'espace libre et fibre transversale conservés |
| Typographie | Barlow Condensed pour le nom ; Geist pour le contenu ; monospace pour les informations techniques ; largeur mobile recalculée après capture |
| Palette | Obsidienne, blanc doux, cobalt et ponctuation de statut lime conservés ; aucune dominante violette ajoutée |
| Organisme | Réalisé en géométrie/shaders et SVG, conformément à la demande ; luminosité au repos volontairement moindre que dans l'image, renforcée pendant un signal |
| Mobile | Même hiérarchie, rail simplifié et menu dédié ; CV placé à côté du CTA pour conserver les informations et contrôles dans le premier écran |

Diff de copie au-dessus du pli : aucun fait requis supprimé. Les coordonnées, la phrase de connexion et le contrôle de mouvement sont les seules annotations supplémentaires prévues dans l'inventaire. Les choix mobiles et la lumière au repos sont des adaptations intentionnelles de la référence, pas des éléments manquants. Aucun débordement ou défaut visuel bloquant restant dans les formats testés.

### Captures

Dossier : `C:/Users/hassa/.codex/visualizations/2026/09/04/01a06c1a-2110-7e12-a709-f500ab85087b/`.

- `hero-v2-desktop-1440.png`
- `hero-v2-1920.png`
- `hero-v2-laptop-1366.png`
- `hero-v2-mobile-390.png`
- `hero-v2-mobile-430-en.png`
- `hero-v2-menu-mobile.png`
- `hero-v2-signal-react.png`

### Limites des mesures

Le moteur a confirmé deux draw calls ; des intervalles moyens de trame autour de 6–8 ms ont été observés sur cette machine, avec réduction adaptative de qualité après ralentissement. Ce ne sont ni des Core Web Vitals terrain ni une garantie sur tous les GPU. Le respect de `prefers-reduced-motion` est contrôlé dans le code ; le parcours de désactivation a été testé dans le navigateur, mais l'IAB ne fournit pas d'émulation du réglage système. Safari/iOS matériel et audit complet au lecteur d'écran non exécutés. Les liens de contact ont été inspectés sans envoyer de message.

Référence technique consultée pour le traitement des erreurs et le cycle du renderer : [documentation officielle Three.js](https://threejs.org/docs/pages/WebGLRenderer.html).
