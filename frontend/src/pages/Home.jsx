import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, QrCode, Play, Pause } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDeviceType } from '../hooks/useDeviceType';
import { useLoading } from '../hooks/useLoading';
import Logo from '../components/UI/Logo';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import { useVisitorId } from '../hooks/useVisitorId';
import { oeuvreService } from '../services/oeuvreService';

const Home = () => {
  const { t } = useTranslation();
  const deviceType = useDeviceType();
  const { visitorId } = useVisitorId();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [featured, setFeatured] = useState([]);

  // Images du musée
  const backgroundImages = [
    {
      src: '/images/musee.jpeg',
      alt: 'Vue extérieure du Musée des Civilisations Noires',
      title: 'Musée des Civilisations Noires',
      description: 'Découvrez l\'architecture moderne du musée'
    },
    {
      src: '/images/entree.jpeg',
      alt: 'Entrée du musée',
      title: 'Entrée Majestueuse',
      description: 'Accueillez-vous dans un espace culturel exceptionnel'
    },
    {
      src: '/images/entre-musee.jpeg',
      alt: 'Intérieur du musée',
      title: 'Espaces Intérieurs',
      description: 'Explorez les salles d\'exposition modernes'
    },
    {
      src: '/images/civilisation.jpeg',
      alt: 'Collections du musée',
      title: 'Collections Uniques',
      description: 'Découvrez les trésors des civilisations noires'
    }
  ];

  // Simulation du chargement des images
  useEffect(() => {
    const loadImages = async () => {
      startLoading();
      
      // Simuler le chargement des images
      const imagePromises = backgroundImages.map((image) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.src = image.src;
        });
      });

      await Promise.all(imagePromises);
      
      // Délai minimum pour voir l'animation
      setTimeout(() => {
        setIsLoadingImages(false);
        stopLoading();
      }, 2000);
    };

    loadImages();
  }, [startLoading, stopLoading]);

  // Auto-play du carousel
  useEffect(() => {
    if (!isPlaying || isLoadingImages) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % backgroundImages.length
      );
    }, 4000); // Change d'image toutes les 4 secondes

    return () => clearInterval(interval);
  }, [isPlaying, backgroundImages.length, isLoadingImages]);

  // Charger À la Une: recommandations (si uuid) sinon œuvres récentes
  useEffect(() => {
    let cancelled = false;
    async function loadFeatured() {
      try {
        let items;
        if (visitorId) {
          const res = await oeuvreService.getRecommendations(visitorId);
          items = res?.data || res;
        } else {
          const res = await oeuvreService.getAll({ limit: 6 });
          items = res?.data || res;
        }
        if (!cancelled) setFeatured((items || []).slice(0, 6));
      } catch (_) {}
    }
    loadFeatured();
    return () => {
      cancelled = true;
    };
  }, [visitorId]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex + 1) % backgroundImages.length
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? backgroundImages.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="min-h-screen">
      {/* Loading Overlay */}
      <LoadingOverlay
        isLoading={isLoadingImages}
        message="Chargement des œuvres..."
        variant="museum"
        size="large"
        showText={true}
        overlay={true}
      />

      {/* Hero Section avec Carousel d'Images */}
      <section className="relative h-screen overflow-hidden">
        {/* Background Images Carousel */}
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <img
                src={backgroundImages[currentImageIndex].src}
                alt={backgroundImages[currentImageIndex].alt}
                className="w-full h-full object-cover"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
            </motion.div>
          </AnimatePresence>
        </div>


        {/* Contrôles du Carousel */}
        <div className="absolute top-4 right-4 z-20 flex items-center space-x-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
        </div>

        {/* Indicateurs d'images */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        {/* Flèches de navigation */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
        >
          <ChevronRight size={24} className="rotate-180" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
        >
          <ChevronRight size={24} />
        </button>
        
        {/* Contenu Principal */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-3xl"
            >
              <motion.h1 
                className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {backgroundImages[currentImageIndex].title}
              </motion.h1>
              <motion.p 
                className="text-xl md:text-2xl text-white mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                {backgroundImages[currentImageIndex].description}
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-museum-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 shadow-xl"
                >
                  <span>{t('hero.cta')}</span>
                  <ChevronRight size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-opacity-30 transition-all flex items-center justify-center space-x-2 border border-white border-opacity-30 shadow-xl"
                >
                  <QrCode size={20} />
                  <span>{t('hero.scan')}</span>
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* À la Une - Style Louvre avec overlays et catégories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">À la Une</h2>
            <a href="/collections" className="hidden sm:inline-flex items-center gap-2 text-museum-primary hover:text-museum-secondary font-semibold">
              Voir tout <ChevronRight size={18} />
            </a>
          </div>

          {featured.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Carte principale */}
              <a
                href={`/oeuvre/${featured[0].id}`}
                className="group relative md:col-span-2 rounded-2xl overflow-hidden h-[360px] shadow border border-gray-200"
              >
                <img
                  src={featured[0].image_principale || featured[0].medias?.[0]?.url || '/placeholder-artwork.svg'}
                  alt={featured[0].titre}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-gray-900">
                    {featured[0].categorie || 'Exposition'}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-2xl md:text-3xl font-serif font-bold mb-2 line-clamp-2">{featured[0].titre}</h3>
                  <p className="text-white/90 line-clamp-2">{featured[0].description || 'Découvrir cette mise en avant'}</p>
                </div>
              </a>

              {/* Carte secondaire haute */}
              {featured[1] && (
                <a
                  href={`/oeuvre/${featured[1].id}`}
                  className="group relative rounded-2xl overflow-hidden h-[360px] shadow border border-gray-200"
                >
                  <img
                    src={featured[1].image_principale || featured[1].medias?.[0]?.url || '/placeholder-artwork.svg'}
                    alt={featured[1].titre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-gray-900">
                      {featured[1].categorie || 'Événement'}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-serif font-bold mb-1 line-clamp-2">{featured[1].titre}</h3>
                    <p className="text-white/90 text-sm line-clamp-2">{featured[1].description || 'En savoir plus'}</p>
                  </div>
                </a>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-[360px] bg-gray-200 rounded-2xl animate-pulse" />
              <div className="h-[360px] bg-gray-200 rounded-2xl animate-pulse" />
              <div className="h-[360px] bg-gray-200 rounded-2xl animate-pulse" />
            </div>
          )}

          {/* Grille inférieure (3-6) */}
          {featured.length > 2 && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.slice(2, 6).map((item, idx) => (
                <a key={idx} href={`/oeuvre/${item.id}`} className="group relative rounded-2xl overflow-hidden h-[220px] shadow border border-gray-200">
                  <img
                    src={item.image_principale || item.medias?.[0]?.url || '/placeholder-artwork.svg'}
                    alt={item.titre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-semibold bg-white/90 text-gray-900">
                      {item.categorie || (['Conférence','Atelier','Actualité','Focus'][idx % 4])}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="text-lg font-serif font-semibold line-clamp-2">{item.titre}</h3>
                  </div>
                </a>
              ))}
            </div>
          )}

          <div className="sm:hidden mt-8 text-center">
            <a href="/collections" className="inline-flex items-center gap-2 text-museum-primary hover:text-museum-secondary font-semibold">
              Voir tout <ChevronRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* Section Parallax avec Images */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/entre-musee.jpeg"
            alt="Intérieur du musée"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center text-white"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Une expérience immersive
            </h2>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Plongez dans l'univers fascinant des civilisations noires à travers une technologie de pointe
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Technologies innovantes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez le musée comme jamais auparavant avec nos technologies de pointe
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: QrCode,
                title: 'Scan QR Code',
                description: 'Scannez les QR codes pour accéder aux informations détaillées des œuvres',
                color: 'bg-museum-primary'
              },
              {
                icon: ChevronRight,
                title: 'Guide Audio',
                description: 'Écoutez les commentaires audio pour une expérience immersive',
                color: 'bg-museum-secondary'
              },
              {
                icon: ChevronRight,
                title: 'Multilingue',
                description: 'Disponible en français, anglais et wolof',
                color: 'bg-museum-accent'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 ${feature.color} rounded-lg mb-4`}>
                  <feature.icon className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Collections avec Image de Fond */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/civilisation.jpeg"
            alt="Collections du musée"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/80" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center text-white"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Collections exceptionnelles
            </h2>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Explorez des milliers d'œuvres d'art et d'objets historiques des civilisations noires
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-museum-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 mx-auto shadow-xl"
            >
              <span>Découvrir les collections</span>
              <ChevronRight size={20} />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
