import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Level = 'easy' | 'medium' | 'hard';

interface LevelState {
  level: Level;
  setLevel: (level: Level) => void;
  reset: () => void;
}

export const useLevelStore = create(
  persist<LevelState>(
    (set) => ({
      level: 'easy',
      setLevel: (level) => set({ level }),
      reset: () => {
        set({
          level: 'easy'
        });
        useLevelStore.persist.clearStorage();
      },
    }),
    {
      name: 'level-store',
    }
  )
);