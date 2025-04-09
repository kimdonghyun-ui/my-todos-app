'use client'

import { useEffect } from 'react'
import { useWordStore } from '@/store/wordStore'
import WordCard from '@/components/WordCard'
import Header from '@/components/layout/Header'

import { speak } from '@/utils/utils'
export default function Home() {
  const { word, loading, error, fetchTodayWord, toggleFavorite, isFavorite } = useWordStore()

  useEffect(() => {
    fetchTodayWord()
  }, [fetchTodayWord])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <Header />
      
      {word && (
        <WordCard
          word={word}
          isFavorite={isFavorite(word.id)}
          onFavoriteClick={() => toggleFavorite(word.id)}
          onAudioClick={() => speak(word.word)}
        />
      )}
    </main>
  )
} 