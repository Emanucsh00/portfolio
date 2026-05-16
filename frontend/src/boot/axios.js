import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 15000
});

export function installAxios(app) {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('portfolio_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('portfolio_token');
        sessionStorage.removeItem('portfolio_challenge_token');
        sessionStorage.removeItem('portfolio_setup_token');
        sessionStorage.removeItem('portfolio_challenge_issued_at');

        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }

      return Promise.reject(error);
    }
  );

  app.config.globalProperties.$axios = api;
  app.provide('axios', api);
}
