export type MoodEmoji = 'laugh' | 'smile' | 'meh' | 'frown' | 'angry' ;

export interface Mood {
  id: number;
  attributes: {
    emoji: MoodEmoji;
    memo: string;
    date: string;
    user: {
      data: {
        id: number;
        attributes: {
          username: string;
        };
      };
    };
  };
}

export interface MoodStats {
  total: number;
  byEmoji: Record<MoodEmoji, number>;
  recentDays: Array<{
    date: string;
    emoji: MoodEmoji;
  }>;
  mostFrequent: MoodEmoji;
} 