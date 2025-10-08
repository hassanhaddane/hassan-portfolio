# Portfolio Hassan Haddane - lowkyz.xyz

Portfolio personnel moderne et minimaliste présentant mes compétences, expériences et projets en tant que Développeur Full-Stack.

## 🎯 Objectif du projet

Ce portfolio a été conçu pour :
- Présenter mon profil professionnel de manière moderne et attractive
- Valoriser mon CV avec une expérience utilisateur optimale
- Démontrer ma maîtrise des technologies web modernes (2025)
- Faciliter la prise de contact avec les recruteurs et entreprises

## 🚀 Technologies utilisées

### Frontend
- **Next.js 15** - Framework React avec App Router pour des performances optimales
- **React 19** - Bibliothèque UI avec les dernières fonctionnalités
- **TypeScript** - Typage statique pour un code robuste et maintenable
- **Tailwind CSS v4** - Framework CSS utility-first pour un design moderne
- **Shadcn/ui** - Composants UI accessibles et personnalisables

### Outils de développement
- **ESLint** - Linting pour maintenir la qualité du code
- **Git** - Contrôle de version
- **Vercel** - Plateforme de déploiement optimisée pour Next.js

## 📋 Choix techniques justifiés

### Pourquoi Next.js 15 ?
- **Performance** : Server-Side Rendering (SSR) et Static Site Generation (SSG) pour un chargement ultra-rapide
- **SEO optimisé** : Rendu côté serveur pour un meilleur référencement
- **App Router** : Architecture moderne avec layouts imbriqués et loading states
- **Image Optimization** : Composant Image natif pour des performances optimales
- **Écosystème mature** : Large communauté et documentation complète

### Pourquoi TypeScript ?
- **Sécurité du code** : Détection des erreurs à la compilation
- **Autocomplétion** : Meilleure expérience développeur avec IntelliSense
- **Maintenabilité** : Code auto-documenté et refactoring facilité
- **Standard industrie** : Compétence recherchée en 2025

### Pourquoi Tailwind CSS v4 ?
- **Productivité** : Développement rapide avec classes utilitaires
- **Cohérence** : Design system intégré avec tokens de design
- **Performance** : CSS optimisé et tree-shaking automatique
- **Responsive** : Mobile-first avec breakpoints intuitifs
- **Dark mode** : Support natif du mode sombre

### Pourquoi Shadcn/ui ?
- **Accessibilité** : Composants conformes WCAG avec ARIA
- **Personnalisable** : Code source accessible et modifiable
- **Moderne** : Design minimaliste et professionnel
- **Pas de dépendance** : Composants copiés dans le projet (ownership total)

## 🎨 Design System

### Palette de couleurs "Dev Geek"
Le design adopte une esthétique minimaliste inspirée des IDE modernes et des terminaux :

- **Background** : `#0a0a0a` - Noir profond pour réduire la fatigue oculaire
- **Foreground** : `#ededed` - Blanc cassé pour un contraste optimal
- **Primary** : `#00ff9f` - Cyan néon pour les accents principaux
- **Secondary** : `#ff006e` - Rose néon pour les accents secondaires
- **Muted** : `#1a1a1a` - Gris foncé pour les backgrounds secondaires

### Typographie
- **Font principale** : Geist Sans - Police moderne et lisible
- **Font monospace** : Geist Mono - Pour le code et les accents techniques
- **Hiérarchie claire** : Tailles et poids cohérents pour une lecture optimale

### Principes de design
- **Minimalisme** : Interfaces épurées sans éléments superflus
- **Contraste élevé** : Lisibilité optimale sur fond sombre
- **Espacement généreux** : Respiration visuelle pour une meilleure UX
- **Animations subtiles** : Micro-interactions pour enrichir l'expérience

## 📁 Structure du projet

\`\`\`
portfolio/
├── app/                      # App Router Next.js
│   ├── layout.tsx           # Layout principal avec fonts
│   ├── page.tsx             # Page d'accueil (toutes les sections)
│   └── globals.css          # Styles globaux et design tokens
├── components/              # Composants React
│   ├── ui/                  # Composants Shadcn/ui
│   ├── navigation.tsx       # Navigation sticky avec scroll
│   ├── hero-section.tsx     # Section présentation
│   ├── about-section.tsx    # Section à propos
│   ├── projects-section.tsx # Section projets
│   ├── skills-section.tsx   # Section compétences
│   ├── experience-section.tsx # Section expériences
│   ├── education-section.tsx  # Section formation
│   ├── contact-section.tsx    # Section contact
│   └── footer.tsx           # Footer
├── lib/                     # Utilitaires
│   └── utils.ts            # Fonctions helpers (cn, etc.)
├── public/                  # Assets statiques
│   └── cv-hassan-haddane.pdf # CV téléchargeable
└── README.md               # Documentation du projet
\`\`\`

## 🏗️ Architecture

### Single Page Application (SPA)
Le portfolio est une page unique avec plusieurs sections :
- Navigation fluide avec scroll automatique
- Effet de "plusieurs pages" grâce au scroll
- Performance optimale (pas de rechargement)
- Expérience utilisateur moderne

### Composants modulaires
Chaque section est un composant indépendant :
- **Réutilisabilité** : Composants isolés et testables
- **Maintenabilité** : Modifications localisées
- **Performance** : Lazy loading possible si nécessaire
- **Lisibilité** : Code organisé et documenté

### Gestion du state
- **Client Components** : Pour les interactions (navigation, formulaires)
- **Server Components** : Pour le contenu statique (par défaut)
- **Pas de state management** : Application simple sans Redux/Zustand

## 🎯 Fonctionnalités

### Navigation
- Menu sticky qui suit le scroll
- Indicateur de section active
- Scroll smooth vers les sections
- Responsive avec menu mobile

### Section Hero
- Présentation avec nom et titre
- Badge de disponibilité (Recherche CDI)
- Boutons d'action (CV, Contact)
- Liens sociaux (LinkedIn, GitHub)
- Carte d'informations avec langues et centres d'intérêt

### Section À propos
- Valeurs professionnelles avec icônes
- Approche et philosophie de travail
- Situation actuelle et stack favorite
- Design en grille responsive

### Section Projets
- Showcase des projets principaux
- Cartes avec images, descriptions et technologies
- Liens vers démos et repositories
- Filtrage par technologie (optionnel)

### Section Compétences
- Catégorisation (Front-End, Back-End, Outils)
- Badges visuels pour chaque technologie
- Niveaux de maîtrise
- Design en grille responsive

### Section Expérience
- Timeline verticale avec points
- Cartes détaillées par expérience
- Réalisations et technologies utilisées
- Indicateur "En cours" pour l'alternance actuelle
- Résumé statistique du parcours

### Section Formation
- Parcours académique complet
- Diplômes avec spécialisations
- Certifications (si applicable)
- Design cohérent avec la section expérience

### Section Contact
- Formulaire de contact fonctionnel
- Informations de contact directes
- Liens sociaux
- Design accessible et responsive

### Footer
- Copyright et mentions légales
- Liens rapides vers sections
- Liens sociaux
- Design minimaliste

## 🔧 Installation et développement

### Prérequis
- Node.js 18+ 
- npm ou yarn ou pnpm

### Installation
\`\`\`bash
# Cloner le repository
git clone https://github.com/hassanhaddane/portfolio.git

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
\`\`\`

Le site sera accessible sur `http://localhost:3000`

### Scripts disponibles
\`\`\`bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run start    # Serveur de production
npm run lint     # Linting du code
\`\`\`

## 🚀 Déploiement

### Vercel (recommandé)
1. Connecter le repository GitHub à Vercel
2. Configurer le domaine personnalisé (lowkyz.xyz)
3. Déploiement automatique à chaque push

### Variables d'environnement
Aucune variable d'environnement requise pour ce projet.

## 📱 Responsive Design

Le portfolio est entièrement responsive avec 3 breakpoints principaux :
- **Mobile** : < 768px
- **Tablet** : 768px - 1024px
- **Desktop** : > 1024px

Toutes les sections s'adaptent automatiquement à la taille de l'écran.

## ♿ Accessibilité

Le portfolio respecte les standards WCAG 2.1 niveau AA :
- Contraste de couleurs suffisant (> 4.5:1)
- Navigation au clavier complète
- Attributs ARIA sur les composants interactifs
- Textes alternatifs sur les images
- Structure sémantique HTML5

## 🎨 Personnalisation

### Modifier les couleurs
Éditer `app/globals.css` dans la section `@theme inline` :
\`\`\`css
@theme inline {
  --color-primary: #00ff9f;
  --color-secondary: #ff006e;
  /* ... autres couleurs */
}
\`\`\`

### Modifier les fonts
Éditer `app/layout.tsx` pour changer les polices Google Fonts.

### Ajouter du contenu
Chaque section est dans un fichier séparé dans `components/`. Modifier le contenu directement dans les composants.

## 📄 Licence

Ce projet est sous licence MIT. Vous êtes libre de l'utiliser comme template pour votre propre portfolio.

## 👤 Auteur

**Hassan Haddane**
- Portfolio : [lowkyz.xyz](https://lowkyz.xyz)
- LinkedIn : [/hassanhaddane](https://linkedin.com/in/hassanhaddane)
- GitHub : [/hassanhaddane](https://github.com/hassanhaddane)
- Email : hassanhaddane33s@gmail.com

## 🙏 Remerciements

- [Next.js](https://nextjs.org/) pour le framework
- [Shadcn/ui](https://ui.shadcn.com/) pour les composants
- [Tailwind CSS](https://tailwindcss.com/) pour le styling
- [Lucide](https://lucide.dev/) pour les icônes
- [Vercel](https://vercel.com/) pour l'hébergement

---

**Note** : Ce portfolio a été développé en 2025 avec les dernières technologies web pour démontrer ma maîtrise des standards modernes du développement front-end.
