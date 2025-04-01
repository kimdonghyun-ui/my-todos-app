'use client';

import { useRouter } from 'next/navigation';
import { performLogout } from '@/lib/auth';
import { useAuthStore } from '@/store/authStore';
import DarkModeToggle from '../DarkModeToggle';
import { usePathname } from 'next/navigation';
import { getTitleFromPath } from '@/utils/utils';

interface HeaderProps {
  showBackButton?: boolean;
  // title?: string;
}

export default function Header({ showBackButton = false }: HeaderProps) {
  const path = usePathname();
  const title = getTitleFromPath(path);
  

  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);

  const handleLogout = async () => {
    await performLogout();
    router.push('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-sm z-50">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <DarkModeToggle />
          {accessToken && (
            <>
              <button
                onClick={() => router.push('/profile')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                title="프로필"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                title="로그아웃"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
} 