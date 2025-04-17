'use client';

import { useRouter } from 'next/navigation';
import { performLogout } from '@/lib/auth';
import { useAuthStore } from '@/store/authStore';
import DarkModeToggle from '../DarkModeToggle';
import { usePathname } from 'next/navigation';
import { getTitleFromPath } from '@/utils/utils';

import { BarChart2, LayoutDashboard, LogOut, PlusCircle, Receipt, User } from 'lucide-react';

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
    // router.push('/login');
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
        
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <DarkModeToggle />
          {accessToken && (
            <>
              <button
                onClick={() => router.push('/dashboard')}
                className="p-1 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                title="대쉬보드"
              >
                <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                onClick={() => router.push('/statistics')}
                className="p-1 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                title="통계"
              >
                <BarChart2 className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>

              <button
                onClick={() => router.push('/transactions')}
                className="p-1 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                title="거래 내역"
              >
                <Receipt className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>

              <button
                onClick={() => router.push('/transactions/new')}
                className="p-1 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                title="거래 내역 추가"
              >
                <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                onClick={() => router.push('/profile')}
                className="p-1 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                title="프로필"
              >
                <User className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>

              <button
                onClick={handleLogout}
                className="p-1 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                title="로그아웃"
              >
                <LogOut className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
} 