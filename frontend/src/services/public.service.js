import { api } from '../boot/axios';

export async function getPublicPortfolio() {
  const { data } = await api.get('/public/portfolio');
  return data;
}

export async function getPublicProjects() {
  const { data } = await api.get('/public/projects');
  return data;
}

export async function getPublicTechnologies() {
  const { data } = await api.get('/public/technologies');
  return data;
}

export async function getPublicSkills() {
  const { data } = await api.get('/public/soft-skills');
  return data;
}

export async function getPublicExposition() {
  const { data } = await api.get('/public/exposition');
  return data;
}
