# LOWKYZ Creative V2 — mouvement et fond vivant

## Principe

Le filament existant reste l'unique objet graphique. Il relie l'intro, le hero et les chapitres. Une couche de points et de grille très faible, une lumière cobalt diffuse et le grain déjà présent sur `body::after` créent de la profondeur sans placer un motif contrasté derrière les paragraphes. Aucun élément ni asset des références n'est repris.

Observation visuelle du 31 octobre / 1er novembre 2026 : [refact0r](https://refact0r.dev/) montre un champ de très petits points sur fond sombre ; [Daniele Buser](https://www.danielebuser.com/) maintient une grille éditoriale pendant le passage aux médias ; [Redoyanul Haque](https://www.redoyanulhaque.me/) emploie un personnage 3D central et un éclairage coloré. Les captures ne permettent pas de mesurer leurs courbes ou durées exactes. LOWKYZ conserve sa propre géométrie de filaments et son cobalt.

## Architecture

| Couche | Propriétaire | Travail |
| --- | --- | --- |
| HTML / CSS | `app/hero-system.css` | Grille, points, halo, filaments SVG, animation idle de 20 s ; toujours disponibles |
| Signaux discrets | `lib/field-signal.ts` | Technologie active, sans rendu React par frame |
| Événements DOM | `lib/motion-runtime.ts` | Un listener scroll, pointer et resize, puis un RAF partagé entre les abonnés ; arrêt onglet masqué et désabonnement complet |
| Chorégraphie | `components/system/motion-system.tsx` | Observer des reveals, parallax opt-in, curseur et attraction magnétique sur pointeur fin |
| Parcours du signal | `components/system/constellation.tsx` | Progression, direction, vitesse et morphing de chapitre ; mesure au resize et quand la taille d'une section change |
| WebGL optionnel | `lib/constellation-engine.ts` et `lib/field-shaders.ts` | Deux draw calls ; import différé en mode Explore sur appareil capable ; DPR plafonné, réduction adaptative, pause onglet et libération GPU |

Le moteur Three.js conserve sa propre boucle de rendu quand WebGL est actif. Le SVG reste le fallback immédiat, y compris lors d'un échec de shader ou d'une perte de contexte. Le mode Recruiter et les appareils à faible capacité gardent le fond SVG/CSS. Le scroll natif par roue, clavier et toucher reste libre ; seul le clic sur une ancre déclenche un trajet borné à 820 ms, annulable par geste utilisateur ou redimensionnement.

## Contrat des composants

- `.reveal` avec `data-reveal="mask" | "line" | "image"` : l'observer marque `data-revealed="false"` seulement pour un élément initialement hors écran. Le texte HTML reste présent, et l'opacité initiale ne descend pas sous 0,76 dans la couche commune.
- `data-motion-stagger` sur un conteneur `.reveal` : chaque enfant reçoit `--stagger-index` (0 à 12), puis un décalage de 60 ms ; les styles sont retirés au démontage.
- `data-motion-parallax="0.2"` et `.motion-parallax` : déplacement décoratif plafonné à 24 px, calculé uniquement pendant un scroll ou un resize. Le hero l'utilise sur sa grille technique.
- `.magnetic` : attraction de 8 × 6 px au maximum, seulement avec souris fine et mouvement actif. Les CTA du hero en font la démonstration ; le lien reste à sa place dans le flux et accessible au clavier.
- `[data-cursor="..."]` : libellé de curseur facultatif, caché sur tactile et dans les champs de saisie.

Les variantes non nécessaires à la lecture ne sont pas activées automatiquement sur chaque composant. Le projet GreeCheck démontre un reveal d'image et un stagger de preuves ; les en-têtes de chapitre utilisent les masques. Les repères de chapitre existants utilisent `position: sticky` sur desktop et retrouvent le flux normal sur mobile. Aucune section n'est épinglée par JavaScript.

## Durées et garde-fous

| Échelle | Token | Durée |
| --- | --- | --- |
| Micro | `--motion-micro` | 180 ms |
| Reveal | `--motion-reveal` | 680 ms |
| Editorial | `--motion-editorial` | 920 ms |
| Idle | `--motion-idle` | 20 s, alternance lente |

`prefers-reduced-motion: reduce` et la préférence LOWKYZ `data-motion="off"` annulent animation, transition, curseur et mise à jour décorative. Les ancres passent instantanément. Les valeurs de vitesse ne sont pas des mesures de performance du site. Les vérifications de laboratoire et les limites des appareils testés doivent être consignées avec le commit ; aucun chiffre de fluidité terrain n'est présumé.
