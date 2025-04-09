// src/store/levelStore.ts
import { create } from 'zustand';

type Level = '초급' | '중급' | '고급';

interface LevelState {
  level: Level;
  setLevel: (level: Level) => void;
}

export const useLevelStore = create<LevelState>((set) => ({
  level: '초급',
  setLevel: (level) => set({ level }),
}));
