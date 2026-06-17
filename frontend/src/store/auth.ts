import { create } from 'zustand';
import type { User } from '../types';
import { authApi } from '../lib/api';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
  setUser: (user: User) => void;
}

function setTokens(access: string, refresh: string) {
  localStorage.setItem('ps_access_token', access);
  localStorage.setItem('ps_refresh_token', refresh);
}

function clearTokens() {
  localStorage.removeItem('ps_access_token');
  localStorage.removeItem('ps_refresh_token');
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isInitialized: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data } = await authApi.login({ email, password });
      setTokens(data.accessToken, data.refreshToken);
      set({ user: data.user, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true });
    try {
      const { data } = await authApi.register({ name, email, password });
      setTokens(data.accessToken, data.refreshToken);
      set({ user: data.user, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  logout: () => {
    clearTokens();
    set({ user: null });
  },

  fetchMe: async () => {
    const token = localStorage.getItem('ps_access_token');
    if (!token) { set({ isInitialized: true }); return; }
    try {
      const { data } = await authApi.me();
      set({ user: data.user, isInitialized: true });
    } catch {
      clearTokens();
      set({ user: null, isInitialized: true });
    }
  },

  setUser: (user) => set({ user }),
}));
