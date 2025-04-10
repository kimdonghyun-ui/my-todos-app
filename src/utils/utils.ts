//utils/ (유틸리티 함수 폴더)

// import { MoodEmoji } from "@/types/mood";

// 📌 개념:

// - 작은 기능을 수행하는 순수 함수(pure function)들을 모아두는 폴더
// - 특정 비즈니스 로직에 의존하지 않음 (어디서든 독립적으로 사용 가능)
// - 상태 관리(X), API 호출(X)


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
      if (route === "/") {
        return pathname === "/";
      }
  
      if (match === "exact") {
        return pathname === route;
      }
  
      // 기본은 startsWith
      return pathname.startsWith(route);
    });
  };


  export const getTitleFromPath = (path: string) => {
    const map: Record<string, string> = {
      '/': 'My Daylio',
      '/login': '로그인',
      '/profile': '내 프로필',
      '/register': '회원가입',
    };
    return map[path] || '페이지';
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



  export function getTodayKST(): string {
    const now = new Date();
    // UTC -> KST (+9시간)
    const offset = 9 * 60 * 60 * 1000;
    const kstDate = new Date(now.getTime() + offset);
    return kstDate.toISOString().split('T')[0];
  }



  // 오늘의 단어 로컬스토리지에 키 쌓이는거 삭제하는 함수
  export function clearOldWordCache() {
    const today = getTodayKST(); // ✅ KST 날짜로 비교!
    const levels = ['easy', 'medium', 'hard'];
  
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
  
      // "easy-2025-04-10" 같은 형식인 경우만 필터
      const isLevelKey = levels.some((level) => key.startsWith(level + '-'));
  
      if (isLevelKey) {
        const datePart = key.split('-').slice(1).join('-'); // ✅ 여기 수정
        if (datePart !== today) {
          localStorage.removeItem(key);
          console.log(`🧹 오래된 캐시 삭제됨: ${key}`);
        }
      }
    }
  }
  