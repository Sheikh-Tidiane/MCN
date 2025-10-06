import api from './api';

export const TicketService = {
  getDisponibilites: async ({ date, type }) => {
    const params = {};
    if (date) params.date = date;
    if (type) params.type = type;
    const { data } = await api.get('/billets/disponibilites', { params });
    return data.data;
  },

  creerBillet: async ({ visiteur_uuid, type, prix, date_visite, heure_visite }) => {
    const payload = { visiteur_uuid, type, prix, date_visite, heure_visite };
    const { data } = await api.post('/billets', payload);
    return data.data;
  },

  billetsParVisiteur: async (uuid) => {
    const { data } = await api.get(`/billets/visiteur/${uuid}`);
    return data.data;
  },

  annulerBillet: async (id) => {
    const { data } = await api.put(`/billets/${id}/cancel`);
    return data.data;
  },

  validerQr: async (qrCode) => {
    const { data } = await api.post(`/billets/validate/${qrCode}`);
    return data;
  },
};

export default TicketService;


