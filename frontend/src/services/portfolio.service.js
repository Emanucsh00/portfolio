import { api } from '../boot/axios';

export async function fetchPortfolioAdmin(params) {
  const { data } = await api.get('/admin/portfolio', { params });
  return data;
}

export async function fetchPortfolioItem(id) {
  const { data } = await api.get(`/admin/portfolio/${id}`);
  return data;
}

export async function createPortfolioItem(payload) {
  const { data } = await api.post('/admin/portfolio', payload);
  return data;
}

export async function updatePortfolioItem(id, payload) {
  const { data } = await api.put(`/admin/portfolio/${id}`, payload);
  return data;
}

export async function patchPortfolioStatus(id, payload) {
  const { data } = await api.patch(`/admin/portfolio/${id}/status`, payload);
  return data;
}

export async function deletePortfolioItem(id) {
  const { data } = await api.delete(`/admin/portfolio/${id}`);
  return data;
}
