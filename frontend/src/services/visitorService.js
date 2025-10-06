import api from './api';

export async function createVisitor(preferences = {}, uuid = null) {
  const payload = { preferences };
  if (uuid) {
    payload.uuid = uuid;
  }
  const { data } = await api.post('/visiteurs', payload);
  return data;
}

export async function getVisitor(visitorUuid) {
  const { data } = await api.get(`/visiteurs/${visitorUuid}`);
  return data;
}

export async function updateVisitor(visitorUuid, payload) {
  const { data } = await api.put(`/visiteurs/${visitorUuid}`, payload);
  return data;
}

export async function addFavorite(visitorUuid, oeuvreId) {
  const { data } = await api.post(`/visiteurs/${visitorUuid}/favorites`, { oeuvre_id: Number(oeuvreId) });
  return data;
}

export async function removeFavorite(visitorUuid, oeuvreId) {
  const { data } = await api.delete(`/visiteurs/${visitorUuid}/favorites/${oeuvreId}`);
  return data;
}

export async function addToHistory(visitorUuid, oeuvreId) {
  const { data } = await api.post(`/visiteurs/${visitorUuid}/historique`, { oeuvre_id: Number(oeuvreId) });
  return data;
}



