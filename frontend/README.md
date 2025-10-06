# Musée des Civilisations Noires - Frontend

Application React moderne pour le Musée des Civilisations Noires de Dakar, développée avec Vite et Tailwind CSS.

## 🎯 Fonctionnalités

### ✅ Fonctionnalités Principales (Cahier des Charges)
- **🔍 Scan QR Code** : Scanner les œuvres via QR Code → redirection vers fiche descriptive complète
- **🌍 Multilingue** : Descriptions en Français, Anglais et Wolof
- **📱 Consultation à distance** : Accès aux œuvres depuis PC et mobile
- **🎧 Audio inclusif** : Guide audio pour expérience accessible
- **📚 Informations historiques** : Contexte historique et culturel complet
- **🌐 Expérience digitale** : Navigation fluide même hors du musée

### 🚀 Fonctionnalités Techniques
- **⚡ Vite + React** : Performance optimale avec hot reload ultra-rapide
- **🎨 Design Louvre.fr** : Interface élégante inspirée du Louvre
- **📱 Ultra-responsive** : Mobile-first design adaptatif
- **🎭 Animations** : Transitions fluides avec Framer Motion
- **🔧 Architecture moderne** : Hooks personnalisés, services API, composants modulaires
- **🌐 i18n** : Internationalisation complète
- **📊 State Management** : React Query pour la gestion des données
- **🎵 Media Players** : Lecteurs audio et vidéo intégrés

## 🛠️ Technologies

### Core
- **React 18** - Bibliothèque UI
- **Vite** - Build tool ultra-rapide
- **React Router** - Navigation
- **Tailwind CSS** - Framework CSS

### UI/UX
- **Framer Motion** - Animations
- **Lucide React** - Icônes
- **React Hot Toast** - Notifications
- **React Helmet Async** - SEO

### Data & State
- **React Query** - Gestion des données
- **Axios** - Client HTTP
- **React Hook Form** - Formulaires

### Internationalisation
- **i18next** - Internationalisation
- **react-i18next** - Intégration React

### QR Code
- **jsQR** - Détection QR Code
- **MediaDevices API** - Accès caméra

## 📁 Structure du Projet

```
src/
├── components/
│   ├── Layout/           # Header, Footer
│   ├── Oeuvre/           # Composants œuvres
│   └── QRScanner/        # Scanner QR Code
├── pages/               # Pages de l'application
├── hooks/               # Hooks personnalisés
├── services/            # Services API
├── i18n/                # Traductions
│   └── locales/         # Fichiers de langue
├── config/              # Configuration
└── styles/              # Styles globaux
```

## 🚀 Installation

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation
```bash
# Cloner le projet
git clone [repository-url]
cd frontend

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

### Scripts Disponibles
```bash
npm run dev      # Serveur de développement (http://localhost:3000)
npm run build    # Build de production
npm run preview   # Aperçu du build
npm run lint     # Linting ESLint
```

## 🌐 Configuration

### Variables d'Environnement
Créer un fichier `.env.local` :
```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_APP_NAME=Musée des Civilisations Noires
VITE_APP_VERSION=1.0.0
```

### API Backend
L'application communique avec l'API Laravel backend :
- **Base URL** : `http://localhost:8000/api/v1`
- **Endpoints** : `/oeuvres`, `/scan/{qrCode}`, `/medias/{id}`
- **Authentification** : Bearer Token (Sanctum)

## 🎨 Design System

### Couleurs
- **Primary** : `#8B4513` (Museum Brown)
- **Secondary** : `#D2691E` (Museum Orange)
- **Accent** : `#CD853F` (Museum Gold)
- **Louvre Gold** : `#D4AF37`

### Typographie
- **Serif** : Playfair Display (Titres)
- **Sans** : Inter (Corps de texte)
- **Display** : Cinzel (Titres spéciaux)

### Animations
- **Fade In** : `fadeIn 0.5s ease-in-out`
- **Slide Up** : `slideUp 0.5s ease-out`
- **Scale In** : `scaleIn 0.3s ease-out`
- **Float** : `float 3s ease-in-out infinite`

## 📱 Responsive Design

### Breakpoints
- **Mobile** : < 640px
- **Tablet** : 640px - 1024px
- **Desktop** : > 1024px
- **Large** : > 1600px

### Adaptations
- **Mobile** : Navigation hamburger, layout vertical
- **Tablet** : Grid adaptatif, navigation horizontale
- **Desktop** : Layout complet, sidebar navigation

## 🔧 Développement

### Hooks Personnalisés
- `useDeviceType()` - Détection du type d'appareil
- `useLanguage()` - Gestion des langues
- `useQRScanner()` - Scanner QR Code

### Services API
- `oeuvreService` - Gestion des œuvres
- `billetService` - Système de billets
- `shopService` - E-commerce
- `commandeService` - Commandes

### Composants Principaux
- `Header` - Navigation responsive
- `Footer` - Pied de page
- `QRScanner` - Scanner QR Code
- `OeuvreDetail` - Détail d'œuvre complet
- `Collections` - Galerie d'œuvres

## 🌍 Internationalisation

### Langues Supportées
- **Français** (fr) - Langue par défaut
- **Anglais** (en) - English
- **Wolof** (wo) - Langue locale

### Traductions
Les traductions sont dans `src/i18n/locales/` :
- `fr.json` - Français
- `en.json` - Anglais
- `wo.json` - Wolof

## 🎵 Fonctionnalités Media

### Audio
- Lecteur audio intégré
- Contrôles : play/pause, volume, progression
- Support des formats : MP3, WAV, OGG

### Vidéo
- Lecteur vidéo HTML5
- Contrôles natifs
- Support des formats : MP4, WebM, OGG

### Images
- Galerie d'images
- Zoom et navigation
- Lazy loading

## 🔍 QR Code Scanner

### Fonctionnalités
- Accès caméra natif
- Détection QR Code en temps réel
- Redirection automatique vers l'œuvre
- Gestion des erreurs

### Utilisation
```jsx
import QRScanner from './components/QRScanner/QRScanner';

<QRScanner
  onClose={() => setShowScanner(false)}
  onScanSuccess={(artwork) => navigate(`/oeuvre/${artwork.id}`)}
/>
```

## 📊 Performance

### Optimisations
- **Code Splitting** : Chargement à la demande
- **Lazy Loading** : Images et composants
- **Caching** : React Query pour les données
- **Bundle Size** : Optimisation Vite

### Métriques
- **First Contentful Paint** : < 1.5s
- **Largest Contentful Paint** : < 2.5s
- **Cumulative Layout Shift** : < 0.1

## 🧪 Tests

### Tests Unitaires
```bash
npm run test
```

### Tests E2E
```bash
npm run test:e2e
```

## 🚀 Déploiement

### Build de Production
```bash
npm run build
```

### Variables d'Environnement Production
```env
VITE_API_URL=https://api.mcn.sn/v1
VITE_APP_NAME=Musée des Civilisations Noires
VITE_APP_VERSION=1.0.0
```

### Serveurs Recommandés
- **Vercel** - Déploiement automatique
- **Netlify** - CDN global
- **AWS S3 + CloudFront** - Scalabilité

## 📝 Changelog

### v1.0.0 (2024-10-04)
- ✅ Implémentation complète du cahier des charges
- ✅ Scanner QR Code fonctionnel
- ✅ Interface multilingue (FR/EN/WO)
- ✅ Lecteurs audio/vidéo intégrés
- ✅ Design responsive inspiré du Louvre
- ✅ Architecture moderne avec Vite + React

## 🤝 Contribution

### Guidelines
1. Fork le projet
2. Créer une branche feature
3. Commiter les changements
4. Push vers la branche
5. Ouvrir une Pull Request

### Standards
- **ESLint** : Code quality
- **Prettier** : Code formatting
- **Conventional Commits** : Messages de commit

## 📄 Licence

Ce projet est développé pour le Musée des Civilisations Noires dans le cadre du Dakar Slush'D Hackathon 2025.

## 📞 Support

- **Email** : contact@mcn.sn
- **Téléphone** : +221 33 825 98 22
- **Adresse** : Avenue Cheikh Anta Diop, Dakar, Sénégal

---

**Développé avec ❤️ pour le Musée des Civilisations Noires**
Application React moderne pour le Musée des Civilisations Noires de Dakar, développée avec Vite et Tailwind CSS.

## 🎯 Fonctionnalités

### ✅ Fonctionnalités Principales (Cahier des Charges)
- **🔍 Scan QR Code** : Scanner les œuvres via QR Code → redirection vers fiche descriptive complète
- **🌍 Multilingue** : Descriptions en Français, Anglais et Wolof
- **📱 Consultation à distance** : Accès aux œuvres depuis PC et mobile
- **🎧 Audio inclusif** : Guide audio pour expérience accessible
- **📚 Informations historiques** : Contexte historique et culturel complet
- **🌐 Expérience digitale** : Navigation fluide même hors du musée

### 🚀 Fonctionnalités Techniques
- **⚡ Vite + React** : Performance optimale avec hot reload ultra-rapide
- **🎨 Design Louvre.fr** : Interface élégante inspirée du Louvre
- **📱 Ultra-responsive** : Mobile-first design adaptatif
- **🎭 Animations** : Transitions fluides avec Framer Motion
- **🔧 Architecture moderne** : Hooks personnalisés, services API, composants modulaires
- **🌐 i18n** : Internationalisation complète
- **📊 State Management** : React Query pour la gestion des données
- **🎵 Media Players** : Lecteurs audio et vidéo intégrés

## 🛠️ Technologies

### Core
- **React 18** - Bibliothèque UI
- **Vite** - Build tool ultra-rapide
- **React Router** - Navigation
- **Tailwind CSS** - Framework CSS

### UI/UX
- **Framer Motion** - Animations
- **Lucide React** - Icônes
- **React Hot Toast** - Notifications
- **React Helmet Async** - SEO

### Data & State
- **React Query** - Gestion des données
- **Axios** - Client HTTP
- **React Hook Form** - Formulaires

### Internationalisation
- **i18next** - Internationalisation
- **react-i18next** - Intégration React

### QR Code
- **jsQR** - Détection QR Code
- **MediaDevices API** - Accès caméra

## 📁 Structure du Projet

```
src/
├── components/
│   ├── Layout/           # Header, Footer
│   ├── Oeuvre/           # Composants œuvres
│   └── QRScanner/        # Scanner QR Code
├── pages/               # Pages de l'application
├── hooks/               # Hooks personnalisés
├── services/            # Services API
├── i18n/                # Traductions
│   └── locales/         # Fichiers de langue
├── config/              # Configuration
└── styles/              # Styles globaux
```

## 🚀 Installation

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation
```bash
# Cloner le projet
git clone [repository-url]
cd frontend

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

### Scripts Disponibles
```bash
npm run dev      # Serveur de développement (http://localhost:3000)
npm run build    # Build de production
npm run preview   # Aperçu du build
npm run lint     # Linting ESLint
```

## 🌐 Configuration

### Variables d'Environnement
Créer un fichier `.env.local` :
```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_APP_NAME=Musée des Civilisations Noires
VITE_APP_VERSION=1.0.0
```

### API Backend
L'application communique avec l'API Laravel backend :
- **Base URL** : `http://localhost:8000/api/v1`
- **Endpoints** : `/oeuvres`, `/scan/{qrCode}`, `/medias/{id}`
- **Authentification** : Bearer Token (Sanctum)

## 🎨 Design System

### Couleurs
- **Primary** : `#8B4513` (Museum Brown)
- **Secondary** : `#D2691E` (Museum Orange)
- **Accent** : `#CD853F` (Museum Gold)
- **Louvre Gold** : `#D4AF37`

### Typographie
- **Serif** : Playfair Display (Titres)
- **Sans** : Inter (Corps de texte)
- **Display** : Cinzel (Titres spéciaux)

### Animations
- **Fade In** : `fadeIn 0.5s ease-in-out`
- **Slide Up** : `slideUp 0.5s ease-out`
- **Scale In** : `scaleIn 0.3s ease-out`
- **Float** : `float 3s ease-in-out infinite`

## 📱 Responsive Design

### Breakpoints
- **Mobile** : < 640px
- **Tablet** : 640px - 1024px
- **Desktop** : > 1024px
- **Large** : > 1600px

### Adaptations
- **Mobile** : Navigation hamburger, layout vertical
- **Tablet** : Grid adaptatif, navigation horizontale
- **Desktop** : Layout complet, sidebar navigation

## 🔧 Développement

### Hooks Personnalisés
- `useDeviceType()` - Détection du type d'appareil
- `useLanguage()` - Gestion des langues
- `useQRScanner()` - Scanner QR Code

### Services API
- `oeuvreService` - Gestion des œuvres
- `billetService` - Système de billets
- `shopService` - E-commerce
- `commandeService` - Commandes

### Composants Principaux
- `Header` - Navigation responsive
- `Footer` - Pied de page
- `QRScanner` - Scanner QR Code
- `OeuvreDetail` - Détail d'œuvre complet
- `Collections` - Galerie d'œuvres

## 🌍 Internationalisation

### Langues Supportées
- **Français** (fr) - Langue par défaut
- **Anglais** (en) - English
- **Wolof** (wo) - Langue locale

### Traductions
Les traductions sont dans `src/i18n/locales/` :
- `fr.json` - Français
- `en.json` - Anglais
- `wo.json` - Wolof

## 🎵 Fonctionnalités Media

### Audio
- Lecteur audio intégré
- Contrôles : play/pause, volume, progression
- Support des formats : MP3, WAV, OGG

### Vidéo
- Lecteur vidéo HTML5
- Contrôles natifs
- Support des formats : MP4, WebM, OGG

### Images
- Galerie d'images
- Zoom et navigation
- Lazy loading

## 🔍 QR Code Scanner

### Fonctionnalités
- Accès caméra natif
- Détection QR Code en temps réel
- Redirection automatique vers l'œuvre
- Gestion des erreurs

### Utilisation
```jsx
import QRScanner from './components/QRScanner/QRScanner';

<QRScanner
  onClose={() => setShowScanner(false)}
  onScanSuccess={(artwork) => navigate(`/oeuvre/${artwork.id}`)}
/>
```

## 📊 Performance

### Optimisations
- **Code Splitting** : Chargement à la demande
- **Lazy Loading** : Images et composants
- **Caching** : React Query pour les données
- **Bundle Size** : Optimisation Vite

### Métriques
- **First Contentful Paint** : < 1.5s
- **Largest Contentful Paint** : < 2.5s
- **Cumulative Layout Shift** : < 0.1

## 🧪 Tests

### Tests Unitaires
```bash
npm run test
```

### Tests E2E
```bash
npm run test:e2e
```

## 🚀 Déploiement

### Build de Production
```bash
npm run build
```

### Variables d'Environnement Production
```env
VITE_API_URL=https://api.mcn.sn/v1
VITE_APP_NAME=Musée des Civilisations Noires
VITE_APP_VERSION=1.0.0
```

### Serveurs Recommandés
- **Vercel** - Déploiement automatique
- **Netlify** - CDN global
- **AWS S3 + CloudFront** - Scalabilité

## 📝 Changelog

### v1.0.0 (2024-10-04)
- ✅ Implémentation complète du cahier des charges
- ✅ Scanner QR Code fonctionnel
- ✅ Interface multilingue (FR/EN/WO)
- ✅ Lecteurs audio/vidéo intégrés
- ✅ Design responsive inspiré du Louvre
- ✅ Architecture moderne avec Vite + React

## 🤝 Contribution

### Guidelines
1. Fork le projet
2. Créer une branche feature
3. Commiter les changements
4. Push vers la branche
5. Ouvrir une Pull Request

### Standards
- **ESLint** : Code quality
- **Prettier** : Code formatting
- **Conventional Commits** : Messages de commit

## 📄 Licence

Ce projet est développé pour le Musée des Civilisations Noires dans le cadre du Dakar Slush'D Hackathon 2025.

## 📞 Support

- **Email** : contact@mcn.sn
- **Téléphone** : +221 33 825 98 22
- **Adresse** : Avenue Cheikh Anta Diop, Dakar, Sénégal

---

**Développé avec ❤️ pour le Musée des Civilisations Noires**





