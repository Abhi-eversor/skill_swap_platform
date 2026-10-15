import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 401 && error.config?.headers?.Authorization &&
      !['/user/login', '/user/register'].includes(error.config?.url)) {
    window.dispatchEvent(new Event('session-expired'));
  }
  return Promise.reject(error);
});

export function errorMessage(error, fallback = 'Something went wrong. Please try again.') {
  return error.response?.data?.message || (error.code === 'ERR_NETWORK' ? 'Cannot reach the server. Please try again later.' : fallback);
}

export default api;
