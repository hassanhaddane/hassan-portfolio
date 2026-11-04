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
- `components/intro` : révélation du wordmark, automatiquement terminée après environ deux secondes. Passage, Échap, replay et retour du focus ; pas d’audio. Accès par ancre et mouvement réduit : contenu direct.
- `components/ui/wordmark.tsx` : lettrage vectoriel original ; aucune image générée.
- `app/globals.css` : tokens et compositions de la page principale ; `intro-system.css` : entrée ; `work-showcase.css` : études de cas.
- `lib/motion-runtime.ts` : événements et RAF partagés ; `constellation-engine.ts` : moteur Three.js conservé, importé après le premier rendu sur desktop adapté. Fallback SVG, réduction du mouvement, pause lorsque l’onglet est caché et destruction des ressources.
- Polices locales ; captures authentiques dans `public/projects` ; portrait original du CV.

Le scroll et les ancres restent natifs. Aucun verrouillage de section. Les animations ordinaires et les liens entre technologies et réalisations sont disponibles pour tous. Seul le choix d’accessibilité « réduire le mouvement » est conservé dans `lowkyz.accessibility.v2` ; la préférence système est prioritaire. Les anciennes préférences de présentation sont supprimées.

## Sources et statuts

Le CV dans `public/cv-hassan-haddane.pdf` est identique au PDF fourni le 4 novembre 2026 (SHA-256 contrôlé par `pnpm test`). Sa mention de l’ancien domaine reste intacte. Les dates, diplômes et compétences viennent du CV ; aucun pourcentage de maîtrise ni résultat chiffré ajouté.

GreeCheck : produit personnel et stockage local. 808BLOOM : travail web et engagement audio associatif distincts. Tech Express : interfaces de démonstration EN/AR ; aucune intégration commerciale affirmée. CEO1.9 : site public recontrôlé le 4 novembre 2026, capture réelle ajoutée ; l’ancien constat d’indisponibilité est dépassé. La boutique et les paiements ne sont pas validés par cet audit.

Voir [les décisions de phase 01](docs/phase-01.md). Les documents et captures `docs/creative-v2` constituent les archives de la version précédente ; leurs mesures et descriptions ne décrivent pas nécessairement cette version.

## Livraison

La branche de production reste `master`. Cette phase est préparée dans `codex/lowkyz-phase-01`, sans push, merge ni déploiement. La phase 02 affinera les animations et la validation finale avant toute mise en production.
