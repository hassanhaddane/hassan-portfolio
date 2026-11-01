# LOWKYZ Creative V2 — design system

## Intention

LOWKYZ est un portfolio personnel de développeur Full-Stack avec la rigueur d'un studio numérique. La signature est un **signal cobalt** sur un fond graphite, cadré par des lignes fines et une composition éditoriale asymétrique. Les informations professionnelles restent lisibles en premier. Le lime sert uniquement à un signal ponctuel. Le concept visuel généré pendant la conception était une référence d'ambiance ; ses contenus et visuels fictifs ne sont pas utilisés sur le site.

## Source de vérité

Les primitives transversales et l'action réutilisable sont dans `app/globals.css`. Les couleurs sémantiques et les deux thèmes sont dans `app/theme-system.css`. `app/hero-system.css` possède désormais le hero, le signal et la navigation responsive ; `app/clarity-system.css` les sections et projets. L'ancienne feuille `app/professional-contact.css`, consacrée à des classes qui n'existent plus dans les composants, a été retirée. Ajouter une règle dans le fichier propriétaire avant d'envisager une nouvelle feuille.

## Tokens

| Rôle | Token | Valeur |
| --- | --- | --- |
| Obsidian | `--color-obsidian` | `#080A0E` |
| Cobalt | `--color-cobalt` | `#3267FF` |
| Mineral | `--color-mineral` | `#F3F1EB` |
| Secondary | `--color-slate` | `#A0A7B7` |
| Signal | `--color-lime` | `#C4F578` |
| Background | `--background` | thème sombre : obsidian ; thème clair : `#F2F0E9` |
| Foreground | `--foreground` | thème sombre : mineral ; thème clair : `#10151D` |
| Surfaces | `--surface`, `--surface-raised`, `--surface-soft` | profondeur graduée selon le thème |
| Text | `--text-secondary`, `--text-tertiary` | hiérarchie de lecture selon le thème |
| Lines | `--line-subtle`, `--line-emphasis` | bordures sémantiques, 1 px |
| Focus | `--ring` | anneau visible dans les deux thèmes |

Espacements : `--space-1/2/3/4/6/8/12/16/24/32` = `4/8/12/16/24/32/48/64/96/128px`. La grille de page utilise `--gutter: clamp(24px, 3.5vw, 72px)` et `--content-width: 120rem`; les paragraphes longs visent `--reading-width: 42rem`.

Typographie : **Barlow Condensed 800** (`--display`) pour les titres identitaires et de chapitre ; **Geist Sans** pour navigation, boutons et lecture ; monospace système (`--font-geist-mono`, `.mono`) pour index, périodes et métadonnées seulement. Les titres ont une échelle fluide avec `clamp()`, un interlignage serré et des paragraphes de 16–20 px à 1.6–1.7 d'interlignage. La densité vient du contraste d'échelle, des séparateurs et des colonnes plutôt que de blocs vides.

Mouvement : `--ease-out-expo`, `--ease-in-out`, `--duration-fast` (180 ms), `--duration-normal` (360 ms), `--duration-expressive` (620 ms), puis l'échelle micro/reveal/editorial/idle détaillée dans [MOTION_SYSTEM.md](./MOTION_SYSTEM.md). Les interactions décoratives disparaissent avec `prefers-reduced-motion: reduce` ou `data-motion="off"`. Le mouvement n'est jamais nécessaire pour lire ou naviguer. Bordures : `--radius-control: 4px` et `--radius-surface: 8px`. En-tête : `--header-height: 84px`.

## Composants

`CreativeAction` (`components/ui/creative-action.tsx`) accepte `href` pour un lien ou les propriétés natives d'un bouton. Ses variantes sont `primary` (cobalt), `secondary` (surface bordée), `text` (action légère) et `icon` (contrôle carré avec nom accessible). Sa structure commune contient deux copies visuelles du libellé pour le décalage, un pictogramme mobile et un fond interne qui se révèle. Le libellé accessible est fourni une seule fois avec `aria-label`; la duplication visuelle est cachée aux lecteurs d'écran. Les états hover, focus-visible, active et disabled sont distincts. Un lien vers une action indisponible ne doit pas être rendu : utiliser un bouton `disabled`.

Le hero utilise le nom comme masque typographique, puis présente le poste Full-Stack, une accroche, des faits vérifiés et les accès projets/CV/contact. Le filament existant reste son seul objet graphique : il répond au pointeur et au scroll, avec un SVG de secours quand WebGL n'est pas disponible. La grille technique reste faible et cantonnée à l'arrière-plan. La navigation compacte propose six destinations principales ; Accueil et Formation sont aussi accessibles dans le menu mobile, le rail et la palette de commandes. « Lab » cible la partie audio et associative documentée dans À propos, sans dupliquer de projet. Les huit repères du rail reflètent ces ancres. Les cartes projet restent des dossiers éditoriaux : index, contexte, résumé, preuve et lien externe clairement indiqué.

## Responsive et accessibilité

| Largeur | Principe |
| --- | --- |
| 390 px | Un seul axe de lecture, actions accessibles au pouce, navigation dialog |
| 768 px | Colonnes réduites, titres fluides, aucune hauteur figée |
| 1440 px | Composition éditoriale asymétrique, nav complète et rail |
| 1920 px | Contenu plafonné à 120rem, lignes de lecture contrôlées |

Les points de rupture existants (430, 700/760 et 1180 px) restent les seuils d'implémentation. Les quatre largeurs ci-dessus sont les cibles de contrôle. Le thème sombre est le défaut, y compris avant hydratation ; une préférence claire enregistrée reste respectée. Les liens, boutons, la bascule FR/EN, le dialogue mobile, le focus clavier et le fallback WebGL restent fonctionnels. Aucun verrouillage du défilement n'est ajouté.
