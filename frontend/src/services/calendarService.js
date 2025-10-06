import api from './api';

const CalendarService = {
  async getMonth({ month }) {
    const { data } = await api.get(`/calendrier`, { params: { month } });
    // Expected shape: { data: { month, closures: [...], events: [...] } }
    return data?.data || { month, closures: [], events: [] };
  },
};

export default CalendarService;



