import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List, Heart, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { oeuvreService } from '../services/oeuvreService';
import { useLanguage } from '../hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import { useVisitorId } from '../hooks/useVisitorId';
import { addFavorite as apiAddFavorite, removeFavorite as apiRemoveFavorite, getVisitor } from '../services/visitorService';
import toast from 'react-hot-toast';

const Collections = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const { visitorId } = useVisitorId();
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [onlyAudio, setOnlyAudio] = useState(false);
  const [onlyVideo, setOnlyVideo] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [favorites, setFavorites] = useState(new Set());

  // Load visitor favorites on mount
  useEffect(() => {
    const loadFavorites = async () => {
      if (visitorId) {
        try {
          const visitorData = await getVisitor(visitorId);
          if (visitorData?.data?.oeuvres_favorites) {
            setFavorites(new Set(visitorData.data.oeuvres_favorites.map(id => Number(id))));
          }
        } catch (error) {
          console.log('Impossible de charger les favoris:', error);
        }
      }
    };
    
    loadFavorites();
  }, [visitorId]);

  // Toggle favorite function
  const toggleFavorite = async (artworkId) => {
    try {
      if (!visitorId) {
        toast.error('Identifiant visiteur manquant');
        return;
      }
      
      const isCurrentlyFavorite = favorites.has(Number(artworkId));
      
      if (isCurrentlyFavorite) {
        await apiRemoveFavorite(visitorId, artworkId);
        setFavorites(prev => {
          const newFavorites = new Set(prev);
          newFavorites.delete(Number(artworkId));
          return newFavorites;
        });
        toast.success('Retiré des favoris');
      } else {
        await apiAddFavorite(visitorId, artworkId);
        setFavorites(prev => new Set([...prev, Number(artworkId)]));
        toast.success('Ajouté aux favoris');
      }
    } catch (error) {
      console.error('Erreur favoris:', error);
      toast.error('Action impossible pour le moment');
    }
  };

  // Fetch collections data
  const { data: collections, isLoading, error } = useQuery(
    ['collections', currentLanguage, searchQuery, selectedType, selectedPeriod, onlyAudio, onlyVideo, sortBy, page, perPage],
    () => oeuvreService.getAll({
      langue: currentLanguage,
      search: searchQuery,
      type: selectedType,
      periode: selectedPeriod,
      sort: sortBy,
      audio_disponible: onlyAudio ? 1 : undefined,
      video_disponible: onlyVideo ? 1 : undefined,
      page,
      per_page: perPage
    }),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Debounce de la recherche (300ms)
  useEffect(() => {
    const id = setTimeout(() => {
      setSearchQuery(searchInput.trim());
    }, 300);
    return () => clearTimeout(id);
  }, [searchInput]);

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
  };

  const handleTypeFilter = (type) => {
    setSelectedType(selectedType === type ? '' : type);
    setPage(1);
  };

  const handlePeriodFilter = (period) => {
    setSelectedPeriod(selectedPeriod === period ? '' : period);
    setPage(1);
  };

  // Charger les types d'œuvres à partir des données (dynamiques)
  const artworkTypes = useMemo(() => {
    const list = collections?.data || [];
    const counts = list.reduce((acc, item) => {
      const type = item.type_oeuvre || 'autre';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    const mapping = {
      peinture: 'Peintures',
      sculpture: 'Sculptures',
      masque: 'Masques',
      textile: 'Textiles',
      artisanat: 'Artisanat',
      autre: 'Autres'
    };
    return Object.entries(counts).map(([id, count]) => ({ id, label: mapping[id] || id, count }));
  }, [collections]);

  const periods = [
    { id: 'prehistorique', label: 'Préhistorique' },
    { id: 'antique', label: 'Antique' },
    { id: 'medieval', label: 'Médiéval' },
    { id: 'moderne', label: 'Moderne' },
    { id: 'contemporain', label: 'Contemporain' }
  ];

  const displayedItems = !isLoading ? (collections?.data || []) : [];

  // Note: On ne bloque plus la page entière; on affiche un squelette dans le header et, si besoin, dans la grille

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading ? (
            <div className="text-center">
              <div className="h-8 md:h-12 w-56 md:w-80 bg-gray-200 rounded mx-auto mb-4 animate-pulse"></div>
              <div className="h-5 w-5/6 md:w-2/3 bg-gray-200 rounded mx-auto mb-8 animate-pulse"></div>
              <div className="max-w-2xl mx-auto">
                <div className="h-12 bg-gray-200 rounded-lg mb-6 animate-pulse"></div>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-8 w-24 bg-gray-200 rounded-full animate-pulse"></div>
                ))}
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
                  {t('collections.title')}
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                  {t('collections.subtitle')}
                </p>
              </motion.div>

              {/* Search and Filters */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-6"
              >
                {/* Search Bar */}
                <div className="relative max-w-2xl mx-auto">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder={t('collections.search')}
                    value={searchInput}
                    onChange={handleSearch}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-museum-primary focus:border-transparent"
                  />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-4">
                  {/* Type Filters */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setSelectedType('');
                        setSelectedPeriod('');
                        setOnlyAudio(false);
                        setOnlyVideo(false);
                        setSearchInput('');
                        setSearchQuery('');
                        setSortBy('date');
                        setPerPage(12);
                        setPage(1);
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        !selectedType && !selectedPeriod && !onlyAudio && !onlyVideo && !searchQuery
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-900 hover:text-white'
                      }`}
                    >
                      Voir tout
                    </button>
                    {artworkTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => handleTypeFilter(type.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          selectedType === type.id
                            ? 'bg-museum-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-museum-primary hover:text-white'
                        }`}
                      >
                        {type.label} ({type.count})
                      </button>
                    ))}
                  </div>

                  {/* Period Filters */}
                  <div className="flex flex-wrap gap-2">
                    {periods.map((period) => (
                      <button
                        key={period.id}
                        onClick={() => handlePeriodFilter(period.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          selectedPeriod === period.id
                            ? 'bg-museum-secondary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-museum-secondary hover:text-white'
                        }`}
                      >
                        {period.label}
                      </button>
                    ))}
                  </div>

                  {/* Sort Controls */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Trier par</label>
                    <select
                      value={sortBy}
                      onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="date">Par défaut</option>
                      <option value="titre">Titre (A→Z)</option>
                      <option value="annee_creation">Année</option>
                      <option value="created_at">Récents</option>
                    </select>
                  </div>

                  {/* Per page */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Par page</label>
                    <select
                      value={perPage}
                      onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value={12}>12</option>
                      <option value={24}>24</option>
                      <option value={48}>48</option>
                    </select>
                  </div>

              {/* Media Filters */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setOnlyAudio(!onlyAudio)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    onlyAudio ? 'bg-museum-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-museum-primary hover:text-white'
                  }`}
                >
                  Audio disponible
                </button>
                <button
                  onClick={() => setOnlyVideo(!onlyVideo)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    onlyVideo ? 'bg-museum-secondary text-white' : 'bg-gray-100 text-gray-700 hover:bg-museum-secondary hover:text-white'
                  }`}
                >
                  Vidéo disponible
                </button>
              </div>
                </div>

                {/* View Controls */}
                <div className="flex items-center justify-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'grid' ? 'bg-museum-primary text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <Grid size={20} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'list' ? 'bg-museum-primary text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <List size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>

      {/* Collections Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className={`bg-white rounded-lg shadow-md overflow-hidden ${viewMode === 'list' ? 'flex' : ''}`}>
                <div className={`${viewMode === 'list' ? 'w-48 h-32' : 'aspect-square'} bg-gray-200 animate-pulse`}></div>
                <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="h-5 w-3/4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 w-1/3 bg-gray-200 rounded mb-4 animate-pulse"></div>
                  <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : displayedItems.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className={`grid gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
            }`}
          >
            {displayedItems.map((artwork, index) => (
              <motion.div
                key={artwork.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
                onClick={() => navigate(`/oeuvre/${artwork.id}`)}
              >
                <div className={`${viewMode === 'list' ? 'w-48 h-32' : 'aspect-square'} relative bg-gray-200 overflow-hidden`}>
                  <img
                    src={artwork.image_principale || artwork.medias?.[0]?.url || '/placeholder-artwork.svg'}
                    alt={artwork.titre}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-90" />
                  {/* Badges audio/vidéo */}
                  <div className="absolute top-2 left-2 flex items-center gap-2">
                    {artwork.video_disponible && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-museum-secondary/90 text-white shadow">
                        ▶ Vidéo
                      </span>
                    )}
                    {artwork.audio_disponible && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-museum-accent/90 text-white shadow">
                        ♪ Audio
                      </span>
                    )}
                  </div>
                  {/* Titre en overlay (mode grid) */}
                  {viewMode === 'grid' && (
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="text-white drop-shadow-sm">
                        <h3 className="text-sm font-semibold line-clamp-1">{artwork.titre}</h3>
                        <p className="text-[11px] opacity-90 line-clamp-1">{artwork.artiste || 'Artiste inconnu'}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                    {artwork.titre}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {artwork.artiste || 'Artiste inconnu'}
                  </p>
                  <p className="text-sm text-gray-500 mb-3">
                    {(artwork.periode || 'Période non spécifiée')}
                    {artwork.annee_creation ? ` • ${artwork.annee_creation}` : ''}
                    {artwork.provenance ? ` • ${artwork.provenance}` : ''}
                  </p>
                  
                  {viewMode === 'list' && (
                    <p className="text-gray-700 text-sm line-clamp-2">
                      {artwork.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(artwork.id);
                        }}
                        className={`p-1 transition-colors ${
                          favorites.has(Number(artwork.id))
                            ? 'text-red-500 hover:text-red-600'
                            : 'text-gray-400 hover:text-red-500'
                        }`}
                      >
                        <Heart size={16} fill={favorites.has(Number(artwork.id)) ? 'currentColor' : 'none'} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/oeuvre/${artwork.id}`);
                        }}
                        className="p-1 text-gray-400 hover:text-museum-primary transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                    <span className="text-xs text-gray-500">
                      {artwork.type_oeuvre || 'Type non spécifié'}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucune œuvre trouvée
            </h3>
            <p className="text-gray-600">
              Essayez de modifier vos critères de recherche
            </p>
          </motion.div>
        )}
        {/* Pagination */}
        {!isLoading && collections?.meta && (
          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className={`px-4 py-2 rounded-lg border ${page <= 1 ? 'text-gray-400 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            >
              Précédent
            </button>
            <div className="text-sm text-gray-600">
              Page {collections.meta.current_page} / {collections.meta.last_page} • {collections.meta.total} œuvres
            </div>
            <button
              onClick={() => setPage((p) => (collections.meta && p < collections.meta.last_page ? p + 1 : p))}
              disabled={!collections.meta || page >= collections.meta.last_page}
              className={`px-4 py-2 rounded-lg border ${(!collections.meta || page >= collections.meta.last_page) ? 'text-gray-400 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            >
              Suivant
            </button>
          </div>
        )}
      </div>

      {/* FAB Scan on mobile */}
      <div className="fixed bottom-5 right-5 z-40 sm:hidden">
        <button
          onClick={() => navigate('/scan')}
          className="w-14 h-14 rounded-full shadow-xl bg-museum-primary text-white flex items-center justify-center hover:bg-museum-secondary transition-colors"
          aria-label="Scanner un QR Code"
        >
          {/* Simple QR unicode style */}
          <span className="text-xl">⌁</span>
        </button>
      </div>
    </div>
  );
};

export default Collections;
