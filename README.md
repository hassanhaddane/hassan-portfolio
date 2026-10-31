# LOWKYZ // Hassan Haddane

Portfolio bilingue (FR/EN) de Hassan Haddane, développeur Full-Stack à Rennes. Le site présente ses expériences en santé, ses projets documentés, sa formation et ses moyens de contact. La direction Creative V2 est décrite dans [`docs/creative-v2/MASTERPLAN.md`](docs/creative-v2/MASTERPLAN.md) ; le site utilise le code Next.js existant.

## Démarrage et validation

Node.js 22, pnpm 10, Next.js 15, React 19 et TypeScript.

```sh
pnpm install
pnpm dev
pnpm lint
pnpm test
pnpm typecheck
pnpm build
```

`/` redirige vers `/fr`. Les pages `/fr` et `/en` sont pré-rendues. Le site sert aussi `/opengraph-image`, `/robots.txt`, `/sitemap.xml` et `/cv-hassan-haddane.pdf`. L'origine canonique est `https://www.lowkyz.dev`, hôte final de la redirection depuis `lowkyz.dev` constatée lors de l'audit.

## Modifier le contenu

| Fichier | Source de vérité |
| --- | --- |
| `lib/portfolio-data.ts` | Identité, coordonnées, positionnement, traductions communes, types et provenance |
| `lib/work-data.ts` | Expériences, projets, contributions et étapes de GreeCheck |
| `lib/knowledge-data.ts` | Compétences et leurs liens documentés, formation, certification, langues et intérêts |
| `lib/seo.ts` | Origine canonique et métadonnées FR/EN |
| `public/cv-hassan-haddane.pdf` | Copie du CV 2026 fourni par Hassan |

Les objets `Evidence` associent chaque affirmation détaillée à une source. Les compétences déclarées dans le CV n'ont un lien vers un projet ou une expérience que si ce lien est documenté. Les composants consomment ces données sans réécrire les dates, les technologies ou les diplômes.

Le PDF public est le CV 2026 fourni, pas un PDF généré à partir du contenu du site. Pour le mettre à jour, remplacer explicitement ce fichier par un nouveau CV approuvé et vérifier son contenu et son rendu. L'ancien script `generate-cv.py` a été retiré : il contenait des dates, diplômes et une URL obsolètes et aurait pu écraser le CV fourni.

Les sources et les limites de vérification de cette synchronisation sont décrites dans [`docs/creative-v2/CONTENT-SOURCES.md`](docs/creative-v2/CONTENT-SOURCES.md). Tech Express figure comme réalisation locale sans lien public : le dépôt distant n'est pas accessible publiquement et aucune publication du site n'a été validée. Le projet 808BLOOM est présenté comme une participation associative, pas comme un emploi salarié.

## Architecture

- `app/` : routes, métadonnées, sitemap, robots et CSS existant.
- `components/portfolio/` : hero, projets, expériences, compétences, formation, About et contact.
- `components/system/` : navigation, préférences, palette et animation. Le moteur Three.js est chargé à la demande ; le contenu HTML et le fallback restent disponibles.
- `lib/` : données professionnelles et signaux visuels.
- `public/projects/greecheck/` : captures du produit.

Le site garde ses liens GitHub et LinkedIn, le téléchargement du CV, les commandes clavier, les thèmes et le respect de `prefers-reduced-motion`. Aucun déploiement n'est lancé par les scripts ci-dessus.
