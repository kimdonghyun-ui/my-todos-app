import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Word, Level } from '@/types/word';
import { fetchApi } from '@/lib/fetchApi';
import { useLevelStore } from './levelStore';
import { getTodayKST } from '@/utils/utils';

interface WordState {
  word: Word | null;
  words: Word[] | null;
  loading: boolean;
  error: string | null;
  favorites: number[];
  fetchTodayWord: (level?: Level) => Promise<void>;
  fetchWordsByLevel: (level?: Level) => Promise<void>;
  toggleFavorite: (wordId: number) => Promise<void>;   // 기존엔 동기 함수였음
  fetchFavoritesFromServer: () => Promise<void>;       // 서버에서 즐겨찾기 불러오기
  isFavorite: (wordId: number) => boolean;
  reset: () => void;
}

export const useWordStore = create<WordState>()(
  persist(
    (set, get) => ({
      word: null,
      words: null,
      loading: false,
      error: null,
      favorites: [],

      fetchTodayWord: async () => {
        set({ loading: true, error: null });
        try {


          // 날짜 가져오기 (오늘 기준)
          const today = getTodayKST(); // ex: 2025-04-10
          const level = useLevelStore.getState().level;// 레벨 가져오기
          const cacheKey = `${level}-${today}`; // ex: easy-2025-04-10

          // 로컬스토리지에서 cacheKey 가 있는지 여부 확인
          const cached = localStorage.getItem(cacheKey);
          if (cached) {// 있는경우
            set({ word: JSON.parse(cached), loading: false });
            return;// 있는경우에는 오늘의단어가 이미 세팅 되어있기때문에 여기서 코드 멈춤
          }
          //없는경우 아래 코드로 진행


          // API 요청
          const response = await fetchApi<{ data: Word[] }>(`/words?filters[level][$eq]=${level}&populate[meanings][populate]=definitions`, { method: 'GET' });
          
          const data = response.data;
          if (Array.isArray(data) && data.length > 0) {
            const randomIndex = Math.floor(Math.random() * data.length);
            const randomWord = data[randomIndex];
            // ✅ 저장(여기에서 오늘의 키로 저장 > 오늘중에는 새로고침해도 위에서 조건 성립으로 인해 코드가 막히기때문에 오늘중으로는 다시 오늘의 단어가 세팅되지 않음)
            localStorage.setItem(cacheKey, JSON.stringify(randomWord));
  
            set({ word: randomWord, loading: false });
          }
          
          console.log('현재 단어:', useWordStore.getState().word);

        } catch (error) {
          set({ error: 'Failed to fetch word', loading: false });
        }
      },




      fetchWordsByLevel: async () => {
        set({ loading: true, error: null });
        try {
          const level = useLevelStore.getState().level;// 레벨 가져오기
          // if (!level) {return;}
          // // API 요청
          const response = await fetchApi<{ data: Word[] }>(`/words?filters[level][$eq]=${level}&populate[meanings][populate]=definitions`, { method: 'GET' });
          

          const data = response.data;
          if (Array.isArray(data)) {
            set({ words: response.data, loading: false });
          }
        } catch (error) {
          set({ error: '단어 목록 불러오기 실패', loading: false });
        } finally {
          set({ loading: false });
        }
      },
      
      toggleFavorite: async (wordId: number) => {
        const { favorites } = get();
        const isAlreadyFavorite = favorites.includes(wordId);
      
        try {
          if (isAlreadyFavorite) {
            // 1. 해당 wordId와 연결된 favorite의 id를 먼저 찾기
            const res = await fetchApi<{ data: any[] }>(
              `/word-favorites?filters[word][id][$eq]=${wordId}`
            );
            const favoriteId = res.data[0]?.id;
      
            if (favoriteId) {
              // 2. 해당 즐겨찾기 ID로 삭제 요청
              await fetchApi(`/word-favorites/${favoriteId}`, {
                method: 'DELETE',
              });
              set({ favorites: favorites.filter((id) => id !== wordId) });
            }
          } else {
            // 추가
            await fetchApi('/word-favorites', {
              method: 'POST',
              body: JSON.stringify({ data: { word: wordId } }),
            });
            set({ favorites: [...favorites, wordId] });
          }
        } catch (err) {
          console.error('즐겨찾기 처리 실패', err);
        }
      },
      
      fetchFavoritesFromServer: async () => {
        try {
          const response = await fetchApi<{ data: any[] }>('/word-favorites?populate=word');
          const ids = response.data.map(item => item.attributes.word.data.id);
          set({ favorites: ids });
        } catch (err) {
          console.error('즐겨찾기 불러오기 실패', err);
        }
      },
      



      // toggleFavorite: (wordId: number) => {
      //   const { favorites } = get();
      //   if (favorites.includes(wordId)) {
      //     set({ favorites: favorites.filter(id => id !== wordId) });
      //   } else {
      //     set({ favorites: [...favorites, wordId] });
      //   }
      // },

      isFavorite: (wordId: number) => {
        return get().favorites.includes(wordId);
      },

      // ✅ 상태 초기화 함수 추가
      reset: () => {
        set({
          word: null,
          words: null,
          loading: false,
          error: null,
          favorites: [],
        });
        useWordStore.persist.clearStorage();
      },

    }),
    {
      name: 'word-store', // localStorage에 저장되는 key 이름
    }
  )
);
