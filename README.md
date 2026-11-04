# LOWKYZ / Hassan Haddane

Portfolio personnel FR/EN : code, rythme et craft. Next.js 15 / App Router, React 19, TypeScript strict, Tailwind CSS 4 et moteur Three.js existant. Node 22, pnpm 10.8.1.

## Développement

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm start
```

Aucune variable d’environnement requise. `/` redirige vers `/fr`. Les pages `/fr`, `/en` et les huit études de cas sont pré-rendues. Aucun script ne pousse ni ne déploie.

## Architecture

- `components/portfolio/portfolio-experience.tsx` compose une seule expérience : accueil, projets, expérience, expertise, à propos, contact.
- `lib/portfolio-data.ts` : identité, coordonnées et provenance. `work-data.ts` : expériences, quatre projets et études de cas. `knowledge-data.ts` : compétences, relations documentées et formation. `personal-data.ts` et `experience-copy.ts` : contenu bilingue.
- `components/system` : navigation sticky, menu mobile Radix, commandes Ctrl/Cmd+K, accessibilité et mouvement partagé.
- `components/intro` : signature « Enter the frequency », signal SVG partagé avec le hero, lettrage tracé puis transfert vers le hero en 2,08 s. Skip, Échap, replay, garde-fous et retour du focus ; pas d’audio. Ancres et mouvement réduit : contenu direct.
- `components/ui/wordmark.tsx` : lettrage vectoriel original ; aucune image générée.
- `app/globals.css` : tokens et compositions ; `intro-system.css` : entrée ; `signature-motion.css` : langage de mouvement ; `work-showcase.css` : études de cas. `lib/frequency.ts` centralise la géométrie du signal et du wordmark.
- `lib/motion-runtime.ts` : événements et RAF partagés ; `constellation-engine.ts` : moteur Three.js conservé, importé après l’intro, uniquement sur desktop à pointeur fin, avec au moins huit cœurs logiques et 8 Go de mémoire annoncés, hors économie de données. Le rendu GPU est suspendu hors des scènes accueil/expertise. Fallback SVG, réduction du mouvement, pause lorsque l’onglet est caché et destruction des ressources.
- Polices locales ; captures authentiques dans `public/projects` ; portrait original du CV.

Le scroll et les ancres restent natifs. Aucun verrouillage de section. Les animations ordinaires et les liens entre technologies et réalisations sont disponibles pour tous. Seul le choix d’accessibilité « réduire le mouvement » est conservé dans `lowkyz.accessibility.v2` ; la préférence système est prioritaire. Les anciennes préférences de présentation sont supprimées.

## Sources et statuts

Le CV dans `public/cv-hassan-haddane.pdf` est identique au PDF fourni le 4 novembre 2026 (SHA-256 contrôlé par `pnpm test`). Sa mention de l’ancien domaine reste intacte. Les dates, diplômes et compétences viennent du CV ; aucun pourcentage de maîtrise ni résultat chiffré ajouté.

GreeCheck : produit personnel et stockage local. 808BLOOM : travail web et engagement audio associatif distincts. Tech Express : interfaces de démonstration EN/AR ; aucune intégration commerciale affirmée. CEO1.9 : site public recontrôlé le 4 novembre 2026, capture réelle ajoutée ; l’ancien constat d’indisponibilité est dépassé. La boutique et les paiements ne sont pas validés par cet audit.

Voir [les décisions de phase 01](docs/phase-01.md) et [le rapport QA de phase 02](docs/phase-02/QA.md). Les documents et captures `docs/creative-v2` constituent les archives de la version précédente ; leurs mesures et descriptions ne décrivent pas nécessairement cette version.

## Livraison

La branche de production est `master`, reliée au projet Vercel existant `hassan-portfolio`. Le domaine `lowkyz.dev` redirige en HTTPS vers `www.lowkyz.dev` ; les métadonnées, le sitemap et les données structurées utilisent cette adresse principale. La protection des previews est conservée.

Les deux phases possèdent des commits distincts. Le rapport QA décrit le build vérifié avant publication ; la validation du déploiement public se fait après le push sur `master`.

## Tests navigateur

```sh
pnpm exec playwright install chromium
pnpm build
pnpm start --port 3101
# Dans un second terminal :
pnpm test:e2e
```

`PLAYWRIGHT_BASE_URL` permet d’exécuter la même suite contre une autre origine, dont la production. Les captures, traces d’échec et rapports JSON sont écrits dans `output/phase-02/` (ignoré par Git). Les images de contrôle retenues figurent dans `docs/phase-02/`. Playwright est une dépendance de développement uniquement. Les transitions natives entre documents restent une amélioration progressive : les liens fonctionnent aussi sans leur prise en charge.
