'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useAuth } from '@/hooks/useAuth';

const loginMessages = [
  {
    title: '일정 관리',
    subtitle: '나의 일정을 더 꼼꼼하게 관리! 오늘의 일정을 확인해보세요',
  },
  // {
  //   title: '지출 관리, 더 쉽게',
  //   subtitle: '매일의 수입과 지출을 한눈에. 당신만의 스마트 가계부를 시작하세요',
  // },
  // {
  //   title: '돈의 흐름을 기록하세요',
  //   subtitle: '작은 소비도 소중하게. 당신의 일상을 숫자로 담아보세요',
  // },
]

export default function LoginForm() {
  const [identifier, setIdentifier] = useState('hello@naver.com');
  const [password, setPassword] = useState('hello123');
  // const { accessToken } = useAuthStore();
  // const isLoading = !!accessToken;
  const { handleLogin } = useAuth();
  const [message, setMessage] = useState(loginMessages[0])

  const { isLoading } = useAuthStore();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin({ identifier, password });
  };

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * loginMessages.length)
    setMessage(loginMessages[randomIndex])
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{message.title}</h2>
            <p className="text-gray-600 dark:text-gray-400">{message.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                이메일
              </label>
              <input
                type="email"
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg 
                       hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                       focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed 
                       transition-colors duration-200"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  로그인 중...
                </div>
              ) : (
                '로그인'
              )}
            </button>

            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              <a href="/register" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                회원가입
              </a>
            </div>

            {/* ✅ Heroku 슬립 안내 문구 */}
            <p className="text-center text-xs text-red-500 mt-2 font-medium">
              ※ 첫 로그인 시, 백엔드 서버 기동으로 인해 약간의 지연이 발생할 수 있습니다.
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}