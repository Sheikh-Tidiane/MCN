import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Share2, Info, Clock, MapPin, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../hooks/useLanguage';
import { oeuvreService } from '../../services/oeuvreService';
import { useQuery } from 'react-query';
import { useVisitorId } from '../../hooks/useVisitorId';
import { addFavorite as apiAddFavorite, removeFavorite as apiRemoveFavorite, addToHistory, getVisitor } from '../../services/visitorService';
import toast from 'react-hot-toast';

const OeuvreDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  const audioRef = React.useRef(null);
  const videoRef = React.useRef(null);
  const getYouTubeEmbedUrl = (url) => {
    try {
      const u = new URL(url);
      if (u.hostname.includes('youtube.com') || u.hostname.includes('youtu.be')) {
        let id = '';
        if (u.hostname.includes('youtu.be')) {
          id = u.pathname.replace('/', '');
        } else if (u.searchParams.get('v')) {
          id = u.searchParams.get('v');
        } else if (u.pathname.startsWith('/embed/')) {
          return url; // déjà en embed
        }
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
    } catch (e) {}
    return null;
  };

  // Fetch œuvre data
  const { data: oeuvre, isLoading, error } = useQuery(
    ['oeuvre', id, currentLanguage],
    () => oeuvreService.getById(id, currentLanguage),
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const { visitorId } = useVisitorId();

  // Load favorite status on mount
  useEffect(() => {
    const loadFavoriteStatus = async () => {
      if (visitorId && id) {
        try {
          const visitorData = await getVisitor(visitorId);
          if (visitorData?.data?.oeuvres_favorites) {
            const isArtworkFavorite = visitorData.data.oeuvres_favorites.includes(Number(id));
            setIsFavorite(isArtworkFavorite);
          }
        } catch (error) {
          console.log('Impossible de charger le statut favori:', error);
        }
      }
    };
    
    loadFavoriteStatus();
  }, [visitorId, id]);

  // Add to history on view
  useEffect(() => {
    if (visitorId && id) {
      addToHistory(visitorId, id).catch(() => {});
    }
  }, [visitorId, id]);

  // Audio controls
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleFavorite = async () => {
    try {
      if (!visitorId) {
        toast.error('Identifiant visiteur manquant');
        return;
      }
      if (isFavorite) {
        await apiRemoveFavorite(visitorId, id);
        setIsFavorite(false);
        toast.success('Retiré des favoris');
      } else {
        await apiAddFavorite(visitorId, id);
        setIsFavorite(true);
        toast.success('Ajouté aux favoris');
      }
    } catch (error) {
      console.error('Erreur favoris:', error);
      toast.error('Action impossible pour le moment');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: oeuvre?.data?.titre,
          text: oeuvre?.data?.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Erreur lors du partage:', err);
      }
    } else {
      // Fallback: copier le lien
      navigator.clipboard.writeText(window.location.href);
      toast.success('Lien copié dans le presse-papiers');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de l'œuvre...</p>
        </div>
      </div>
    );
  }

  if (error || !oeuvre) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Œuvre non trouvée</h1>
          <p className="text-gray-600 mb-6">Cette œuvre n'existe pas ou a été supprimée.</p>
          <button
            onClick={() => navigate('/collections')}
            className="bg-museum-primary text-white px-6 py-3 rounded-lg hover:bg-museum-secondary transition-colors"
          >
            Retour aux collections
          </button>
        </div>
      </div>
    );
  }

  const artwork = oeuvre;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-700 hover:text-museum-primary transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Retour</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleFavorite}
                className={`p-2 rounded-full transition-colors ${
                  isFavorite 
                    ? 'bg-red-100 text-red-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                }`}
              >
                <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-museum-primary hover:text-white transition-colors"
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image/Media Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Media Switcher */}
            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative">
                <img
                  src={artwork.image_principale || artwork.medias?.find(m => m.est_principal)?.url || artwork.medias?.[0]?.url || '/placeholder-artwork.svg'}
                  alt={artwork.titre}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              {/* Thumbs / media selector */}
              {artwork.medias && artwork.medias.length > 1 && (
                <div className="p-3 bg-white/60 backdrop-blur">
                  <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
                    {artwork.medias.slice(0, 8).map((media, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-200">
                        {media.type === 'video' ? (
                          <video src={media.url} className="w-full h-full object-cover" />
                        ) : (
                          <img src={media.url} alt={`${artwork.titre}-${index}`} className="w-full h-full object-cover" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Media Gallery */}
            {artwork.medias && artwork.medias.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {artwork.medias.slice(1, 5).map((media, index) => (
                  <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={media.url}
                      alt={`${artwork.titre} - ${index + 2}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Audio Player */}
            {(artwork.audio_guide || artwork.audio_url) && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Guide audio</h3>
                    <p className="text-sm text-gray-500">Écoutez la présentation de l'œuvre</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-museum-accent/10 text-museum-accent">Audio</span>
                </div>
                <audio
                  controls
                  src={artwork.audio_guide || artwork.audio_url}
                  className="w-full rounded-lg"
                />
                {artwork.audio_transcript && (
                  <div className="mt-4">
                    <button
                      onClick={() => setShowTranscript(!showTranscript)}
                      className="text-museum-primary hover:text-museum-secondary text-sm font-medium"
                    >
                      {showTranscript ? 'Masquer la transcription' : 'Voir la transcription'}
                    </button>
                    {showTranscript && (
                      <div className="mt-2 p-4 bg-gray-50 rounded-lg text-sm text-gray-700 whitespace-pre-wrap">
                        {artwork.audio_transcript}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Video Player */}
            {artwork.video_url && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Vidéo explicative</h3>
                    <p className="text-sm text-gray-500">Regardez la vidéo de présentation</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-museum-secondary/10 text-museum-secondary">Vidéo</span>
                </div>
                {getYouTubeEmbedUrl(artwork.video_url) ? (
                  <div className="relative w-full overflow-hidden rounded-xl shadow aspect-video ring-1 ring-gray-100">
                    <iframe
                      src={getYouTubeEmbedUrl(artwork.video_url)}
                      title="Vidéo explicative"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full border-0"
                    />
                  </div>
                ) : (
                  <video
                    ref={videoRef}
                    src={artwork.video_url}
                    controls
                    className="w-full rounded-xl shadow ring-1 ring-gray-100"
                    poster={artwork.image_principale || artwork.medias?.find(m => m.est_principal)?.url || artwork.medias?.[0]?.url}
                  />
                )}
              </div>
            )}
          </motion.div>

          {/* Information Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Title and Basic Info */}
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
                {artwork.titre}
              </h1>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-3">
                  <User className="text-museum-primary" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Artiste</p>
                    <p className="font-semibold text-gray-900">{artwork.artiste || 'Artiste inconnu'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="text-museum-primary" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Période</p>
                    <p className="font-semibold text-gray-900">{artwork.periode || 'Non spécifiée'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Info className="text-museum-primary" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="font-semibold text-gray-900">{artwork.type_oeuvre || artwork.type || 'Non spécifié'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="text-museum-primary" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Provenance</p>
                    <p className="font-semibold text-gray-900">{artwork.provenance || 'Non spécifiée'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Description
              </h2>
              <div className="prose max-w-none">
                <p className={`text-gray-700 leading-relaxed ${
                  !showFullDescription && artwork.description?.length > 300 ? 'line-clamp-4' : ''
                }`}>
                  {artwork.description || 'Aucune description disponible pour cette œuvre.'}
                </p>
                {artwork.description?.length > 300 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-museum-primary hover:text-museum-secondary font-medium mt-2"
                  >
                    {showFullDescription ? 'Voir moins' : 'Lire la suite'}
                  </button>
                )}
              </div>
            </div>

            {/* Historical Context */}
            {artwork.contexte_historique && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Contexte historique
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {artwork.contexte_historique}
                </p>
              </div>
            )}

            {/* Cultural Significance */}
            {artwork.signification_culturelle && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Signification culturelle
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {artwork.signification_culturelle}
                </p>
              </div>
            )}

            {/* Technical Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Détails techniques
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {artwork.materiau && (
                  <div>
                    <p className="text-sm text-gray-600">Matériau</p>
                    <p className="font-medium text-gray-900">{artwork.materiau}</p>
                  </div>
                )}
                {artwork.dimensions && (
                  <div>
                    <p className="text-sm text-gray-600">Dimensions</p>
                    <p className="font-medium text-gray-900">{artwork.dimensions}</p>
                  </div>
                )}
                {artwork.annee_creation && (
                  <div>
                    <p className="text-sm text-gray-600">Année de création</p>
                    <p className="font-medium text-gray-900">{artwork.annee_creation}</p>
                  </div>
                )}
                {artwork.technique && (
                  <div>
                    <p className="text-sm text-gray-600">Technique</p>
                    <p className="font-medium text-gray-900">{artwork.technique}</p>
                  </div>
                )}
                {artwork.etat_conservation && (
                  <div>
                    <p className="text-sm text-gray-600">État de conservation</p>
                    <p className="font-medium text-gray-900">{artwork.etat_conservation}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={toggleFavorite}
                className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  isFavorite
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                <span>{isFavorite ? 'Retiré des favoris' : 'Ajouter aux favoris'}</span>
              </button>
              
              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-museum-primary text-white rounded-lg font-semibold hover:bg-museum-secondary transition-colors"
              >
                <Share2 size={20} />
                <span>Partager</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OeuvreDetail;