import { useCallback } from 'react';

import { useRouter } from 'next/navigation';
import { LoginCredentials, RegisterCredentials, ProfileUpdateCredentials } from '@/types/auth';

import { useAuthStore } from "@/store/authStore";
import { loginApi, registerApi, profileUpdateApi } from '@/lib/api';
import { toast } from 'react-hot-toast';

// const API_URL = 'http://localhost:1337/api';

interface UseAuthReturn {
  handleLogin: (credentials: LoginCredentials) => Promise<void>;
  handleRegister: (credentials: RegisterCredentials) => Promise<void>;
  handleProfileUpdate: (id: string, credentials: ProfileUpdateCredentials) => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const { setAccessToken, setUser, setIsLoading } = useAuthStore();

  // ✅ 로그인 로직 (API 호출 + Zustand 상태 업데이트)
  const handleLogin = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
        const response = await loginApi(credentials); // ✅ API 호출
        const { jwt, user } = response
        setAccessToken(jwt);//zustand 에 accessToken 저장
        setUser(user);//zustand 에 user 저장
        // setLocalStorage<User>("userInfo", user);//로컬스토리지에 user 저장

        // ✅ 2. Next.js API 호출하여 쿠키 저장 (쿠키 이름을 동적으로 전달)
        const resCookie = await fetch("/api/set-cookie", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "accessToken", // ✅ 원하는 쿠키 이름 설정
                value:jwt,
                action: "set",
            }),
        });

        if (!resCookie.ok) {
            console.warn("accessToken 쿠키 설정 실패");
        }
        // alert("로그인 성공");
        toast.success('로그인 성공!');
        router.replace("/");

    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setAccessToken, setUser, router]);




  // ✅ 회원가입(성공하면 로그인 자동시도)
  const handleRegister = useCallback(async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    try {
        await registerApi(credentials); // ✅ API 호출
        toast.success('회원가입 성공!');
        await handleLogin({ 
            identifier: credentials.email,
            password: credentials.password 
        });
    } catch (error) {
      toast.error('회원가입 실패!');
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, handleLogin]);




  // ✅ 프로필 정보 업데이트
  const handleProfileUpdate = useCallback(async (id: string, credentials: ProfileUpdateCredentials) => {
    setIsLoading(true);
    try {
        const user = await profileUpdateApi(id,credentials); // ✅ API 호출
        toast.success('프로필 업데이트 성공!');
        setUser(user);//zustand 에 user 저장
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  }, [setUser, setIsLoading]);

  return {
    handleLogin,
    handleRegister,
    handleProfileUpdate,
  };
}
