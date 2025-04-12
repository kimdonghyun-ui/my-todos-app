"use client";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";


interface UseAuthStatusReturn {
	isInitialized: boolean;
}

export function useAuthStatus(): UseAuthStatusReturn {
	const { setAccessToken, setUser } = useAuthStore();
	const [isInitialized, setIsInitialized] = useState(false);

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const res = await fetch("/api/auth/status", {
					method: "GET",
					credentials: "include", // ✅ 쿠키 포함하여 요청 (자동 로그인 유지)
				});

                const data: { token: string | null } = await res.json();
				setAccessToken(data.token); //Zustand에 억세스 토큰 저장!!(중요!! 억세스 토큰은 http로 서버쿠키라서 접근이 불가하기에 /api/me 통해 쿠키 불러오고 그걸 useAuth통해 불러와서 상태관리에 넣어주는 것이다. )

				// const user = getLocalStorage("userInfo") as User;
				// setUser(user); //zustand 에 user 저장
			} catch (error) {
				console.error('Auth status check failed:', error);
			} finally {
				setIsInitialized(true);
			}
		};

		checkAuth();
	}, [setAccessToken, setUser]);

	return { isInitialized };
}
