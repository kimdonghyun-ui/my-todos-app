//utils/ (유틸리티 함수 폴더)

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