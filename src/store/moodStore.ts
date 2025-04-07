import { create } from 'zustand';
import { Mood, MoodEmoji } from '@/types/mood';
import { fetchApi } from '@/lib/fetchApi';

interface MoodState {
  todayMood: Mood | null;
  moods: Mood[];
  stats: {
    total: number;
    byEmoji: Record<MoodEmoji, number>;
    recentDays: Array<{ date: string; emoji: MoodEmoji }>;
    mostFrequent: MoodEmoji;
  } | null;
  isLoading: boolean;
  error: string | null;
  fetchMoodByDate: (date: string, userId: string) => Promise<void>;
  fetchMoods: (userId: string) => Promise<void>;
  fetchStats: (userId: string) => Promise<void>;
  saveMood: (emoji: MoodEmoji, memo: string, date: string, userId: string) => Promise<void>;
  updateMood: (id: number, emoji: MoodEmoji, memo: string, userId: string) => Promise<void>;
}

export const useMoodStore = create<MoodState>((set, get) => ({
  todayMood: null,
  moods: [],
  stats: null,
  isLoading: false,
  error: null,

  fetchMoodByDate: async (date: string, userId: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetchApi(`/moods?filters[date][$eq]=${date}&filters[userId][$eq]=${userId}`);
      set({ todayMood: response.data[0] || null });
    } catch (error) {
      set({ error: '기분을 불러오는데 실패했습니다.' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMoods: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetchApi(`/moods?sort=date:desc&filters[userId][$eq]=${userId}`);
      set({ moods: response.data });
    } catch (error) {
      set({ error: '기분 기록을 불러오는데 실패했습니다.' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchStats: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetchApi(`/moods?filters[userId][$eq]=${userId}`);
      const moods = response.data;
      
      // 통계 계산
      const byEmoji = moods.reduce((acc: Record<MoodEmoji, number>, mood: Mood) => {
        acc[mood.attributes.emoji] = (acc[mood.attributes.emoji] || 0) + 1;
        return acc;
      }, {} as Record<MoodEmoji, number>);

      const mostFrequent = Object.entries(byEmoji)
        .sort(([, a], [, b]) => b - a)[0][0] as MoodEmoji;

      const recentDays = moods
        .sort((a: Mood, b: Mood) => 
          new Date(b.attributes.date).getTime() - new Date(a.attributes.date).getTime()
        )
        .slice(0, 7)
        .map((mood: Mood) => ({
          date: mood.attributes.date,
          emoji: mood.attributes.emoji,
        }));

      set({
        stats: {
          total: moods.length,
          byEmoji,
          recentDays,
          mostFrequent,
        },
      });
    } catch (error) {
      set({ error: '통계 데이터를 불러오는데 실패했습니다.' });
    } finally {
      set({ isLoading: false });
    }
  },

  saveMood: async (emoji: MoodEmoji, memo: string, date: string, userId: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetchApi('/moods', {
        method: 'POST',
        body: JSON.stringify({
          data: {
            emoji,
            memo,
            date,
            userId
          },
        }),
      });
      set({ todayMood: response.data });
    } catch (error) {
      set({ error: '기분을 저장하는데 실패했습니다.' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateMood: async (id: number, emoji: MoodEmoji, memo: string, userId: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetchApi(`/moods/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          data: {
            emoji,
            memo,
            userId
          },
        }),
      });
      set({ todayMood: response.data });
    } catch (error) {
      set({ error: '기분을 수정하는데 실패했습니다.' });
    } finally {
      set({ isLoading: false });
    }
  },
})); 