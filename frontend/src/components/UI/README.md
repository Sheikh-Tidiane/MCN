# Animations de Chargement - Musée des Civilisations Noires

## Vue d'ensemble

Ce système d'animations de chargement a été spécialement conçu pour le Musée des Civilisations Noires, avec des motifs et couleurs inspirés de l'art africain traditionnel.

## Composants Disponibles

### 1. LoadingSpinner
Composant principal pour les animations de chargement avec plusieurs variantes.

```jsx
import LoadingSpinner from './components/UI/LoadingSpinner';

<LoadingSpinner
  variant="museum"        // 'museum', 'pulse', 'wave', 'dots'
  size="large"           // 'small', 'medium', 'large', 'xl'
  text="Chargement..."   // Message personnalisé
  showText={true}       // Afficher le texte
/>
```

**Variantes disponibles :**
- `museum` : Animation inspirée de l'art africain avec gradients dorés
- `pulse` : Effet de pulsation élégant
- `wave` : Animation en vagues fluides
- `dots` : Points dansants avec rythme africain

### 2. PageLoader
Loader de page complet avec arrière-plan et particules.

```jsx
import PageLoader from './components/UI/PageLoader';

<PageLoader
  isLoading={true}
  message="Chargement des œuvres..."
  variant="museum"
  showProgress={true}
  showParticles={true}
/>
```

### 3. LoadingOverlay
Overlay de chargement pour les composants individuels.

```jsx
import LoadingOverlay from './components/UI/LoadingOverlay';

<LoadingOverlay
  isLoading={isLoading}
  message="Chargement..."
  variant="museum"
  size="medium"
  overlay={true}
/>
```

## Hooks Disponibles

### useLoading
Hook pour gérer les états de chargement simples.

```jsx
import { useLoading } from '../hooks/useLoading';

const { isLoading, startLoading, stopLoading, withLoading } = useLoading();

// Utilisation
startLoading();
// ... opération asynchrone
stopLoading();

// Ou avec une fonction asynchrone
await withLoading(async () => {
  // Votre code asynchrone
});
```

### useGlobalLoading
Hook pour le chargement global de l'application.

```jsx
import { useGlobalLoading } from '../hooks/useLoading';

const { globalLoading, loadingMessage, showGlobalLoading, hideGlobalLoading } = useGlobalLoading();

showGlobalLoading('Chargement des données...');
// ... opération
hideGlobalLoading();
```

### usePageLoading
Hook pour le chargement des pages avec progression.

```jsx
import { usePageLoading } from '../hooks/useLoading';

const { pageLoading, loadingProgress, startPageLoading, updateProgress, completePageLoading } = usePageLoading();

startPageLoading();
updateProgress(50);
updateProgress(100);
completePageLoading();
```

## Styles CSS

Le système inclut des animations CSS personnalisées :

```css
/* Classes utilitaires */
.animate-museum-spin     /* Rotation avec effet de couleur */
.animate-museum-pulse    /* Pulsation douce */
.animate-museum-wave     /* Animation en vagues */
.animate-museum-glow     /* Effet de lueur */
.animate-museum-dots     /* Points dansants */
.animate-museum-fade-in  /* Apparition en fondu */
.animate-museum-slide-in /* Glissement depuis la gauche */
```

## Couleurs du Thème

Les animations utilisent la palette de couleurs du musée :

```css
:root {
  --museum-primary: #2C3E50;      /* Bleu profond africain */
  --museum-secondary: #E67E22;     /* Orange terre d'Afrique */
  --museum-accent: #F39C12;        /* Or africain */
  --museum-earth: #8B4513;         /* Terre cuite */
  --museum-gold: #D4AF37;          /* Or traditionnel */
  --museum-bronze: #CD7F32;        /* Bronze africain */
}
```

## Exemples d'Utilisation

### Chargement d'images
```jsx
const [isLoadingImages, setIsLoadingImages] = useState(true);

useEffect(() => {
  const loadImages = async () => {
    startLoading();
    await Promise.all(imagePromises);
    setTimeout(() => {
      setIsLoadingImages(false);
      stopLoading();
    }, 2000);
  };
  loadImages();
}, []);

return (
  <>
    <LoadingOverlay
      isLoading={isLoadingImages}
      message="Chargement des œuvres..."
      variant="museum"
    />
    {/* Votre contenu */}
  </>
);
```

### Chargement de données API
```jsx
const fetchData = async () => {
  showGlobalLoading('Chargement des collections...');
  try {
    const data = await api.getCollections();
    return data;
  } finally {
    hideGlobalLoading();
  }
};
```

## Page de Démonstration

Visitez `/loading-demo` pour voir toutes les animations en action et tester les différentes variantes.

## Personnalisation

### Créer une nouvelle variante
```jsx
const customVariants = {
  custom: {
    animate: {
      rotate: [0, 360],
      scale: [1, 1.2, 1],
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};
```

### Couleurs personnalisées
```jsx
<LoadingSpinner
  variant="museum"
  style={{
    '--primary-color': '#your-color',
    '--secondary-color': '#your-color'
  }}
/>
```

## Performance

- Utilise Framer Motion pour des animations fluides
- Optimisé pour les appareils mobiles
- Lazy loading des composants
- Animations CSS pour les effets simples

## Accessibilité

- Support des préférences de mouvement réduit
- Contraste élevé pour la lisibilité
- Messages de chargement descriptifs
- Support des lecteurs d'écran
