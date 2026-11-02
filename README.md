# LOWKYZ // Hassan Haddane — Creative V2

Portfolio personnel FR/EN : expériences, trois projets et études de cas, formation, compétences, About, Creative Lab et contact. Next.js 15.5.25, React 19, TypeScript strict ; validé sur Node 22 et pnpm 10.8.1.

## Installation

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm dev                 # http://localhost:3000/fr
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm start               # production locale après build
```

Aucune variable d’environnement requise. Autre port : `pnpm dev --port 3100`. Le build génère les types de routes Next sur un checkout vierge. Aucun script ne pousse ni ne déploie.

## Architecture

- `/` redirige vers `/fr` ; `/fr` et `/en` sont pré-rendus.
- `app/[locale]/work/[slug]` génère six études de cas FR/EN (GreeCheck, 808BLOOM, Tech Express), autres slugs en 404.
- `components/portfolio/portfolio-experience.tsx` compose `Hero`, `ProjectsV2`, `JourneyExpertiseV2`, `AboutV2`, `CreativeLabV2`, `ContactV2` et le JSON-LD.
- `components/system` : unique fournisseur de préférences, navigation responsive, palette Ctrl/Cmd+K, fond et mouvement. `components/intro` : états, logo, transition et contrôles audio.
- `lib/motion-runtime.ts` : événements et RAF DOM partagés. `constellation-engine.ts`, `field-shaders.ts`, `field-signal.ts` : unique moteur Three.js et signaux du contenu.
- `lib/fonts.ts`, `app/fonts` : polices locales. Geist utilise `font-display: optional` pour garder le fallback si son chargement manque le premier rendu.
- CSS : tokens et couches existantes `app/*system.css`, puis Work, Journey, Personal/Lab/Contact et modes. Les feuilles historiques non importées ne sont pas transférées.

## Modes et animations

Recruteur est le mode initial : contenu complet, fond SVG/CSS statique, CV et contact directs. Explore enrichit le même document avec parallax, reveals, signal vivant et Lab interactif. Le changement conserve la section.

Intro automatique uniquement pour une première visite Explore sans ancre ; accès direct en Recruteur. Replay, Skip et entrée silencieuse disponibles. Son original synthétisé, OFF par défaut, après geste explicite ; aucune musique externe.

Préférences locales : mode, langue, thème, mouvement. Mouvement réduit système prioritaire ; thème système sans choix manuel. WebGL différé sur desktop capable, DPR plafonné à 1–1,5, adaptation, pause d’onglet, destruction des ressources/contexte. Fallback sur appareils tactiles/modestes. Canvas du Lab suspendu hors écran. Scroll natif libre.

## Contenus

| Source | Usage |
| --- | --- |
| `lib/portfolio-data.ts` | Identité, coordonnées, types, provenance |
| `lib/work-data.ts` | Expériences, projets, preuves, rôles, captures, liens et études de cas |
| `lib/knowledge-data.ts` | Compétences, relations documentées, formation, certification, langues |
| `lib/personal-data.ts` | About, Lab, Contact bilingues |
| `lib/seo.ts` | Origine `https://lowkyz.dev`, métadonnées FR/EN |
| `public/cv-hassan-haddane.pdf` | CV 2026 fourni, conservé à l’identique |
| `public/projects/` | Captures authentiques documentées |

Modifier ces sources typées, conserver les traductions et les statuts : alternance iAudiogram, stage Santé Respiratoire France, stage puis CDD Biosency. 808BLOOM distingue web et engagement associatif/audio. Tech Express V1/V2 sont des démos GitHub Pages. CEO1.9 reste une exploration avec dépôt et démo en pause.

Pour changer le CV : fournir un PDF approuvé, remplacer le fichier, vérifier texte/rendu et téléchargement. L’original joint mentionne encore `www.lowkyz.xyz` : cette mention nécessite une nouvelle version approuvée ; le site utilise `.dev`.

## Qualité et limites

[PRODUCTION_QA.md](docs/creative-v2/PRODUCTION_QA.md) : mesures, liens, limites et points manuels. [VISUAL_QA.md](docs/creative-v2/VISUAL_QA.md) : captures et corrections. [MASTERPLAN.md](docs/creative-v2/MASTERPLAN.md) : plan et état livré.

Les scores locaux ne sont pas des données utilisateurs ; aucun INP terrain ni garantie de fluidité universelle. Les tests contrôlent artefacts/traductions et complètent les tests navigateur. Des composants/styles historiques restent dans le dépôt : les anciens `Projects`, `KnowledgeSystem`, `About`, `Contact` ne sont pas montés par V2. Deux dépendances uniquement liées aux toggles inactifs ont été retirées.

## Procédure Vercel manuelle

1. Relire la PR vers `master`, autoriser explicitement le push. Une intégration Vercel existante peut déclencher une Preview dès le push.
2. Vérifier racine du dépôt, preset Next.js, Node 22, `pnpm install --frozen-lockfile`, build `pnpm build`, sortie par défaut du preset. Pas d’export statique : `next/image` utilise le runtime Next/Vercel.
3. Garder `master` en production ; tester une Preview : FR/EN, six études de cas, PDF, images, console.
4. Configurer `lowkyz.dev` comme domaine primaire, `www` redirigé vers l’apex pour les canonical. La redirection observée pendant le QA va dans l’autre sens.
5. Après validation humaine, autoriser séparément merge/promotion. Vérifier HTTPS, robots, sitemap, canonical, OG et soumission du sitemap. Prévoir le retour au déploiement précédent.
6. Choisir et autoriser une mesure Web Vitals en production pour obtenir des données terrain.

Sources officielles : [déploiements Git](https://vercel.com/docs/git), [builds](https://vercel.com/docs/builds). Aucun push, merge, changement de domaine ou déploiement effectué pendant cette passe.
