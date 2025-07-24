import { create } from 'zustand';

interface AuthState {
  email: string;
  setEmail: (email: string) => void;
  clearEmail: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  email: '',
  setEmail: (email) => set({ email }),
  clearEmail: () => set({ email: '' }),
}));