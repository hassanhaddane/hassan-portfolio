# LOWKYZ Creative V2 — visual QA

Passe du 2 novembre 2026. Audit effectué dans le navigateur intégré sur une copie isolée du dépôt, excluant les cinq fichiers déjà modifiés avant cette mission. Les captures ci-dessous proviennent de cette passe. Aucun déploiement.

## Problèmes constatés et corrections

| Constat observé | Correction effectuée | Preuve |
| --- | --- | --- |
| À 768 px, Work conservait une colonne de titre très étroite et un grand vide à gauche. | Introduction en une colonne jusqu’à 1100 px, largeur de lecture conservée. | [Avant tablette](screenshots/polish/board-768.jpg), [après](screenshots/polish/fr-768.jpg) |
| Hero tablette : séparation excessive entre CTA et faits professionnels. Sur mobile haut, la hauteur imposée éloignait le premier projet. | Grille tablette dimensionnée par le contenu ; fin de la hauteur minimale forcée sur mobile. | Mêmes captures tablette et [mobile final](screenshots/polish/fr-390.jpg) |
| Les ancres mobiles ajoutaient 150 px de marge sous le haut de fenêtre, puis le padding de section. | Marge de défilement ramenée à 80 px et padding des chapitres mobiles à 44 px. | [Avant mobile](screenshots/polish/board-390.jpg), [après](screenshots/polish/fr-390.jpg) |
| Navigation native entre ancres : une correction différée pouvait restaurer la destination précédente pendant des changements rapides. | Le gestionnaire existant écoute aussi `hashchange`, annule la correction précédente et recalcule la destination. | Navigation directe répétée entre les huit chapitres, FR/EN. |
| About mobile : titre sur trop de lignes et portrait repoussé sous le premier écran de section. | Échelle du titre mobile et espacement de la composition resserrés. | [About final, sixième vue](screenshots/polish/fr-430.jpg) |
| Les catégories Skills débordaient dans une barre horizontale, sans visibilité immédiate de toutes les familles. | Retour à la ligne des filtres sur mobile ; cibles de 44 px. Les compétences restent des listes textuelles. | [Skills final](screenshots/polish/en-mobile-reduced.jpg) |
| Révélations cumulées lentes : lettres sur environ 1,3 s et nouvelle révélation après la transition de l’intro. Changer de mode pouvait rejouer le nom. | Lettres 560 ms + stagger 26 ms ; fenêtre d’entrée bornée ; pas de seconde révélation après la transition cinématique. Tokens reveal 540 ms, éditorial 760 ms. | [Intro, choix](screenshots/polish/intro-choice.jpg), [transition intermédiaire](screenshots/polish/intro-transition.jpg). Ces deux captures sont des états animés, pas des écrans finaux. |
| Les réglages et boutons du Lab avaient des cibles de moins de 44 px. | Hauteur minimale 44 px pour les sliders et boutons. | Fréquence passée de 3 à 4 au clavier, inclinaison portée à 12 ; contrôles actifs uniquement dans le mode approprié. |
| Palette de commandes visuellement générique et petites lignes. | Sélection avec filet lime, surfaces issues des tokens, angles droits et texte agrandi ; structure cmdk/Radix conservée. | [Palette ouverte](screenshots/polish/after-palette-en.jpg) |
| En Explore mobile, une règle plus spécifique réaffichait le libellé dans le bouton de 44 px. | Spécificité corrigée ; libellé accessible conservé, texte visuel masqué sur mobile. | [EN final](screenshots/polish/en-mobile-reduced.jpg) |
| Avertissements Next Image pour la qualité 82 existante. | Qualités 75 et 82 déclarées dans la configuration. | Configuration vérifiée et build. |

## Parcours visuel, dans l’ordre

1. **Hero — validé** : nom, métier, faits et CTA visibles ; composition compacte tablette/mobile ; signal discret derrière le texte.
2. **Navigation — validée** : barre fixe/flottante, menu plein écran, palette et priorité des overlays. Escape ferme la palette ; Ctrl+K l’ouvre. [Menu mobile](screenshots/polish/before-menu.jpg) conservé après revue : pas de chevauchement ni de lien inaccessible.
3. **Work — validé** : trois vraies captures et trois compositions distinctes : [GreeCheck](screenshots/polish/project-greecheck.jpg), [808BLOOM](screenshots/polish/project-808bloom.jpg), [Tech Express](screenshots/polish/project-tech-express.jpg). Contexte et rôle restent textuels. Les sources des images sont conservées.
4. **Experience — validée** : dates, fonction et alternance lisibles ; ligne verticale adaptée au mobile, détails natifs dépliables.
5. **Skills — validées** : toutes les catégories identifiables ; sélection de compétence et relations accessibles sans graphe imposé.
6. **Education / About — validés** : diplômes lisibles, portrait réel, récit et langues ; densité améliorée sans changer les faits.
7. **Lab — validé** : sliders au clavier fonctionnels, deux expériences, pause et fallback ; aucune boucle Canvas en Recruiter. Mouvement réduit : lecture statique et réglages sans animation continue.
8. **Contact — validé** : titre, email et copie accessibles, liens sociaux/CV ; CTA cobalt immédiatement identifiable.
9. **Intro — validée sur desktop** : choix atteint après environ 1,2 s, entrée silencieuse puis transition de 900 ms ; son resté OFF. Skip disponible. La transition et la révélation du hero ne se cumulent plus.
10. **Global — validé dans les limites ci-dessous** : rythme resserré, palette obsidienne/cobalt/minéral cohérente, aucune nouvelle dépendance.

## Formats et états contrôlés

Captures des huit sections (ordre : Hero, Work, Experience, Skills, Education, About, Lab, Contact) :

- [1440 × 900](screenshots/polish/fr-1440.jpg)
- [1920 × 1080](screenshots/polish/fr-1920.jpg)
- [1366 × 768](screenshots/polish/fr-1366.jpg)
- [768 × 1024](screenshots/polish/fr-768.jpg)
- [390 × 844](screenshots/polish/fr-390.jpg)
- [430 × 932](screenshots/polish/fr-430.jpg)
- [EN desktop / Explore](screenshots/polish/en-board-1440.jpg), [EN mobile / mouvement désactivé](screenshots/polish/en-mobile-reduced.jpg)

FR et EN contrôlés aux six formats : aucun débordement horizontal de document et aucun h1/h2/h3 dépassant sa boîte de plus de 4 px après stabilisation. Captures initiales et finales comparées visuellement. Les états intermédiaires d’intro ont été inspectés séparément. Menu et palette restent au-dessus du contenu ; l’intro au-dessus de la navigation. Aucun overlay d’erreur dans la passe finale ; console sans erreur applicative.

## Vérifications et limites restantes

- `pnpm lint` : réussi, aucun avertissement ESLint. `pnpm test` : réussi, 14 artefacts et 66 fichiers source contrôlés. `pnpm build` : réussi, 16/16 pages générées. `pnpm typecheck` : réussi après le build. Vérifications exécutées sur la copie isolée correspondant aux fichiers indexés ; le seul avertissement de build concerne les deux lockfiles dus à cette copie imbriquée.
- La passe ne constitue pas une certification WCAG : ni lecteur d’écran réel, ni mesure exhaustive des contrastes, ni Safari/iOS physique testés. Clavier, sémantique des contrôles et styles de focus existants inspectés.
- La préférence manuelle de mouvement désactivé a été exercée dans le navigateur. La priorité `prefers-reduced-motion` reste couverte par le code et les media queries ; le réglage système de la machine n’a pas été modifié pendant cet audit.
- Aucun benchmark de fluidité/GPU ou garantie de 60 FPS. Le moteur adaptatif existant, la pause hors écran et le nettoyage des ressources restent en place.
- Les images de projets sont des captures documentées ; cette passe ne revérifie pas le contenu actuel des applications externes. Le bandeau clair visible en haut de la capture 808BLOOM appartient au fichier source et n’a pas été retouché.
