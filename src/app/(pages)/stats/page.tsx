'use client';

import { useEffect } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { MoodIcon } from '@/components/MoodIcon';
import { useMoodStore } from '@/store/moodStore';
import { useAuthStore } from '@/store/authStore';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { getMoodLabel } from '@/utils/utils';

const COLORS = ['#FFBB28', '#00C49F', '#FF8042', '#8884D8', '#FF6B6B'];

interface PieDataItem {
  name: string;
  value: number;
}

export default function StatsPage() {
  const { stats, isLoading, error, fetchStats } = useMoodStore();
  const { user } = useAuthStore();
  const userId = `${user?.id}`
  useEffect(() => {
    if (userId) {
      fetchStats(userId);
    }
  }, [fetchStats, userId]);

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

  if (!stats || stats.total === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center max-w-2xl"
        >
          <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-4">
            통계를 표시하기 위한 데이터가 부족해요
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            더 많은 기분을 기록해보세요!
          </p>
        </motion.div>
      </div>
    );
  }

  const pieData: PieDataItem[] = Object.entries(stats.byEmoji).map(([emoji, count]) => ({
    name: getMoodLabel(emoji),
    value: count,
  }));

  const barData = stats.recentDays.map((day) => ({
    date: format(new Date(day.date), 'M/d', { locale: ko }),
    emoji: day.emoji,
  }));

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
            기분 통계
          </h1>

          <div className="grid grid-cols-1 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-purple-50 dark:bg-gray-700 p-6 rounded-xl shadow-sm"
            >
              <h2 className="text-lg font-semibold mb-4 text-purple-600 dark:text-purple-400">
                감정별 비율
              </h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }: { name: string; percent: number }) => 
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-purple-50 dark:bg-gray-700 p-6 rounded-xl shadow-sm"
            >
              <h2 className="text-lg font-semibold mb-4 text-purple-600 dark:text-purple-400">
                최근 7일 감정 변화
              </h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <XAxis dataKey="date" stroke="#8884d8" />
                    <YAxis stroke="#8884d8" />
                    <Tooltip />
                    <Bar dataKey="emoji" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-purple-50 dark:bg-gray-700 p-6 rounded-xl shadow-sm"
            >
              <h2 className="text-lg font-semibold mb-4 text-purple-600 dark:text-purple-400">
                가장 자주 느낀 감정
              </h2>
              <div className="flex items-center justify-center gap-4">
                <div className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-sm">
                  <MoodIcon
                    emoji={stats.mostFrequent}
                    size={48}
                    isSelected={true}
                  />
                </div>
                <p className="text-2xl font-semibold text-purple-600 dark:text-purple-400">
                  {stats.mostFrequent}
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 