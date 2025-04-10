import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types/auth';

interface AuthStore {
  accessToken: string | null; // 토큰
  setAccessToken: (token: string | null) => void; // 토큰 넣기
  user: User | null; // 유저 정보
  setUser: (data: User) => void; // 유저 정보 넣기
  reset: () => void;
}

// export const useAuthStore = create<AuthStore>((set) => ({
//   accessToken: null, // 토큰
//   setAccessToken: (data) => set({ accessToken: data }), // 토큰 넣기
//   user: null, // 유저 정보
//   setUser: (data) => set({ user: data }), // 유저 정보 넣기

// }));



export const useAuthStore = create(
  persist<AuthStore>(
    (set) => ({
      accessToken: null, // 토큰
      setAccessToken: (data) => set({ accessToken: data }), // 토큰 넣기
      user: null, // 유저 정보
      setUser: (data) => set({ user: data }), // 유저 정보 넣기
      // ✅ 상태 초기화 함수 추가
      reset: () => {
        set({
          accessToken: null,
          user: null,
        });
        useAuthStore.persist.clearStorage();
      },
    }),
    {
      name: 'auth-store', // 🔐 로컬스토리지 키
    }
  )
);
