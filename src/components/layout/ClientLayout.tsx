"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter, usePathname } from "next/navigation";
import { protectedRoutes } from "@/lib/constants/auth";
import { isProtectedRoute } from "@/utils/utils";
import { useAuthStatus } from '@/hooks/useAuthStatus';
import { performLogout } from "@/lib/auth";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const accessToken = useAuthStore((state) => state.accessToken);
    const router = useRouter();
    const pathname = usePathname();
    const user = useAuthStore((state) => state.user);


  const { isInitialized } = useAuthStatus();
  useEffect(() => {
    if (!isInitialized) return; // ✅ 초기화 안됐으면 무시

    
    const needsAuth = isProtectedRoute(pathname, protectedRoutes, { match: "startsWith" });

    if (!accessToken && needsAuth) {
        performLogout();
        setTimeout(() => {
            router.push("/login");
        }, 10);
    }
  }, [accessToken, pathname, router]);


  if (!isInitialized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-2 text-gray-700">
     
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  

  return <>
  {/* <span className="text-sm">안녕하세요, {user?.username ?? "게스트"}님</span> */}
  {children}
  </>;
}


