'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/layout/Header'
import WordCard from '@/components/WordCard'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { speak } from '@/utils/utils'

interface Word {
  id: number
  word: string
  phonetic: string
  meaning: string
  sentence: string
  date: string
}

export default function Home() {
  const [word, setWord] = useState<Word | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 임시 데이터 - 나중에 API로 대체
  const mockWord: Word = {
    id: 1,
    word: 'serendipity',
    phonetic: '[ˌserənˈdɪpəti]',
    meaning: 'the occurrence of events by chance in a happy or beneficial way',
    sentence: 'Finding this beautiful cafe was pure serendipity.',
    date: new Date().toISOString().split('T')[0]
  }

  useEffect(() => {
    // 임시 데이터 설정 - 나중에 API 호출로 대체
    setTimeout(() => {
      setWord(mockWord)
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite)
    // TODO: API 호출로 즐겨찾기 상태 저장
  }

  const handleAudioClick = () => {
    if (word?.word) {
      // 사용 예시
      speak(word.word);


    }
  }

  const handlePreviousWord = () => {
    // TODO: API 호출로 이전 날짜의 단어 가져오기
    console.log('Previous word')
  }

  const handleNextWord = () => {
    // TODO: API 호출로 다음 날짜의 단어 가져오기
    console.log('Next word')
  }

  if (isLoading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (error || !word) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <p className="text-gray-600">{error || '오늘의 단어가 없습니다.'}</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <WordCard
          word={word}
          isFavorite={isFavorite}
          onFavoriteClick={handleFavoriteClick}
          onAudioClick={handleAudioClick}
        />

        <div className="flex justify-between mt-8 pt-6 border-t">
          <button
            onClick={handlePreviousWord}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Previous word</span>
          </button>
          <button
            onClick={handleNextWord}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            <span>Next word</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </main>
  )
} 