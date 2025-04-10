export enum Level {
    easy = 'easy',
    medium = 'medium',
    hard = 'hard'
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
  attributes: {
    word: string
    phonetic: string
    meanings: Meaning[],
  };

}

export interface WordCardProps {
  word: Word
  isFavorite: boolean
  onFavoriteClick: () => void
  onAudioClick: () => void
}



