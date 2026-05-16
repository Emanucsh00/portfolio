import axios from 'axios';
import { Loading, Notify } from 'quasar';

const IS_PROD = import.meta.env.PROD;

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: IS_PROD ? 60000 : 15000
});

let activeRequests = 0;
let slowTimer = null;

function onRequestStart() {
  activeRequests++;
  if (IS_PROD && activeRequests === 1) {
    slowTimer = setTimeout(() => {
      if (activeRequests > 0) Loading.show({ message: 'Conectando con el servidor...' });
    }, 3000);
  }
}

function onRequestEnd() {
  activeRequests = Math.max(0, activeRequests - 1);
  if (activeRequests === 0) {
    clearTimeout(slowTimer);
    Loading.hide();
  }
}

export function installAxios(app) {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('portfolio_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    onRequestStart();
    return config;
  });

  api.interceptors.response.use(
    (response) => {
      onRequestEnd();
      return response;
    },
    (error) => {
      onRequestEnd();

      if (error.code === 'ECONNABORTED') {
        Notify.create({
          type: 'warning',
          icon: 'hourglass_empty',
          message: 'El servidor gratuito está despertando, intenta nuevamente en unos segundos.',
          timeout: 8000,
          position: 'top'
        });
      } else if (error.response?.status === 401) {
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
