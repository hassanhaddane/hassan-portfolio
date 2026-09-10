# LOWKYZ // Interactive Developer System

## Audit avant implementation — 4 septembre 2026

- Next.js 15.2.4, React 19, TypeScript, Tailwind 4, composants shadcn/Radix. Une route publique et une API Resend.
- `app/page.tsx` est entierement client et cache le contenu derriere une introduction dependante de sessionStorage. Une erreur React d'hydratation est observee sur le site public.
- Sept sections conventionnelles, contenu repete, nombreuses cartes identiques, typographie majoritairement monospace, pas de visuels de produits reels.
- Les boutons Details et GitHub des projets n'ont pas d'action. Navigation par boutons au lieu d'ancres.
- 60+ dependances directes, collection presque complete de composants UI inutilises, doubles feuilles globales, stores et experiences terminal/chat non raccordes.
- Le curseur ancien met a jour React a chaque mouvement. Pas de politique globale de mouvement reduit ; animations multiples et absence de hierarchie.
- Metadonnees de base presentes, mais pas de canonical, sitemap, image Open Graph, donnees structurees. Optimisation des images et verification TypeScript desactivees.
- Le CV est un lien Canva public, pas un fichier local. GitHub verifie dans le code : lowkyz. Le README contient des informations obsoletes et un autre compte GitHub.
- GreeCheck : absent des sources. Information demandee a Hassan ; aucune description ou technologie ne sera inventee.
- Les changements IDE deja presents ne font pas partie de la refonte.

## Direction selectionnee avant implementation

Le concept A, atlas orbital cobalt, est retenu. Le concept B (filament vertical) est ecarte. Les concepts ne sont que des references visuelles : les textes et destinations inventes par l'image restent exclus. Les faits du depot et du site public priment.

Signature : un nom monumental, HASSAN / HADDANE, et une constellation orbitale oblique. Le reseau est le fil conducteur du parcours, pas une animation de chargement.

## Architecture UX

1. **Profil / entree** : identite, fonction, disponibilite reprise du site, Rennes/remote, CTA projets, CV et contact. Bande de lecture rapide avec experience iAudiogram, stack, recherche, formation. A propos, langues et centres d'interet integres a cette synthese.
2. **Projets / dossiers** : index de quatre realisations reelles, un dossier actif grand format. Contexte, contribution personnelle, technologies, details. Visuels abstraits SVG legendees ; aucune fausse capture d'application.
3. **Parcours / connexions** : ligne de temps experience et formation en une meme surface. Dates exactes, entreprise, fonction, localisation, details a la demande.
4. **Stack / graphe de preuves** : technologies selectionnables reliees aux realisations ; inventaire secondaire textuel. Aucun score de competence.
5. **Contact / convergence** : grand appel editorial, email direct et copie avec confirmation, telephone, GitHub, LinkedIn, CV. Pas de formulaire imposant une configuration serveur pour prendre contact.

Navigation par ancres, accessible et partageable. Les projets sont accessibles directement par fragment. Pas de routes superflues ni de scroll capture.

### Deux modes

- Recruiter par defaut : contenu immediat, synthese, constellation immobile, details a la demande.
- Explore : meme information et meme navigation, moteur WebGL charge a la demande sur appareils adaptes, transitions et curseur discret, exploration des dossiers.
- Mode, langue FR/EN et preference de mouvement memorises dans une cle locale versionnee, avec gestion du stockage indisponible.
- Le mouvement reduit du systeme a priorite sur l'animation. Le choix manuel est disponible dans l'en-tete et la palette.

### Command palette

Ctrl/Cmd+K ; bouton visible sur mobile. Recherche avec cmdk, dialogue Radix, focus contenu/restaure, Escape et navigation flechee. Profil, parcours, projets, stack, GreeCheck (si documente), CV, contact, GitHub, LinkedIn, mode, langue, mouvement. Pas de theme clair : le noir fait partie de la direction demandee.

## Design system

- Obsidian `#080a0e`, surface `#10141c`, texte `#f3f1eb`, secondaire `#a0a7b7`, cobalt `#3267ff`, cobalt lisible `#7c9cff`, signal ponctuel `#c4f578`, regles `#282e39`.
- Titres Barlow Condensed 700/800 auto-heberge, corps Geist Sans, informations Geist Mono. H1 fluide via clamp, interligne serre, approches negatif leger. Texte courant 16–18 px et interligne 1.6.
- Marges 24–72 px selon ecran ; colonnes ouvertes, lignes fines, index verticaux. Pas de bento ni de cartes repetitives.
- Boutons rectangulaires, rayon 3–5 px ; toggle segmente ; focus cobalt clair avec decalage. Lucide 18 px, trait 1.5, icones decoratives masquees aux lecteurs d'ecran.
- Grain statique tres discret ; lumiere radiale cobalt localisee ; aucune superposition coloree sur le texte.
- Mobile : navigation compacte, modes toujours accessibles, nom sur deux lignes, constellation contenue, dossiers empiles, chronologie verticale, cibles tactiles >=44 px.

## Hierarchie du mouvement

- Niveau 0 : contenu visible sans JavaScript, aucune introduction bloquante.
- Niveau 1 : feedback boutons/focus, 160–220 ms, transform/opacity ; transition d'un dossier a la fois.
- Niveau 2 Explore : reveals a l'entree du viewport, 550 ms, faible translation ; interactions magnetiques bornees et reservees aux CTA desktop.
- Niveau 3 Explore : constellation globale, une seule boucle requestAnimationFrame, aucun setState par frame. Morphing progressif suivant profil/projets/parcours/stack/contact, reaction amortie au pointeur et a la vitesse du scroll.
- L'onglet masque suspend le rendu. DPR borne, geometries reutilisees, nombre de points borne, nettoyage complet GPU/listeners. Appareil faible, mobile, mouvement reduit ou absence WebGL : SVG leger statique.
- Smooth scroll natif, desactive si mouvement reduit. Pas de scroll hijacking ni de librairie de scroll supplementaire.

## Architecture technique et dependances

- Next.js App Router conserve et mis a jour dans la branche 15 maintenue. TypeScript redevient un gate de build.
- `app/page.tsx` serveur compose la fondation ; ilots clients focalises et contenu prerendu indexable.
- `lib/portfolio-data.ts` : contenu bilingue type et informations professionnelles centralisees.
- `components/system/*` : provider, navigation, palette, constellation, comportements de mouvement.
- `components/portfolio/*` : hero, dossiers, parcours, stack, contact et figures natives.
- Primitives shadcn utiles conservees et adaptees : command, dialog, toggle-group. Suppression des anciennes sections, anciens stores et primitives non utilisees.
- Conserver Next/React/TypeScript/Tailwind, Geist, Lucide, cmdk, Radix necessaire, clsx/tailwind-merge. Ajouter Three.js charge dynamiquement et Barlow Condensed. Pas de React Three Fiber, GSAP ou Framer Motion requis pour cette fondation.
- Retirer carrousels, charts, formulaires, themes, Zustand, Immer, Framer Motion, Resend (contact direct), collection Radix inutilisee et dependances associees.
- CV de synthese PDF issu uniquement des donnees existantes ; lien vers le CV Canva original egalement conserve. Pas d'invention de missions ou resultats.
- SEO : canonical, robots, sitemap, image Open Graph generee avec Next, JSON-LD Person.

## Validation prevue

Build production + TypeScript ; inspection IAB 1440x900, mobile 390x844 et petit mobile. Console, chargement, ancres, dossiers, palette clavier, langue, persistance, mouvement, CV et liens. Comparaison des captures avec les concepts retenus : typographie, composition, palette, constellation, boutons et rythme. Aucun objectif de 60 FPS annonce comme mesure sans mesure reelle.

References techniques consultees : https://nextjs.org/blog/august-2026-security-release ; https://threejs.org/docs/pages/WebGLRenderer.html ; https://ui.shadcn.com/docs/components/radix/command ; https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md.
