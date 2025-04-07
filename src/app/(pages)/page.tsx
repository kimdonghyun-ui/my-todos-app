'use client';

import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { MoodIcon } from '@/components/MoodIcon';
import { useMoodStore } from '@/store/moodStore';
import { useAuthStore } from '@/store/authStore';
import { MoodEmoji } from '@/types/mood';
import { motion } from 'framer-motion';

const MOODS: MoodEmoji[] = ['laugh', 'smile', 'meh', 'frown', 'angry'];

export default function HomePage() {
  const { todayMood, isLoading, error, fetchMoodByDate, saveMood, updateMood } = useMoodStore();
  const { user } = useAuthStore();
  const [selectedEmoji, setSelectedEmoji] = useState<MoodEmoji | null>(null);
  const [memo, setMemo] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));



  useEffect(() => {
    if (!user?.id) return;
    fetchMoodByDate(selectedDate, String(user.id));
  }, [selectedDate, fetchMoodByDate, user?.id]);

  useEffect(() => {
    if (todayMood) {
      setSelectedEmoji(todayMood.attributes.emoji);
      setMemo(todayMood.attributes.memo);
    } else {
      setSelectedEmoji(null);
      setMemo('');
    }
  }, [todayMood]);

  const handleSave = async () => {
    if (!selectedEmoji) return;
    
    if (todayMood) {
      await updateMood(todayMood.id, selectedEmoji, memo, `${user?.id}`);
    } else {
      await saveMood(selectedEmoji, memo, selectedDate, `${user?.id}`);
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
        >
          <h1 className="text-2xl font-bold mb-4 text-center text-purple-600 dark:text-purple-400">
            오늘의 기분은 어때요?
          </h1>
          
          <div className="mb-6">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-gray-700 text-purple-600 dark:text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <p className="text-center text-gray-600 dark:text-gray-400 mb-8 text-lg">
            {format(parseISO(selectedDate), 'yyyy년 M월 d일', { locale: ko })}
          </p>

          <div className="flex justify-center gap-6 mb-8">
            {MOODS.map((emoji) => (
              <motion.button
                key={emoji}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedEmoji(emoji)}
                className={`p-3 rounded-full transition-all duration-200 ${
                  selectedEmoji === emoji
                    ? 'bg-purple-100 dark:bg-purple-900 shadow-lg'
                    : 'hover:bg-purple-50 dark:hover:bg-gray-700'
                }`}
              >
                <MoodIcon
                  emoji={emoji}
                  size={36}
                  isSelected={selectedEmoji === emoji}
                />
              </motion.button>
            ))}
          </div>

          <div className="mb-8">
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="오늘의 기분을 한 줄로 표현해보세요"
              className="w-full px-4 py-3 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={!selectedEmoji || isLoading}
            className={`w-full py-4 rounded-xl text-white font-medium text-lg transition-all duration-200 ${
              selectedEmoji
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                : 'bg-gray-300 dark:bg-gray-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? '저장 중...' : '기분 기록하기'}
          </motion.button>
        </motion.div>
      </main>
    </div>
  );
}
