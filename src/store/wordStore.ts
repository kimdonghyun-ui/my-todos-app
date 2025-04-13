import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Word } from '@/types/word';
import { fetchApi } from '@/lib/fetchApi';
import { getTodayKST } from '@/utils/utils';
import { useAuthStore } from './authStore';

interface WordState {
  word: Word | null;
  words: Word[] | null;
  loading: boolean;
  error: string | null;
  favorites: number[];
  fetchTodayWord: (level:string,userId:number | null) => Promise<void>;
  fetchWordsByLevel: (level:string) => Promise<void>;
  toggleFavorite: (wordId: number) => Promise<void>;
  fetchFavoritesFromServer: (userId:number | null) => Promise<void>;
  isFavorite: (wordId: number) => boolean;
  reset: () => void;
}

interface WordFavorite {
  id: number;
  attributes: {
    word: {
      data: {
        id: number;
      };
    };
  };
}

export const useWordStore = create<WordState>()(
  persist(
    (set, get) => ({
      word: null,
      words: null,
      loading: false,
      error: null,
      favorites: [],


      //fetchTodayWord = 오늘의 데이터 호출
      fetchTodayWord: async (level,userId) => {
        if (!level || !userId) return;
        set({ loading: true, error: null });
        try {
          const today = getTodayKST(); // 오늘 날짜 가져오기 (ex: 2025-04-10)
          const cacheKey = `${level}-${userId}-${today}`; //레벨-유저아이디-오늘날짜 (ex: easy(level)-13(id)-2025-04-10(today))

          // 로컬스토리지에서 cacheKey 가 있는지 여부 확인
          const cached = localStorage.getItem(cacheKey);
          if (cached) { // 있는경우 그대로 오늘의 단어 세팅
            set({ word: JSON.parse(cached) });
            return; // 오늘의단어가 이미 세팅 되어있기때문에 여기서 코드 멈춤
          }
          //없는경우 아래 코드로 진행

          // API 요청(쿼리값으로 level를 줘서 해당 레벨의 데이터 호출)
          const response = await fetchApi<{ data: Word[] }>(`/words?filters[level][$eq]=${level}&populate[meanings][populate]=definitions`, { method: 'GET' });
          const data = response.data;

          if (Array.isArray(data) && data.length > 0) { // 위에서 응답한 데이터가 배열이고 길이가 0보다 크면 성립되는 조건
            const randomIndex = Math.floor(Math.random() * data.length); // 데이터 갯수만큼 랜덤 인덱스 생성
            const randomWord = data[randomIndex]; // 랜덤숫자 나온거로 데이터 중 해당 인덱스 번째 데이터 선택

            localStorage.setItem(cacheKey, JSON.stringify(randomWord)); // randomWord를 로컬스토리지에 저장
            set({ word: randomWord });// randomWord를 스토어 스테이트에도 저장
          }
        } catch {
          set({ error: 'Failed to fetch word' });
        } finally {
          set({ loading: false });
        }
      },

      //fetchWordsByLevel = 레벨별 단어 목록 호출
      fetchWordsByLevel: async (level) => {
        if (!level) return;
        set({ loading: true, error: null });
        try {
          // // API 요청
          const response = await fetchApi<{ data: Word[] }>(`/words?filters[level][$eq]=${level}&populate[meanings][populate]=definitions`, { method: 'GET' });
          const data = response.data;
          set({ words: data });
        } catch {
          set({ error: '단어 목록 불러오기 실패' });
        } finally {
          set({ loading: false });
        }
      },
      

      //toggleFavorite = 즐겨찾기 추가 및 삭제
      toggleFavorite: async (wordId: number) => {
        const { favorites } = get();
        const isAlreadyFavorite = favorites.includes(wordId); // favorites 배열에 wordId가 있는지 확인
      
        try {
          if (isAlreadyFavorite) { // 즐겨찾기 이미 있는경우
            // 1. 해당 wordId와 연결된 favorite의 id를 먼저 찾기
            const response = await fetchApi<{ data: WordFavorite[] }>(`/word-favorites?filters[word][id][$eq]=${wordId}`);
            const favoriteId = response.data[0]?.id;
      
            if (favoriteId) {
              // 2. 해당 즐겨찾기 ID로 삭제 요청
              await fetchApi(`/word-favorites/${favoriteId}`, {
                method: 'DELETE',
              });
              set({ favorites: favorites.filter((id) => id !== wordId) });
            }
          } else { // 즐겨찾기 없는경우
            // 추가
            await fetchApi('/word-favorites', {
              method: 'POST',
              body: JSON.stringify(
                { data: 
                  { 
                    word: wordId,
                    users_permissions_user: useAuthStore.getState().user?.id
                  } 
                }
              ),
            });
            set({ favorites: [...favorites, wordId] });
          }
        } catch (err) {
          console.error('즐겨찾기 처리 실패', err);
        }
      },
      
      //fetchFavoritesFromServer = 즐겨찾기 목록 호출
      fetchFavoritesFromServer: async (userId) => {
        if (!userId) return;
        set({ loading: true, error: null });
        try {
          const response = await fetchApi<{ data: WordFavorite[] }>(`/word-favorites?filters[users_permissions_user][id][$eq]=${userId}&populate=word`);
          const ids = response.data.map(item => item.attributes.word.data.id);
          set({ favorites: ids });
        } catch {
          set({ error: '즐겨찾기 불러오기 실패', loading: false });
        } finally {
          set({ loading: false });
        }
      },

      //isFavorite = 즐겨찾기 여부 확인
      isFavorite: (wordId: number) => {
        return get().favorites.includes(wordId);
      },


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
      name: 'word-store',
    }
  )
);
