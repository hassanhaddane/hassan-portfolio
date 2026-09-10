# LOWKYZ // Interactive Developer System

Portfolio bilingue de Hassan Haddane, développeur Web Full-Stack à Rennes. Le site combine une lecture rapide pour les recruteurs et une exploration plus expressive, avec trois moments centraux : le Digital Organism du hero, le récit produit de GreeCheck et le Knowledge Graph qui relie technologies, projets, expériences et pratiques.

## Démarrage

Le projet utilise Node.js 22, pnpm 10, Next.js 15 et React 19.

```sh
pnpm install
pnpm dev
```

La version de production se valide ainsi :

```sh
pnpm lint
pnpm test
pnpm typecheck
pnpm build
pnpm start
```

Aucun secret ni service distant n'est requis pour lancer le portfolio.

## Routes

- `/` redirige vers `/fr`
- `/fr` contient la version française et ses métadonnées dédiées
- `/en` contient la version anglaise et ses métadonnées dédiées
- `/opengraph-image` génère l'image sociale LOWKYZ
- `/robots.txt` et `/sitemap.xml` sont générés par Next.js
- `/cv-hassan-haddane.pdf` sert le CV actuel

## Expérience

- **Récit en sept chapitres** : `00 NOW`, `01 PROJET`, `02 EXPÉRIENCE`, `03 COMPÉTENCES`, `04 FORMATION`, `05 À PROPOS`, `06 CONTACT`. Chaque chapitre possède un marqueur lisible, une transition vers le suivant et un signal graphique issu du même organisme numérique.
- **Repère permanent** : un rail latéral sur desktop et une barre compacte sur mobile synchronisent le numéro et la catégorie avec la position réelle, y compris sur les liens profonds et après un changement de mode.
- **Recruiter Mode** affiche une synthèse immédiate du profil et une lecture claire de la stack.
- **Explore Mode** charge Three.js à la demande et active le Digital Organism, les réactions aux technologies, le curseur contextuel et les transitions enrichies.
- **Lampe LOWKYZ** pilote deux thèmes dessinés séparément. Le thème clair minéral est l'état par défaut, le thème sombre profond correspond à la lampe éteinte et le choix est restauré localement sans flash d'hydratation.
- **Performance adaptative** choisit un rendu high, normal, low ou reduced selon le mouvement préféré, la taille d'écran, la mémoire, le nombre de cœurs et l'économiseur de données.
- **Ctrl/Cmd+K** ouvre une palette accessible avec navigation, `whoami`, `stack`, `hire`, langue, mode et mouvement.
- **GreeCheck** utilise des captures publiques réelles et un mode système interactif. Les expériences médicales restent des représentations abstraites explicitement légendées.
- **Knowledge Graph** relie uniquement des technologies et contextes déclarés dans le CV et les informations fournies.
- **Contact** permet de copier l'email, appeler, ouvrir les profils ou télécharger le CV sans formulaire serveur.

## Architecture

```text
app/                            Routes, styles, métadonnées, OG, sitemap et robots
components/portfolio/           Hero, récit projet, expériences, Knowledge Graph, formation, About et Contact
components/system/              Préférences, navigation, palette, motion, Easter eggs et canvas
components/ui/                  Primitives Radix/cmdk strictement nécessaires
lib/portfolio-data.ts           Données professionnelles et contenus bilingues
lib/work-data.ts                Storytelling et relations factuelles de GreeCheck
lib/knowledge-data.ts           Nœuds et connexions du Knowledge Graph
lib/constellation-*.ts          Géométrie et moteur WebGL différé
public/projects/                Captures publiques optimisées de GreeCheck
public/cv-hassan-haddane.pdf    CV courant
scripts/generate-cv.py          Génération reproductible du CV avec ReportLab
scripts/validate-production.mjs Contrôles de production ciblés
docs/                           Audit initial, UX, direction et décisions techniques
```

Les fontes Barlow Condensed et Geist sont auto-hébergées. Le CSS est centralisé par système visuel, avec une couche finale de tokens light/dark et de garde-fous typographiques fluides. Three.js est exclu du chemin critique et importé uniquement pour les appareils capables d'exécuter l'expérience enrichie.

## Contenu et confidentialité

Le portfolio n'affiche ni score de compétence arbitraire, ni statistique inventée. GreeCheck est présenté avec ses fonctions réelles : scan, recherche, comparaison, GreeScore local et explicable, trois langues, historique, favoris, critères et listes. Les travaux iAudiogram, Santé Respiratoire France et Biosency sont décrits sans données internes ni captures fictives.

Pour mettre à jour le profil, modifier les données dans `lib/portfolio-data.ts`, `lib/work-data.ts` et `lib/knowledge-data.ts`. Le CV se régénère avec `python scripts/generate-cv.py`.

## Accessibilité et qualité

Toutes les informations importantes restent disponibles sans WebGL. Les sections sont focalisables depuis la palette, la navigation comporte un lien d'évitement, les dialogues gèrent le focus et Escape, les interactions disposent d'états clavier et les animations respectent `prefers-reduced-motion`. Les rendus mobile utilisent une composition et un explorateur adaptés plutôt qu'une réduction du graphe desktop.

La publication n'est pas automatique : cette refonte reste locale tant qu'elle n'est pas déployée explicitement.
