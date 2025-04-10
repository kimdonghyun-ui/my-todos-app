'use client'

import { useEffect } from 'react'
import { useWordStore } from '@/store/wordStore'
import WordCard from '@/components/WordCard'
import Header from '@/components/layout/Header'
import { speak } from '@/utils/utils'
import { useLevelStore } from '@/store/levelStore'

export default function Home() {
  const { word, loading, error, fetchTodayWord, toggleFavorite, isFavorite } = useWordStore();
  const { level } = useLevelStore();

  useEffect(() => {
    fetchTodayWord()
  }, [fetchTodayWord, level])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">오늘의 단어와 함께</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            하루 한 단어로 성장하는 영어
          </p>
        </div>

        {word && (
          <div className="relative">
            <div className="absolute inset-0 bg-blue-200 dark:bg-blue-900 rounded-2xl transform rotate-1 opacity-10"></div>
            <div className="relative">
              <WordCard
                word={word}
                isFavorite={isFavorite(word.id)}
                onFavoriteClick={() => toggleFavorite(word.id)}
                onAudioClick={() => speak(word.attributes.word)}
              />
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            매일 자정에 새로운 단어가 업데이트됩니다
          </p>
        </div>
      </div>
    </main>
  )
} 