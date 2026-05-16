import { api } from '../boot/axios';

export async function listAdminResource(resource) {
  const { data } = await api.get(`/admin/${resource}`);
  return data;
}

export async function createAdminResource(resource, payload) {
  const { data } = await api.post(`/admin/${resource}`, payload);
  return data;
}

export async function updateAdminResource(resource, id, payload) {
  const { data } = await api.put(`/admin/${resource}/${id}`, payload);
  return data;
}

export async function deleteAdminResource(resource, id) {
  const { data } = await api.delete(`/admin/${resource}/${id}`);
  return data;
}
