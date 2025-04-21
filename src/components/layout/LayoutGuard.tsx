"use client";

import { useAuthStatus } from '@/hooks/useAuthStatus';
import { Toaster } from 'react-hot-toast';

export default function LayoutGuard({
  children,
}: {
  children: React.ReactNode;
}) {

    // isInitialized = 인증 상태 확인 (확인전까지는 false이다가 확인되면 true로 변경됨) + 아래 두줄
    //(인증ok상황 = accessToken 을 httpOnly 쿠키에서 불러오고 그걸 스토어에 넣어줘서 로그인 상태 유지)
    //(인증no상황 = accessToken null)
    const { isInitialized } = useAuthStatus();


    // 인증 상태 확인 전까지 로딩 스피너 표시
    if (!isInitialized) {
        return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        );
    }

  return (// 인증 상태 확인 후 아래 내용 노출
    <>
        {children}
        <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}


