export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || 'Musée des Civilisations Noires',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  LANGUAGES: ['fr', 'en', 'wo'],
  DEFAULT_LANGUAGE: 'fr',
};
