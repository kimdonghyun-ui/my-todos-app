'use client'

import { useCallback, useEffect, useState } from 'react'
import { useWordStore } from '@/store/wordStore'
import { useLevelStore } from '@/store/levelStore'
import { cn } from '@/lib/utils'
import {
  Volume2,
  VolumeX,
  Star,
  StarOff,
  ChevronRight,
  Eye,
  Pause,
  Play,
} from 'lucide-react'
import { speak } from '@/utils/utils'

export default function FlashcardPage() {
  const { words, fetchWordsByLevel, toggleFavorite, isFavorite } = useWordStore()
  const level = useLevelStore((state) => state.level)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [showDefinition, setShowDefinition] = useState(false)
  const [autoPlay, setAutoPlay] = useState(true)
  const [voiceEnabled, setVoiceEnabled] = useState(true)

  const currentWord = words?.[currentIndex]?.attributes

  const handleNext = useCallback(() => {
    if (!words) return;
    setCurrentIndex((prev) => (prev + 1) % words.length);
    setShowDefinition(false);
  }, [words]);

  const handleShowDefinition = () => {
    setShowDefinition(true)
    if (currentWord?.word && voiceEnabled) {
      speak(currentWord.word)
    }
  }

  useEffect(() => {
    fetchWordsByLevel()
  }, [fetchWordsByLevel, level])

  useEffect(() => {
    if (!autoPlay || !words || words.length === 0) return

    const timer = setTimeout(() => {
      if (showDefinition) {
        handleNext()
      } else {
        setShowDefinition(true)
        if (currentWord?.word && voiceEnabled) {
          speak(currentWord.word)
        }
      }
    }, showDefinition ? 3500 : 2000)

    return () => clearTimeout(timer)
  }, [autoPlay, showDefinition, words, currentIndex, voiceEnabled, currentWord?.word, handleNext])

  if (!words || words.length === 0 || !currentWord) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-xl mx-auto flex flex-col gap-4">
        {/* 상단 컨트롤 바 */}
        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300">
          <span>{currentIndex + 1} / {words.length}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className="p-1.5 rounded-full bg-white shadow hover:scale-105 transition"
            >
              {autoPlay ? <Pause className="w-4 h-4 text-purple-500" /> : <Play className="w-4 h-4 text-gray-400" />}
            </button>
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className="p-1.5 rounded-full bg-white shadow hover:scale-105 transition"
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4 text-indigo-500" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
            </button>
          </div>
        </div>

        {/* 카드 */}
        <div className="relative h-64 bg-white dark:bg-gray-700 rounded-2xl shadow-lg flex flex-col items-center justify-center p-6 text-center">
          <div className="text-2xl font-semibold text-purple-600 dark:text-purple-300">
            {currentWord.word} <br />
            <span className="text-base text-gray-400">{currentWord.phonetic}</span>
          </div>

          {showDefinition ? (
            <div className="mt-4 text-lg text-gray-700 dark:text-gray-200">
              {currentWord.meanings?.[0]?.definitions?.[0]?.definition || '정의 없음'}
            </div>
          ) : (
            <div className="mt-6 text-gray-400 text-sm">뜻 보기 전...</div>
          )}
        </div>

        {/* 하단 버튼들 */}
        <div className="flex justify-center flex-wrap gap-2 mt-2">
          <button
            onClick={handleShowDefinition}
            className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full shadow"
          >
            <Eye className="w-4 h-4" /> 뜻 보기
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow"
          >
            <ChevronRight className="w-4 h-4" /> 다음
          </button>

          <button
            onClick={() => toggleFavorite(words[currentIndex].id)}
            className={cn(
              'flex items-center gap-1 px-4 py-2 rounded-full shadow transition',
              isFavorite(words[currentIndex].id)
                ? 'bg-yellow-400 hover:bg-yellow-500 text-white'
                : 'bg-gray-400 hover:bg-gray-500 text-white'
            )}
          >
            {isFavorite(words[currentIndex].id) ? (
              <>
                <Star className="w-4 h-4" /> 즐겨찾기
              </>
            ) : (
              <>
                <StarOff className="w-4 h-4" /> 즐겨찾기
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
