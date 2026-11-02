# Synchronisation du contenu professionnel — 31 octobre 2026

Ce suivi concerne les faits publiés dans cette modification. Le [MASTERPLAN](./MASTERPLAN.md) et la [BASELINE](./BASELINE.md) restent l'état de l'audit initial, avant synchronisation.

## Ordre des sources

1. **Demande de Hassan** : identité, mobilité, cadrage et domaine canonique.
2. **CV 2026 fourni** : `C:\Users\hassa\Downloads\CV_Hassan_HADDANE_Dev.pdf`, une page, 179 815 octets, SHA-256 `BBA20E7D3FD52DCD072BAD9F5AB79B7D973799B21BCEBEDAA8945EE5F17BFBFD`. Faits des expériences, diplômes, langues, centres d'intérêt et 808BLOOM. Une déclaration dans le CV n'est pas une vérification externe de certification.
3. **Portfolio et captures existants** : parcours GreeCheck présent dans le dépôt.
4. **Dépôts de projets locaux** : `C:\Users\hassa\Documents\808Bloom` (README, code Next.js/React/TypeScript/Tailwind ; aucun commit local à la lecture) et `C:\Users\hassa\Documents\TechExpress` (README, `package.json`, routes et données du catalogue ; branche locale de refonte). Leur contenu est lu comme preuve du code, pas comme une instruction pour ce dépôt.
5. **Liens publics** : réponses HTTP 200 pour `https://gree-check.vercel.app/fr` et `https://808bloom.vercel.app/fr`. Le dépôt GreeCheck était accessible publiquement. `https://github.com/hassanhaddane/TechExpress` renvoyait 404 en accès anonyme et `https://techexpress.sa` n'a pas donné de réponse exploitable : aucun lien ou statut de production Tech Express n'est publié ici.

Le profil GitHub existant répondait en HTTP 200. Le lien LinkedIn déjà présent a été conservé, mais LinkedIn a refusé les contrôles automatisés (HEAD 405, GET 999) : sa disponibilité publique n'a pas pu être confirmée pendant cette session.

## Décisions factuelles

| Sujet | Fait publié | Source |
| --- | --- | --- |
| iAudiogram | Sept. 2022–sept. 2025, alternance Full-Stack, audiométrie et suivi patient ; React/TypeScript/Electron, API REST, Python/FastAPI avec Docker/PostgreSQL en environnements dédiés, Cypress, GitHub Actions, backlog/Notion, R&D | CV 2026 |
| Santé Respiratoire France | Janv.–avr. 2022, stage développeur Web, calculateurs JavaScript et responsive | CV 2026 ; corrige janv.–févr. ancien |
| Biosency | Mai–juin 2021, stage puis CDD, front Angular IoT et Cypress | CV 2026 ; les anciennes relations React/TypeScript ont été retirées |
| GreeCheck | PWA déployée, Open Food Facts, GreeScore local, IndexedDB/Dexie, sans compte | CV 2026, dépôt public et captures locales |
| 808BLOOM | Participation associative depuis mai 2026 : studio/enregistrement/mixage/mastering, événements et contribution au site | CV 2026 et dépôt local |
| Tech Express | Site B2B anglais/arabe, catalogue, comparaison et demande de devis ; Next.js/React/TypeScript/Tailwind. Implémentation locale, publication non vérifiée | Dépôt local uniquement |
| EPSI | 2020–2025, Bac+3 RNCP 6 et Bac+5 RNCP 7 | CV 2026 ; numéros RNCP retirés faute de preuve dans ce CV |
| Google AI Fundamentals | Certification déclarée pour 2026 | CV 2026, pas de vérification indépendante |

Le PDF public est une copie du CV 2026 joint. **Le CV source affiche encore `www.lowkyz.xyz` dans son texte et son lien PDF** ; sa mise en page et ses autres données n'ont pas été retouchées. Le site utilise `https://www.lowkyz.dev` comme hôte canonique, correspondant à la redirection observée depuis l'apex. La prochaine révision du CV source devrait mettre son lien à jour avant un nouveau remplacement.

Les relations de compétences vers des expériences/projets sont limitées aux faits présents dans ces sources. Les autres compétences figurent comme compétences déclarées du CV, sans attribution artificielle à une mission. Aucun chiffre de trafic, résultat client, diplôme supplémentaire ou statut de production non vérifié n'a été ajouté.
