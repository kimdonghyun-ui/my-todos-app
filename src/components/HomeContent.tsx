'use client';


import { performLogout } from "@/lib/auth";
import { useRouter } from 'next/navigation';

export default function HomeContent() {
  const router = useRouter();
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">메인 페이지</h1>
      <p>로그인 된 사용자만 볼 수 있는 페이지입니다.</p>
      
      <button onClick={() => {
        router.push('/profile');
      }}>프로필</button>
      <button onClick={() => {
        performLogout();
      }}>로그아웃</button>
    </div>
  );
} 