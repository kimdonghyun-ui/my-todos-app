"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter, usePathname } from "next/navigation";
import { protectedRoutes } from "@/lib/constants/auth";
import { isProtectedRoute } from "@/utils/utils";
import { useAuthStatus } from '@/hooks/useAuthStatus';
import { performLogout } from "@/lib/auth";
import { useThemeStore } from "@/store/themeStore";
import { Toaster } from 'react-hot-toast';

import Header from "./Header";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const accessToken = useAuthStore((state) => state.accessToken);
    const router = useRouter();
    const pathname = usePathname();
    const isDarkMode = useThemeStore((state) => state.isDarkMode);

  const { isInitialized } = useAuthStatus();



  useEffect(() => {
    
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);



  useEffect(() => {
    if (!isInitialized) return; // ✅ 초기화 안됐으면 무시

    
    const needsAuth = isProtectedRoute(pathname, protectedRoutes, { match: "startsWith" });

    if (!accessToken && needsAuth) {
        performLogout();
        setTimeout(() => {
            router.push("/login");
        }, 10);
    }
  }, [accessToken, pathname, router, isInitialized]);


  if (!isInitialized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-2 text-gray-700">
     
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  // 로그인 페이지에서는 헤더를 표시하지 않음
  const showHeader = pathname !== '/login';

  return (
    <>
      {showHeader && <Header showBackButton />}
      {children}
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}


