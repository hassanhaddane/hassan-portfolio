# LOWKYZ — séquence cinématique

## Référence observée le 31 octobre 2026

[Overworld Audio](https://overworldaudio.com/) était accessible dans le navigateur. À l'ouverture, j'ai vu un fond bleu nuit granuleux, une identité centrée très discrète et un état de chargement avec barre et pourcentage. Une fois cet état terminé, deux actions étaient visibles : « Enter with sound » et « Enter without sound ». Après activation de la seconde, l'écran d'entrée s'est retiré et a révélé une scène immersive, la navigation et un contrôle « SOUND OFF/ON ». Après actualisation, le chargement puis les choix d'entrée sont réapparus. Le bouton avait une transition de couleur déclarée à 0,3 s.

Ces captures et l'arbre accessible ne permettent pas d'établir les durées exactes des étapes internes, la courbe de la caméra, la méthode du shader, la logique du pourcentage, la réaction au pointeur ou la nature de l'audio. Aucun de leurs assets, logos, shaders ou code n'est repris.

## Contrat LOWKYZ

| État | Début prévu | Visuel | Sortie |
| --- | --- | --- | --- |
| Blackout | Immédiat | Obsidienne, grain très discret, point cobalt | 170 ms |
| Initialization | 170 ms | Tracé du mot et signal en cours de construction, sans pourcentage | 620 ms |
| Identity reveal | 620 ms | Outline, lettres et points recomposés ; réaction discrète au pointeur ou au toucher | 1 200 ms |
| Choice | 1 200 ms | Entrer avec ou sans son ; Skip reste visible | Décision du visiteur |
| Transition | Après l'entrée | Fragmentation des lettres, lignes et points en trame cobalt, révélation du hero existant | 900 ms |

Les valeurs sont les durées **de LOWKYZ**, pas des mesures de la référence. Elles sont définies dans `components/intro/intro-context.tsx` et le mouvement visuel dans `app/intro-system.css`. L'indicateur décrit uniquement l'initialisation graphique ; aucune barre ni métrique de chargement fictive n'est affichée.

Le son est désactivé par défaut. « Avec le son » ou le contrôle persistant crée, après le geste explicite, deux sinusoïdes filtrées à faible gain via Web Audio ; aucun média externe n'est téléchargé. « Sans le son » conserve le silence. Le contrôle du header permet de couper et réactiver le son. L'onglet caché suspend l'audio et les étapes temporisées ; le retour affiche immédiatement le choix. Tous les oscillateurs et le contexte sont fermés au démontage.

La visite est mémorisée dans `sessionStorage` seulement après l'entrée ou Skip. Une actualisation, un retour ou un changement FR/EN dans la même session ouvrent directement le portfolio. « Rejouer l’intro » est la seule relance volontaire. Un lien profond, une préférence de mouvement désactivé, `prefers-reduced-motion`, `saveData` ou l'absence de JavaScript laissent le portfolio lisible sans overlay. Le défilement n'est jamais verrouillé ; défiler ou presser Échap ferme l'intro. L'intro repose sur DOM/SVG/CSS et reste indépendante de WebGL. La trame rejoint visuellement le filament Three.js déjà présent dans le hero, qui conserve son fallback.

## Validation locale

Le build isolé de l'index Git passe `pnpm typecheck`, `pnpm lint`, `pnpm test` et `pnpm build`. La revue navigateur sur ce build confirme la première visite, l'entrée silencieuse, l'entrée sonore après clic, mute/unmute, Skip au clavier avec retour du focus au hero, replay après retour navigateur, refresh sans relance, passage FR/EN sans relance, et affichage mobile à 390 px sans débordement horizontal. La préférence « Reduce motion » désactive l'intro. Le contenu professionnel et les liens sont présents dans le HTML initial sous l'overlay ; aucune erreur console n'a été relevée pendant ces parcours.

Le navigateur de revue n'a pas exposé d'émulation de `prefers-reduced-motion`, de `saveData` ni de WebGL indisponible. Le test de changement d'onglet n'y a pas passé `document.hidden` à `true`. Ces branches ont été vérifiées dans le code, sans prétendre à une validation visuelle de ces environnements. Le fallback ne dépend pas de WebGL : la séquence utilise DOM, SVG et CSS, et tous ses timers, événements et animations demandées sont nettoyés au démontage.
