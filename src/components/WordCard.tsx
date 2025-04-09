import { motion } from 'framer-motion'
import { Bookmark, Volume2 } from 'lucide-react'
import { WordCardProps } from '@/types/word'


const WordCard = ({ word, isFavorite, onFavoriteClick, onAudioClick }: WordCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">{word.word}</h1>
          <p className="text-gray-500 mt-1">{word.phonetic}</p>
        </div>
        <button
          onClick={onFavoriteClick}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <Bookmark
            className={`h-6 w-6 ${isFavorite ? 'text-blue-500 fill-blue-500' : 'text-gray-600'}`}
          />
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Meaning</h2>
          <p className="text-gray-600">{word.meaning}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Example</h2>
          <p className="text-gray-600 italic">"{word.sentence}"</p>
        </div>

        <button
          onClick={onAudioClick}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Volume2 className="h-5 w-5" />
          <span>Listen to pronunciation</span>
        </button>
      </div>
    </motion.div>
  )
}

export default WordCard 