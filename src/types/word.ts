export interface Word {
    id: number
    word: string
    phonetic: string
    meaning: string
    sentence: string
}
  
export interface WordCardProps {
    word: Word
    isFavorite: boolean
    onFavoriteClick: () => void
    onAudioClick: () => void
}



