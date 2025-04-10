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
    <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-3xl font-bold">{word.attributes.word}</h2>
        <div className="flex gap-2">
          <button onClick={onAudioClick} className="p-2 hover:bg-gray-100 rounded-full">
            <SpeakerWaveIcon className="w-6 h-6" />
          </button>
          <button onClick={onFavoriteClick} className="p-2 hover:bg-gray-100 rounded-full">
            {isFavorite ? (
              <HeartIconSolid className="w-6 h-6 text-red-500" />
            ) : (
              <HeartIcon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-600">{word.attributes.phonetic}</p>
      </div>

      <div className="space-y-4">
        {word.attributes.meanings.map((meaning, index) => (
          <div key={index} className="border-t pt-4">
            <p className="text-lg font-semibold text-gray-800">{meaning.partOfSpeech}</p>
            <ul className="mt-2 space-y-2">
              {meaning.definitions.map((def, defIndex) => (
                <li key={defIndex} className="text-gray-700">
                  {def.definition}
                  {def.example && (
                    <p className="text-gray-500 italic mt-1">"{def.example}"</p>
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