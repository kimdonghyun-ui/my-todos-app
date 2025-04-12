'use client'

import { useEffect } from 'react'
import { useWordStore } from '@/store/wordStore'
import { useLevelStore } from '@/store/levelStore'
import { speak } from '@/utils/utils'
import {
  Volume2,
  Trash2
} from 'lucide-react'

export default function FavoritesPage() {
  const { favorites, fetchFavoritesFromServer, toggleFavorite } = useWordStore()
  const { words, fetchWordsByLevel } = useWordStore()
  const level = useLevelStore((state) => state.level)

  
  useEffect(() => {
    fetchFavoritesFromServer()
  }, [fetchFavoritesFromServer])

  useEffect(() => {
    fetchWordsByLevel()
  }, [fetchWordsByLevel, level])

  


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">⭐ 즐겨찾기 단어</h1>
        <ul className="space-y-4">
          {words
            ?.filter((w) => favorites.includes(w.id))
            .map((word) => (
              <li key={word.id} className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow-md">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-lg font-semibold text-purple-600 dark:text-purple-300">
                      {word.attributes.word}
                      <span className="ml-2 text-sm text-gray-500">{word.attributes.phonetic}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {word.attributes.meanings[0]?.definitions[0]?.definition || '정의 없음'}
                    </p>
                  </div>
      
                  <div className="flex gap-2">
                    <button
                      onClick={() => speak(word.attributes.word)}
                      className="p-1.5 rounded-full bg-white shadow hover:scale-105 transition"
                    >
                      <Volume2 className="w-4 h-4 text-indigo-500" />
                    </button>
                    <button
                      onClick={() => toggleFavorite(word.id)}
                      className="p-1.5 rounded-full bg-white shadow hover:scale-105 transition"
                    >
                      <Trash2 className="w-4 h-4 text-indigo-500" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
        </ul>

        {favorites.length === 0 && (
          <div className="text-center text-gray-500 mt-12">아직 즐겨찾기한 단어가 없습니다.</div>
        )}
      </div>
    </div>
  )
}
