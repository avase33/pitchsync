import axios from 'axios';
import type { User, Pitch, PaginatedResponse } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
});

// Attach access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ps_access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh on 401 TOKEN_EXPIRED
let isRefreshing = false;
let queue: Array<{ resolve: (t: string) => void; reject: (e: unknown) => void }> = [];

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.data?.error === 'TOKEN_EXPIRED' && !original._retry) {
      original._retry = true;
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        });
      }
      isRefreshing = true;
      try {
        const refreshToken = localStorage.getItem('ps_refresh_token');
        const { data } = await axios.post('/api/auth/refresh', { refreshToken });
        localStorage.setItem('ps_access_token', data.accessToken);
        queue.forEach((p) => p.resolve(data.accessToken));
        queue = [];
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch (refreshErr) {
        queue.forEach((p) => p.reject(refreshErr));
        queue = [];
        localStorage.removeItem('ps_access_token');
        localStorage.removeItem('ps_refresh_token');
        window.location.href = '/login';
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(err);
  }
);

// Auth API
export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<{ user: User; accessToken: string; refreshToken: string }>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<{ user: User; accessToken: string; refreshToken: string }>('/auth/login', data),
  me: () => api.get<{ user: User }>('/auth/me'),
  updateMe: (data: Partial<{ name: string; bio: string; githubUsername: string }>) =>
    api.patch<{ user: User }>('/auth/me', data),
};

// Pitches API
export const pitchesApi = {
  list: (params?: { page?: number; q?: string }) =>
    api.get<PaginatedResponse<Pitch>>('/pitches', { params }),
  listPublic: (params?: { page?: number }) =>
    api.get<PaginatedResponse<Pitch>>('/pitches/public', { params }),
  get: (id: string) => api.get<{ pitch: Pitch }>(`/pitches/${id}`),
  getBySlug: (slug: string) => api.get<{ pitch: Pitch }>(`/pitches/slug/${slug}`),
  create: (data: { repoUrl: string; theme?: string; isPublic?: boolean }) =>
    api.post<{ pitch: Pitch }>('/pitches', data),
  update: (id: string, data: Partial<Pitch>) =>
    api.patch<{ pitch: Pitch }>(`/pitches/${id}`, data),
  delete: (id: string) => api.delete(`/pitches/${id}`),
  like: (id: string) => api.post<{ likes: number }>(`/pitches/${id}/like`),
  regenerate: (id: string) => api.post(`/pitches/${id}/regenerate`),
};

export default api;
