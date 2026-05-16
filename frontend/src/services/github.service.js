import { api } from '../boot/axios';

export async function getGithubHistory() {
  const { data } = await api.get('/public/github-history');
  return data;
}
