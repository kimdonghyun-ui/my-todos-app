import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types/auth';

interface AuthStore {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  user: User | null;
  setUser: (data: User) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isLoading: false,
      setIsLoading: (isLoading: boolean) => set({ isLoading }),
      accessToken: null,
      setAccessToken: (data) => set({ accessToken: data }),
      user: null,
      setUser: (data) => set({ user: data }),
      reset: () => {
        set({
          accessToken: null,
          user: null,
        });
        useAuthStore.persist.clearStorage();
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);
