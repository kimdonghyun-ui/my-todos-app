//utils/ (유틸리티 함수 폴더)

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// 📌 개념:

// - 작은 기능을 수행하는 순수 함수(pure function)들을 모아두는 폴더
// - 특정 비즈니스 로직에 의존하지 않음 (어디서든 독립적으로 사용 가능)
// - 상태 관리(X), API 호출(X)



export const getTitleFromPath = (path: string) => {
  const map: Record<string, string> = {
    '/': '메인',
    '/login': '로그인',
    '/profile': 'ME',
    '/register': '회원가입',
    '/dashboard': '대시보드',
    '/statistics': '통계',
    '/transactions': '지출내역',
    '/transactions/new': '지출추가',
  };

  //  '/transactions/[...slug]': '지출 내역 수정', 이 적용이 되지 않기에 아래처럼 함
  if (path.startsWith('/transactions/') && path.includes('/edit')) {
    return '지출수정';
  }

  return map[path] || '페이지';
};













export const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString("ko-KR");
  };




// ✅ 서버 응답 처리
export async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
      throw new ApiError(response.status, await response.text());
  }
  return response.json();
}

// ✅ 서버 응답 오류 처리
export class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = 'ApiError';
    }
}

// ✅ 로컬 스토리지에 데이터 저장 (제네릭 사용)
export const setLocalStorage = <T>(key: string, value: T): void => {
	try {
		const jsonValue = JSON.stringify(value);
		localStorage.setItem(key, jsonValue);
	} catch (error) {
		console.error("❌ 로컬 스토리지 저장 실패:", error);
	}
};


// ✅ 로컬 스토리지에서 데이터 가져오기 (제네릭 사용)
export const getLocalStorage = <T>(key: string): T | null => {
	try {
		const jsonValue = localStorage.getItem(key);
		return jsonValue ? (JSON.parse(jsonValue) as T) : null;
	} catch (error) {
		console.error("❌ 로컬 스토리지 데이터 불러오기 실패:", error);
		return null;
	}
};


// ✅ 로컬 스토리지에서 특정 데이터 삭제
export const removeLocalStorage = (key: string): void => {
	try {
		localStorage.removeItem(key);
	} catch (error) {
		console.error("❌ 로컬 스토리지 데이터 삭제 실패:", error);
	}
};


// ✅ 프로텍티드 라우트 체크
export const isProtectedRoute = (
    pathname: string, // 현재 페이지의 경로
    protectedRoutes: string[], // 인증이 필요한 페이지 목록
    options: {
      match?: "exact" | "startsWith";
    } = {}
  ): boolean => {
    const { match = "startsWith" } = options;
  
    return protectedRoutes.some((route) => {

      // 해당 조건을 안넣으면 모든 경로 전부 / 가 포함되어 있기때문에 전부 보호해버림 예) /transactions 등등 보호해버림
      if (route === "/") {
        return pathname === "/";
      }
  
      // exact모드인경우 = 완전히 일치하는 경우만 보호
      if (match === "exact") {
        return pathname === route;
      }
  
      // 기본은 startsWith모드 라서 하위 경로까지 보호 해줌
      return pathname.startsWith(route);
    });
  };




  export function getMoodLabel(emoji: string): string {
    const map: Record<string, string> = {
      laugh: '최고',
      smile: '좋아',
      meh: '보통',
      frown: '나빠',
      angry: '최악',
    };
    return map[emoji];
  }













  export const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // 영어
    speechSynthesis.speak(utterance);
  };



  export function getTodayKST(format: 'year' | 'month' | 'date' = 'date'): string {
    const kstDate = new Date(); // 이미 브라우저는 KST
  
    const year = kstDate.getFullYear();
    const month = String(kstDate.getMonth() + 1).padStart(2, '0');
    const day = String(kstDate.getDate()).padStart(2, '0');
  
    switch (format) {
      case 'year':
        return `${year}`;
      case 'month':
        return `${year}-${month}`;
      case 'date':
      default:
        return `${year}-${month}-${day}`;
    }
  }
  
  



  // 오늘의 단어 로컬스토리지에 키 쌓이는거 삭제하는 함수
  export function clearOldWordCache() {
    const today = getTodayKST(); // ex: '2025-04-10'
    const levels = ['easy', 'medium', 'hard'];
  
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (!key) continue;
  
      const parts = key.split('-'); // e.g., ['easy', '13', '2025', '04', '08']
      const isLevelKey = levels.includes(parts[0]);
  
      if (isLevelKey && parts.length >= 4) {
        const datePart = parts.slice(-3).join('-'); // '2025-04-08'
        if (datePart !== today) {
          localStorage.removeItem(key);
          console.log(`🧹 오래된 캐시 삭제됨: ${key}`);
        }
      }
    }
  }
  
  



export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, showSymbol = true): string {
  return new Intl.NumberFormat('ko-KR', {
    style: showSymbol ? 'currency' : 'decimal',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(amount)
} 