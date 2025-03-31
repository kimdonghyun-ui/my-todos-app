'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useAuth } from '@/hooks/useAuth';

export default function LoginForm() {
  const [identifier, setIdentifier] = useState('hello@naver.com');
  const [password, setPassword] = useState('hello123');
  const { accessToken } = useAuthStore();
  const isLoading = !!accessToken
  const { handleLogin } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin({ identifier, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-[400px] bg-white rounded-lg shadow-lg overflow-hidden">
        {/* 헤더 */}
        <div className="bg-[#FEE500] p-6 flex items-center justify-center">
          <div className="text-2xl font-bold text-gray-800">Login</div>
        </div>

        {/* 로그인 폼 */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-1">
                  이메일 또는 사용자명
                </label>
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FEE500] focus:border-transparent text-gray-800"
                  placeholder="이메일 또는 사용자명을 입력하세요"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  비밀번호
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FEE500] focus:border-transparent text-gray-800"
                  placeholder="비밀번호를 입력하세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>



            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[#FEE500] text-gray-800 font-medium rounded-md hover:bg-[#FDD800] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FEE500] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-gray-800 border-t-transparent rounded-full animate-spin mr-2"></div>
                  로그인 중...
                </div>
              ) : (
                '로그인'
              )}
            </button>

            <div className="text-center text-sm text-gray-600">
              <a href="/register" className="hover:text-[#FEE500] transition-colors duration-200">
                회원가입
              </a>
              {/* <span className="mx-2">|</span>
              <a href="/forgot-password" className="hover:text-[#FEE500] transition-colors duration-200">
                비밀번호 찾기
              </a> */}
            </div>
          </form>
        </div>

        {/* 푸터 */}
        <div className="bg-gray-50 p-4 text-center text-sm text-gray-500">
          © 2024 My Budget App. All rights reserved.
        </div>
      </div>
    </div>
  );
}