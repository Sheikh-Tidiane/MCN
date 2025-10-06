import api from './api';

export const oeuvreService = {
  // Récupérer toutes les œuvres
  getAll: (params = {}) => {
    const {
      langue,
      search,
      type,
      periode,
      audio_disponible,
      video_disponible,
      sort
    } = params;

    // Adapter les paramètres pour Spatie QueryBuilder côté backend
    const adaptedParams = {
      ...(langue ? { langue } : {}),
      ...(search ? { 'filter[titre]': search } : {}),
      ...(type ? { 'filter[type_oeuvre]': type } : {}),
      ...(periode ? { 'filter[periode]': periode } : {}),
      ...(typeof audio_disponible !== 'undefined' ? { 'filter[audio_disponible]': audio_disponible } : {}),
      ...(typeof video_disponible !== 'undefined' ? { 'filter[video_disponible]': video_disponible } : {}),
      ...(sort ? { sort: sort === 'date' ? 'created_at' : sort } : {}),
      per_page: params.per_page || 100
    };

    return api.get('/oeuvres', { params: adaptedParams }).then(res => res.data);
  },

  // Récupérer une œuvre par ID
  getById: (id, langue = 'fr') => {
    return api.get(`/oeuvres/${id}`, { 
      params: { langue } 
    }).then(res => res.data?.data);
  },

  // Scanner un QR code
  scanQrCode: (qrCode, langue = 'fr') => {
    return api.get(`/scan/${qrCode}`, { 
      params: { langue } 
    });
  },

  // Rechercher des œuvres
  search: (query, langue = 'fr') => {
    return api.get('/oeuvres/search', { 
      params: { q: query, langue } 
    });
  },

  // Filtrer par type
  getByType: (type, langue = 'fr') => {
    return api.get(`/oeuvres/type/${type}`, { 
      params: { langue } 
    });
  },

  // Filtrer par période
  getByPeriod: (period, langue = 'fr') => {
    return api.get(`/oeuvres/periode/${period}`, { 
      params: { langue } 
    });
  },

  // Récupérer les recommandations
  getRecommendations: (visiteurUuid, langue = 'fr') => {
    return api.get(`/oeuvres/recommandations/${visiteurUuid}`, { 
      params: { langue } 
    });
  }
};