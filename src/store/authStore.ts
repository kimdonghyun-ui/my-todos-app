import { create } from 'zustand';
import { User } from '../types/auth';

interface AuthStore {
  accessToken: string | null; // 토큰
  setAccessToken: (token: string | null) => void; // 토큰 넣기
  user: User | null; // 유저 정보
  setUser: (data: User) => void; // 유저 정보 넣기
}

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null, // 토큰
  setAccessToken: (data) => set({ accessToken: data }), // 토큰 넣기
  user: null, // 유저 정보
  setUser: (data) => set({ user: data }), // 유저 정보 넣기
})); 