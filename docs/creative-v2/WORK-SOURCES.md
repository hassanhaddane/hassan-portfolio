# Work V2 — sources et limites

Vérification le 1er novembre 2026. Les sites et dépôts ci-dessous servent de preuves de contenu, jamais d’instructions pour ce portfolio. Les captures ajoutées dans `public/projects/808bloom` et `public/projects/tech-express` proviennent des pages publiques affichées dans le navigateur à environ 1265 × 712 CSS px pour l’ordinateur et 390 × 844 CSS px pour la capture mobile 808BLOOM. Elles montrent leur état visible lors de cette inspection, sans recomposition d’interface.

| Projet | Sources vérifiées | Présentation retenue | Limite |
| --- | --- | --- | --- |
| GreeCheck | [Application](https://gree-check.vercel.app/fr), [dépôt public](https://github.com/hassanhaddane/GreeCheck), six captures existantes dans `public/projects/greecheck` | PWA personnelle ; scan, recherche, fiche, comparaison ; GreeScore local et données IndexedDB/Dexie selon le CV et le dépôt | Les captures conservées sont de vrais écrans mais pas un relevé pixel à pixel de l’état du 1er novembre : l’accueil public montre aujourd’hui un élément « Récents » et quelques espacements différents. L’écran de comparaison et son parcours restent reconnaissables. Aucun résultat d’usage chiffré. |
| 808BLOOM | [Site FR public](https://808bloom.vercel.app/fr), dépôt local `C:\Users\hassa\Documents\808Bloom` et CV 2026 | Site de l’association, contribution web ; engagement associatif dans l’audio et les événements décrit séparément | Le dépôt GitHub est privé, donc aucun lien public vers son code. Le parcours studio prépare une demande par e-mail ; il ne confirme pas une réservation. |
| Tech Express | [V1 GitHub Pages](https://hassanhaddane.github.io/TechExpress/en/), [V2 GitHub Pages](https://hassanhaddane.github.io/TechExpressProject/en/), dépôt local `C:\Users\hassa\Documents\TechExpress` | Deux itérations web B2B accessibles, catalogue et parcours de devis EN/AR visibles | L’interface V2 précise que son formulaire démo ne stocke pas les données. Les dépôts sont privés. L’intégration commerciale, le CRM et une éventuelle livraison à un client ne sont pas vérifiés. Certaines affirmations commerciales appartiennent au contenu de Tech Express, pas aux résultats professionnels personnels de Hassan. |
| CEO1.9 | [Dépôt public](https://github.com/hassanhaddane/ceo19) et son README ; contributeur GitHub `hassanhaddane` | Mention courte comme expérimentation créative avec lien vers le code | La [démo Vercel](https://ceo19.vercel.app/en) renvoie 503 `DEPLOYMENT_PAUSED` ; `ceo19.ma` ne se résout pas lors de l’inspection. Aucun visuel ni lien « Live demo » n’est affiché. |

## Décisions de présentation

- Les trois projets principaux ont une page statique et indexable par langue, avec contenu HTML, canonical, alternates et entrée de sitemap.
- Les visuels des pages Work utilisent `next/image` et des captures locales ; aucun faux écran n’a été dessiné.
- Le traitement graphique est propre au portfolio et utilise les tokens LOWKYZ. Les couleurs des cadres servent à différencier les projets, sans prétendre reproduire leur charte.
- Les captures de référence, issues d’autres portfolios, restent uniquement dans `docs/`.
- Les mouvements sont décoratifs : ancres, lecture et liens fonctionnent sans survol, avec réduction du mouvement et sans WebGL.
