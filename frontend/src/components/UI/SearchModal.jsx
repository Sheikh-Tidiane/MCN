import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, TrendingUp, Filter } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SearchModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  // Suggestions d'exemple
  const mockSuggestions = [
    { id: 1, title: 'Masque de Toutânkhamon', type: 'Sculpture', period: 'Égypte antique' },
    { id: 2, title: 'Statue de la Victoire de Samothrace', type: 'Sculpture', period: 'Grèce antique' },
    { id: 3, title: 'La Joconde', type: 'Peinture', period: 'Renaissance' },
    { id: 4, title: 'Vénus de Milo', type: 'Sculpture', period: 'Grèce antique' },
    { id: 5, title: 'Code de Hammurabi', type: 'Artéfact', period: 'Mésopotamie' }
  ];

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery.length > 2) {
      setIsLoading(true);
      // Simulation d'une recherche
      setTimeout(() => {
        const filtered = mockSuggestions.filter(item =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.period.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSuggestions(filtered);
        setIsLoading(false);
      }, 300);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleSearch = (query) => {
    if (query.trim()) {
      // Ajouter à l'historique
      const newRecent = [query, ...recentSearches.filter(item => item !== query)].slice(0, 5);
      setRecentSearches(newRecent);
      localStorage.setItem('recentSearches', JSON.stringify(newRecent));
      
      // Fermer le modal et rediriger (ici on peut ajouter la logique de redirection)
      onClose();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-0 right-0 bottom-0 sm:top-20 sm:left-1/2 sm:right-auto sm:bottom-auto sm:transform sm:-translate-x-1/2 w-full sm:max-w-2xl sm:mx-4 z-50"
          >
            <div className="bg-white rounded-none sm:rounded-2xl shadow-2xl border border-gray-100 overflow-hidden h-full sm:h-auto flex flex-col">
              {/* Header */}
              <div className="p-4 sm:p-6 border-b border-gray-100 flex-shrink-0">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                    <input
                      ref={inputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={t('nav.search') || 'Rechercher une œuvre...'}
                      className="w-full pl-10 sm:pl-12 pr-10 sm:pr-4 py-3 sm:py-4 bg-gray-50 rounded-lg sm:rounded-xl border-0 text-base sm:text-lg focus:ring-2 focus:ring-museum-primary focus:bg-white transition-all duration-200"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                      >
                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    )}
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto max-h-96 sm:max-h-96">
                {searchQuery.length === 0 ? (
                  /* Suggestions par défaut */
                  <div className="p-4 sm:p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-museum-primary" />
                      <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Recherches populaires</h3>
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      {['Sculptures égyptiennes', 'Art africain', 'Masques traditionnels', 'Céramiques anciennes'].map((item, index) => (
                        <button
                          key={index}
                          onClick={() => handleSearch(item)}
                          className="w-full text-left p-3 sm:p-3 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Search className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-700 text-sm sm:text-base truncate">{item}</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {recentSearches.length > 0 && (
                      <>
                        <div className="flex items-center gap-2 mt-6 mb-4">
                          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                          <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Recherches récentes</h3>
                        </div>
                        <div className="space-y-1 sm:space-y-2">
                          {recentSearches.map((item, index) => (
                            <button
                              key={index}
                              onClick={() => handleSearch(item)}
                              className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                                <span className="text-gray-700 text-sm sm:text-base truncate">{item}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  /* Résultats de recherche */
                  <div className="p-4 sm:p-6">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-6 sm:py-8">
                        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-museum-primary"></div>
                        <span className="ml-3 text-gray-600 text-sm sm:text-base">Recherche en cours...</span>
                      </div>
                    ) : suggestions.length > 0 ? (
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center gap-2 mb-3 sm:mb-4">
                          <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-museum-primary" />
                          <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                            {suggestions.length} résultat{suggestions.length > 1 ? 's' : ''} trouvé{suggestions.length > 1 ? 's' : ''}
                          </h3>
                        </div>
                        {suggestions.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleSearch(item.title)}
                            className="w-full text-left p-3 sm:p-4 hover:bg-gray-50 rounded-lg sm:rounded-xl transition-colors border border-gray-100"
                          >
                            <div className="flex items-start gap-3 sm:gap-4">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-museum-primary to-museum-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold text-sm sm:text-lg">
                                  {item.title.charAt(0)}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base truncate">{item.title}</h4>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-500">
                                  <span className="bg-gray-100 px-2 py-1 rounded-full inline-block w-fit">{item.type}</span>
                                  <span className="truncate">{item.period}</span>
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 sm:py-8">
                        <Search className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
                        <p className="text-gray-500 text-sm sm:text-base">Aucun résultat trouvé pour "{searchQuery}"</p>
                        <p className="text-xs sm:text-sm text-gray-400 mt-2">Essayez avec d'autres mots-clés</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
