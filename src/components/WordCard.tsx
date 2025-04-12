'use client'

import { Word } from '@/types/word'
import { HeartIcon, SpeakerWaveIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'

interface WordCardProps {
  word: Word
  isFavorite: boolean
  onFavoriteClick: () => void
  onAudioClick: () => void
}

export default function WordCard({ word, isFavorite, onFavoriteClick, onAudioClick }: WordCardProps) {
  return (
    <div className="w-full max-w-2xl p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl backdrop-blur-sm bg-opacity-90">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
            {word.attributes.word}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">{word.attributes.phonetic}</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onAudioClick} 
            className="p-3 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-full transition-colors duration-200"
          >
            <SpeakerWaveIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </button>
          <button 
            onClick={onFavoriteClick} 
            className="p-3 hover:bg-pink-50 dark:hover:bg-pink-900/50 rounded-full transition-colors duration-200"
          >
            {isFavorite ? (
              <HeartIconSolid className="w-6 h-6 text-pink-500 dark:text-pink-400" />
            ) : (
              <HeartIcon className="w-6 h-6 text-gray-400 dark:text-gray-500" />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {word.attributes.meanings.map((meaning, index) => (
          <div key={index} className="border-t border-gray-100 dark:border-gray-700 pt-6">
            <div className="flex items-center mb-4">
              <span className="px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/50 rounded-full">
                {meaning.partOfSpeech}
              </span>
            </div>
            <ul className="space-y-4">
              {meaning.definitions.map((def, defIndex) => (
                <li key={defIndex} className="group">
                  <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
                    {def.definition}
                  </p>
                  {def.example && (
                    <div className="text-gray-600 dark:text-gray-300 mt-2 pl-4 border-l-2 border-gray-200 dark:border-gray-700 italic group-hover:border-blue-300 dark:group-hover:border-blue-500 transition-colors duration-200">
                      &ldquo;{def.example}&rdquo;
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
} 