export enum Level {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export interface Definition {
  definition: string
  example?: string
}

export interface Meaning {
  partOfSpeech: string
  definitions: Definition[]
}

export interface Word {
  id: number
  word: string
  phonetic: string
  meanings: Meaning[]
  audioUrl?: string
}

export interface WordCardProps {
  word: Word
  isFavorite: boolean
  onFavoriteClick: () => void
  onAudioClick: () => void
}



