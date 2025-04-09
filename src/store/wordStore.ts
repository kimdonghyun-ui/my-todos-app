import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Word, Level } from '@/types/word';

interface WordState {
  word: Word | null;
  loading: boolean;
  error: string | null;
  favorites: number[];
  fetchTodayWord: (level?: Level) => Promise<void>;
  toggleFavorite: (wordId: number) => void;
  isFavorite: (wordId: number) => boolean;
}

export const useWordStore = create<WordState>()(
  persist(
    (set, get) => ({
      word: null,
      loading: false,
      error: null,
      favorites: [],

      fetchTodayWord: async (level?: Level) => {
        set({ loading: true, error: null });
        try {
          // TODO: API 호출로 교체 가능
          const mockWord: Word = {
            id: 1,
            word: 'serendipity',
            phonetic: '[ˌserənˈdɪpəti]',
            meanings: [
              {
                partOfSpeech: 'noun',
                definitions: [
                  {
                    definition: 'the occurrence of events by chance in a happy or beneficial way',
                    example: 'Finding this beautiful cafe was pure serendipity.'
                  }
                ]
              }
            ],
            // audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/serendipity.mp3'
          };
          set({ word: mockWord, loading: false });
        } catch (error) {
          set({ error: 'Failed to fetch word', loading: false });
        }
      },

      toggleFavorite: (wordId: number) => {
        const { favorites } = get();
        if (favorites.includes(wordId)) {
          set({ favorites: favorites.filter(id => id !== wordId) });
        } else {
          set({ favorites: [...favorites, wordId] });
        }
      },

      isFavorite: (wordId: number) => {
        return get().favorites.includes(wordId);
      }
    }),
    {
      name: 'word-store', // localStorage에 저장되는 key 이름
    }
  )
);
