'use client';

import { useLevelStore } from '@/store/levelStore';

const levels: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard'];

// 화면에 보여줄 한글 레이블
const levelLabels: Record<'easy' | 'medium' | 'hard', string> = {
  easy: '초급',
  medium: '중급',
  hard: '고급',
};

export default function LevelSelector() {
  const { level, setLevel } = useLevelStore();

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-600 dark:text-gray-300">레벨:</span>
      <div className="flex gap-1">
        {levels.map((lv) => (
          <button
            key={lv}
            onClick={() => setLevel(lv)}
            className={`px-3 py-1 rounded-full border text-xs 
              ${level === lv 
                ? 'bg-blue-500 text-white border-blue-500' 
                : 'bg-white text-gray-600 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'} 
              transition`}
          >
            {levelLabels[lv]}
          </button>
        ))}
      </div>
    </div>
  );
}
