// src/store/levelStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Level = 'easy' | 'medium' | 'hard';

interface LevelState {
  level: Level;
  setLevel: (level: Level) => void;
}

export const useLevelStore = create(
  persist<LevelState>(
    (set) => ({
      level: 'easy',
      setLevel: (level) => set({ level }),
    }),
    {
      name: 'selected-level', // 🔐 로컬스토리지 키
    }
  )
);
