import { useState, useEffect, useCallback } from 'react';

/**
 * Hook personnalisé pour gérer les états de chargement
 * @param {number} delay - Délai minimum avant d'afficher le loader (en ms)
 * @param {number} minDuration - Durée minimum d'affichage du loader (en ms)
 * @returns {Object} - État et méthodes de gestion du chargement
 */
export const useLoading = (delay = 300, minDuration = 500) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStartTime, setLoadingStartTime] = useState(null);
  const [showLoader, setShowLoader] = useState(false);

  // Démarrer le chargement
  const startLoading = useCallback(() => {
    if (!isLoading) {
      setIsLoading(true);
      setLoadingStartTime(Date.now());
      
      // Afficher le loader après le délai spécifié
      const timer = setTimeout(() => {
        setShowLoader(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isLoading, delay]);

  // Arrêter le chargement
  const stopLoading = useCallback(() => {
    if (isLoading && loadingStartTime) {
      const elapsed = Date.now() - loadingStartTime;
      const remainingTime = Math.max(0, minDuration - elapsed);

      setTimeout(() => {
        setShowLoader(false);
        setIsLoading(false);
        setLoadingStartTime(null);
      }, remainingTime);
    }
  }, [isLoading, loadingStartTime, minDuration]);

  // Chargement avec une fonction asynchrone
  const withLoading = useCallback(async (asyncFunction) => {
    startLoading();
    try {
      const result = await asyncFunction();
      return result;
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  // Reset du chargement
  const resetLoading = useCallback(() => {
    setIsLoading(false);
    setShowLoader(false);
    setLoadingStartTime(null);
  }, []);

  // Nettoyage automatique
  useEffect(() => {
    return () => {
      if (loadingStartTime) {
        clearTimeout();
      }
    };
  }, [loadingStartTime]);

  return {
    isLoading,
    showLoader,
    startLoading,
    stopLoading,
    withLoading,
    resetLoading
  };
};

/**
 * Hook pour gérer le chargement global de l'application
 */
export const useGlobalLoading = () => {
  const [globalLoading, setGlobalLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Chargement...');

  const setGlobalLoadingState = useCallback((loading, message = 'Chargement...') => {
    setGlobalLoading(loading);
    setLoadingMessage(message);
  }, []);

  const showGlobalLoading = useCallback((message = 'Chargement...') => {
    setLoadingMessage(message);
    setGlobalLoading(true);
  }, []);

  const hideGlobalLoading = useCallback(() => {
    setGlobalLoading(false);
  }, []);

  return {
    globalLoading,
    loadingMessage,
    setGlobalLoadingState,
    showGlobalLoading,
    hideGlobalLoading
  };
};

/**
 * Hook pour gérer le chargement des pages
 */
export const usePageLoading = () => {
  const [pageLoading, setPageLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const startPageLoading = useCallback(() => {
    setPageLoading(true);
    setLoadingProgress(0);
  }, []);

  const updateProgress = useCallback((progress) => {
    setLoadingProgress(Math.min(100, Math.max(0, progress)));
  }, []);

  const completePageLoading = useCallback(() => {
    setLoadingProgress(100);
    setTimeout(() => {
      setPageLoading(false);
      setLoadingProgress(0);
    }, 300);
  }, []);

  return {
    pageLoading,
    loadingProgress,
    startPageLoading,
    updateProgress,
    completePageLoading
  };
};

export default useLoading;
