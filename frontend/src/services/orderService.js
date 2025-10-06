import api from './api';

export const OrderService = {
  create: async ({ visiteur_uuid, items, methode_paiement, email }) => {
    const { data } = await api.post('/commandes', { visiteur_uuid, items, methode_paiement, email });
    return data.data;
  },
  byVisitor: async (uuid) => {
    const { data } = await api.get(`/commandes/visiteur/${uuid}`);
    return data.data;
  },
  show: async (id) => {
    const { data } = await api.get(`/commandes/${id}`);
    return data.data;
  },
  updateStatus: async (id, payload) => {
    const { data } = await api.put(`/commandes/${id}/status`, payload);
    return data.data;
  },
  cancel: async (id) => {
    const { data } = await api.put(`/commandes/${id}/cancel`);
    return data.data;
  },
};

export default OrderService;


