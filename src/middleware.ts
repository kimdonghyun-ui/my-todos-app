import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { protectedRoutes, authRoutes } from "@/lib/constants/auth";
import { isProtectedRoute } from "@/utils/utils";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl; // 현재 페이지의 경로
  
  // 새로고치믕을 했을때 middleware 에서 쿠키에 accessToken 토큰 확인
  const token = request.cookies.get('accessToken')?.value;
  const isAuthenticated = !!token; // 토큰이 있으면 true 없으면 false

  const needsAuth = isProtectedRoute(pathname, protectedRoutes, { match: "startsWith" }); // 인증이 필요한 페이지에 접근하려는 경우
  // 인증이 필요한 페이지에 접근하려는 경우
  if (needsAuth) {
    if (!isAuthenticated) {
      const url = new URL('/login', request.url);
      return NextResponse.redirect(url);
    }
  }

  // 이미 인증된 사용자가 로그인 페이지 등에 접근하려는 경우
  if (authRoutes.includes(pathname)) {
    if (isAuthenticated) {
      const url = new URL('/', request.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}


// 미들웨어가 적용될 경로 설정
export const config = {

  matcher: [
    '/',              // protected
    '/profile',       // protected
    '/flashcard',         // protected
    '/favorites',         // protected
    '/login',         // auth
  ],
}; 