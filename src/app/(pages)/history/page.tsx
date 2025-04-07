'use client';

import { useEffect } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { MoodIcon } from '@/components/MoodIcon';
import { useMoodStore } from '@/store/moodStore';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';

export default function HistoryPage() {
  const { moods, isLoading, error, fetchMoods } = useMoodStore();
  const { user } = useAuthStore();
  // const userId = `${user?.id}`

  useEffect(() => {
    if (!user?.id) return;
    fetchMoods(`${user?.id}`);
  }, [fetchMoods, user?.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 dark:border-purple-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (moods.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center max-w-2xl"
        >
          <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-4">
            아직 기록된 기분이 없어요
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            첫 번째 기분을 기록해보세요!
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
        >
          <h1 className="text-2xl font-bold mb-6 text-center text-purple-600 dark:text-purple-400">
            기분 기록
          </h1>
          
          <div className="space-y-4">
            {moods.map((mood, index) => (
              <motion.div
                key={mood.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 bg-purple-50 dark:bg-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm">
                  <MoodIcon
                    emoji={mood.attributes.emoji}
                    size={24}
                    isSelected={true}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-purple-600 dark:text-purple-400">
                    {format(new Date(mood.attributes.date), 'yyyy년 M월 d일', { locale: ko })}
                  </p>
                  <p className="truncate text-gray-700 dark:text-gray-200">
                    {mood.attributes.memo}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
} 