import api from './api';

const PricingService = {
  async getTarifs() {
    const { data } = await api.get('/tarifs');
    return data?.data || [];
  },
};

export default PricingService;



