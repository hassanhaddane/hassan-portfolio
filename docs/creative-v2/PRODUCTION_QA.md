# LOWKYZ Creative V2 — contrôle de production

Date : 2 novembre 2026, Europe/Paris. Branche : `feat/lowkyz-creative-v2`. **Prête pour une pull request avec les réserves explicites ci-dessous.** Aucun push, merge ou déploiement effectué. Le LCP mobile cible n’est pas encore atteint ; la publication doit passer par une Preview et une revue humaine.

Actualisation après cet audit, à la demande de Hassan : moteur et contrôles audio supprimés, entrée visuelle unique ; argumentaire du Lab précisé et mobilité Bretagne/Nantes/Paris ajoutée au hero en FR/EN. Lint, typecheck, tests et build passent ; vérification navigateur à 390 px, entrée unique et aucun contrôle audio. Les mesures Lighthouse et les tests de son ci-dessous restent l’historique de la version auditée avant cette actualisation, et n’ont pas été présentés comme remesurés.

## Périmètre et reproductibilité

Contrôle du code indexé dans une copie isolée `tmp/qa-production-final`, build Next de production servi sur le port 3140. Les cinq changements déjà présents avant cette mission restent hors du commit : ordre CSS dans `app/layout.tsx`, `app/story-motion.css`, anciens composants `contact.tsx`, `knowledge-system.tsx`, `projects.tsx`. L’import de police ajouté dans `layout.tsx` est indexé séparément de son changement préexistant. Les tests et un build ont aussi été exécutés dans le workspace complet ; ils passent, avec environ 172 kB au premier chargement contre 171 kB pour la branche isolée.

Environnement : Windows, Node 22, pnpm 10.8.1, Lighthouse 12.8.2, Chrome local headless. Les audits utilisent `next start`, pas `next dev`. Rapports sources compressés et synthèse dans [reports](reports/). Le seul avertissement du build isolé concerne les lockfiles de la copie imbriquée ; le build à la racine n’a pas cet avertissement.

```sh
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm start --port 3140
# Dans un autre terminal, Chrome installé :
npm exec --yes --package=lighthouse@12.8.2 -- lighthouse http://localhost:3140/fr --chrome-flags="--headless --no-sandbox" --output=json --output-path=./mobile.json --only-categories=performance,accessibility,best-practices,seo
# Ajouter --preset=desktop pour la simulation desktop.
```

## Résultats des gates

| Contrôle | Résultat |
| --- | --- |
| `pnpm lint` | PASS, aucun avertissement ESLint |
| `pnpm typecheck` | PASS ; `strict: true`, frontières client/serveur acceptées par le build |
| `pnpm test` | PASS, 21 artefacts et 65 fichiers source ; contrôle AST des traductions FR/EN et des appels `text(fr,en)` |
| `pnpm build` | PASS, 16/16 pages, accueils et six études de cas pré-rendus |
| JavaScript initial, branche isolée | accueils 171 kB ; études de cas 108 kB ; commun 102 kB (estimation Next, pas transfert mesuré) |
| Console navigateur production | aucune erreur applicative ou d’hydratation observée dans les parcours testés |
| HTTP local | huit pages de contenu, robots, sitemap, OG et PDF en 200 ; un h1/page, ancres internes présentes |

## Mesures réelles de laboratoire

Lighthouse mobile par défaut : simulation réseau/CPU mobile et mode Recruteur initial, stockage vierge, aucune 3D chargée. Desktop : preset desktop. Les paramètres complets, versions et horodatages sont conservés dans les JSON sources.

| Page / profil | Performance | Accessibilité | Bonnes pratiques | SEO | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `/fr`, mobile, mesure de livraison | 92 | 100 | 100 | 100 | 3,175 s | 0,0073 | 32 ms |
| `/fr`, desktop, confirmation finale | 100 | 100 | 100 | 100 | 0,676 s | 0,0111 | 0 ms |
| `/en/work/greecheck`, mobile | 97 | 100 | 100 | 100 | 2,411 s | 0 | 18,5 ms |

Trois passages mobiles antérieurs aux derniers ajustements de libellés, après corrections principales : performances 91 / 92 / 92, LCP 3,170 / 3,166 / 3,163 s ; médiane 92 et 3,166 s. Ces mesures sont conservées séparément, pas sélectionnées pour masquer un résultat moins favorable. Le changement de police n’a pas produit de gain LCP significatif mesurable sur ces passages.

**Objectif LCP mobile ≤ 2,5 s : non atteint sur l’accueil.** CLS < 0,1 atteint dans ces simulations. Performance mobile ≥ 90 atteinte. INP < 200 ms : **non mesuré**, aucune donnée terrain ; TBT n’est pas l’INP. Les scores d’accessibilité automatisés ne certifient pas la conformité WCAG. Aucun benchmark de fluidité universelle, de batterie ni de 60 FPS revendiqué.

Les pistes encore visibles dans Lighthouse sont principalement le CSS bloquant (environ 40 kB transférés sur quatre fichiers), les styles historiques inutilisés dans les couches actives, et le coût du DOM décoratif. Une purge automatique des sélecteurs dynamiques n’a pas été appliquée. Réévaluer le LCP sur Vercel Preview puis réduire ces couches sans casser les modes.

## Corrections de cette passe

- Origine canonique passée de `www.lowkyz.dev` à `lowkyz.dev` dans la source commune : metadata, sitemap, robots, JSON-LD et études de cas.
- Changement FR/EN : synchronisation du `lang` du conteneur de contenu, titre complet, URL Open Graph et métadonnées Twitter, en plus des textes et du canonical.
- Libellés accessibles corrigés après Lighthouse : clones décoratifs des CTA exclus du nom, nom du lien de scroll mobile, rôle de l’image typographique, noms des contrôles navigation/email alignés avec leur texte visible.
- Geist local avec `font-display: optional` ; préchargement/font fallback gérés par Next. Aucun appel Google Fonts à l’exécution.
- Nettoyage GPU : ressources géométriques, matériaux, renderer puis contexte WebGL libérés. RAF et listeners retirés ; import Three.js différé existant conservé.
- Deux composants de toggle jamais montés et leurs dépendances `@radix-ui/react-toggle-group`, `class-variance-authority` supprimés. Gain de dépendances installées ; aucun gain de bundle initial revendiqué, car ces modules n’étaient pas dans le parcours livré.
- Validation de production remise sur les composants V2 réellement montés et les médias des trois projets ; garde contre traductions vides/incomplètes.
- README et MASTERPLAN actualisés.

## Revue technique

Le contenu reste HTML ; pas de rendu React par frame. `Constellation` charge `constellation-engine` dynamiquement uniquement en Explore, mouvement autorisé et appareil capable, sans Save-Data ; DPR plafonné à 1–1,5. Le SVG/CSS est présent immédiatement. La boucle WebGL s’arrête en onglet caché ; le Lab utilise IntersectionObserver et annule ses RAF/timers/listeners au démontage. Le runtime DOM se désabonne lorsqu’il n’a plus d’abonnés. AudioContext suspendu en mute/onglet caché et fermé au démontage.

`next/image` fournit tailles et formats adaptés ; photos et projets ont des dimensions/conteneurs réservés, les images sous le premier écran sont différées ; l’image principale d’étude de cas peut être prioritaire. Polices locales. Aucun nouveau moteur graphique ni dépendance UI lourde.

Revue des imports et du bundle : les anciens composants non montés et les feuilles CSS non importées restent historiques. Certains sélecteurs des feuilles globales actives sont redondants ou servent l’ancien parcours ; ils constituent une dette de taille CSS documentée, sans être une erreur de compilation. Les fichiers préexistants modifiés n’ont pas été écrasés. Aucun test mémoire instrumenté de longue durée : la revue du cleanup et les basculements ne constituent pas une preuve d’absence absolue de fuite.

## SEO et contenu

Les huit pages FR/EN ont un canonical apex correct, titre/description spécifiques, hreflang FR/EN, un h1 et des ancres valides. Sitemap contient les huit URLs et leurs alternates ; robots permet l’indexation. OG et Twitter présents ; JSON-LD Person/WebSite/SoftwareApplication et CreativeWork selon page. Aucun projet inventé ajouté à l’index.

Comparaison au CV 2026 joint : iAudiogram 09/2022–09/2025 en alternance ; Santé Respiratoire France 01/2022–04/2022 en stage ; Biosency 05/2021–06/2021 stage puis CDD. EPSI Montpellier 2020–2025, Bac+3 RNCP 6 et Bac+5 RNCP 7 ; Google AI Fundamentals 2026. Technologies, langues, mobilité et rôles cohérents. Aucun pourcentage de maîtrise ou résultat chiffré ajouté. Les deux langues sont présentes dans les sources typées.

PDF public : 179 815 octets ; SHA-256 `BBA20E7D3FD52DCD072BAD9F5AB79B7D973799B21BCEBEDAA8945EE5F17BFBFD`, identique au fichier joint dans Downloads. La route et le lien CV pointent vers ce fichier. Il garde son ancienne mention `www.lowkyz.xyz`, à corriger dans un nouveau CV approuvé ; le PDF n’a pas été maquillé pour le présenter comme une autre source.

Liens externes contrôlés en HTTP : GreeCheck, 808BLOOM, Tech Express V1/V2, GitHub personnel, dépôts GreeCheck et CEO1.9 : 200. LinkedIn : 999, accès automatisé bloqué, à vérifier manuellement. Les captures conservées sont les médias documentés dans `CONTENT-SOURCES.md` / `WORK-SOURCES.md` ; cette passe HTTP ne constitue pas une nouvelle certification de chaque interface externe.

## Interactions exercées dans le navigateur intégré

- Entrée directe Recruteur ; première visite Explore dans un nouvel onglet ; entrée avec son explicite, contrôle mute ; reload sans intro ; replay et Skip.
- Recruteur/Explore en conservant `#stack`, navigation de menu mobile, Ctrl+K, Escape, préférences de thème et langue persistées.
- Mouvement manuel désactivé : aucun reveal laissé masqué. Priorité de `prefers-reduced-motion` inspectée dans les sources ; réglage OS non modifié.
- Les six études de cas en navigation directe FR/EN : titres et contenu corrects, aucune erreur console. Mobile 390 × 844 sans débordement horizontal ; revue multi-formats et visuelle détaillée dans `VISUAL_QA.md`.
- Contrôle des liens email/CV et du fichier servi. Aucun email envoyé. Le son a été vérifié par son état de contrôle et l’absence d’erreur Web Audio ; aucune certification d’écoute sur matériel externe.

## Réserves et actions humaines avant publication

Le projet du workspace est démarré en développement sur `http://localhost:3000/fr` et a été ouvert dans le navigateur intégré. Logs locaux : `tmp/lowkyz-dev.log` et `tmp/lowkyz-dev-error.log`. Cet aperçu contient aussi les cinq changements préexistants ; les audits Lighthouse concernent la copie de production isolée.

1. Revoir et autoriser la PR, le push et ensuite le déploiement séparément. Aucun acte distant effectué ici.
2. Choisir `lowkyz.dev` comme domaine primaire Vercel et rediriger `www` vers lui : le site public observé redirige actuellement l’apex vers `https://www.lowkyz.dev/fr`.
3. Tester la Preview, notamment Safari/iOS réel, clavier/lecteur d’écran, audio et rendu des polices sur réseau lent. Vérifier LinkedIn manuellement.
4. Fournir éventuellement un CV approuvé avec le domaine `.dev` actualisé.
5. Améliorer le LCP de l’accueil si le seuil de 2,5 s est une condition de publication ; mesurer ensuite sur le domaine final. Configurer un outil de données terrain uniquement après choix/autorisation.
6. Décider du sort des cinq changements préexistants encore non commités. Ils ne figurent pas dans cette PR de livraison.

## Historique de livraison

| Commit | Mission |
| --- | --- |
| `221b65c` | Audit et plan |
| `6c8bbe1` | CV 2026 et données professionnelles |
| `b9f994d` | Design system |
| `4ed0a79` | Intro cinématique |
| `3d957cc` | Hero et navigation |
| `1ab80be` | Fond vivant et moteur de mouvement |
| `7163436` | Work et études de cas |
| `10e3061` | Experience et expertise |
| `76f835a` | About, Lab, Contact |
| `6600057` | Modes et responsive |
| `0ea43b4` | Polish créatif et visuel |
| commit contenant ce rapport | Optimisation, validation finale et documentation |
