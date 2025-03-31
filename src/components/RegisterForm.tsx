'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// import { useAuthStore } from '@/store/authStore';
import { useAuth } from '@/hooks/useAuth';
import { handleFileUpload } from "@/utils/fileUpload";

export default function RegisterForm() {
  const [profileImage, setProfileImage] = useState<string>("");
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { handleRegister } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      setIsLoading(true);
      await handleRegister({ username, email, password, profileImage });
      router.push('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원가입에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };


	// ✅ 파일 선택 핸들러
	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		if (event.target.files && event.target.files.length > 0) {
			try {
				const svgString: string = await handleFileUpload(event);
				setProfileImage(svgString); // ✅ 상태 업데이트
				// setValue("profileImage", svgString); // ✅ React Hook Form의 값 업데이트
				console.log("SVG 변환 결과:", svgString);
			} catch (error) {
				console.error("파일 변환 중 오류 발생:", error);
			}
		}
	};



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-[400px] bg-white rounded-lg shadow-lg overflow-hidden">
        {/* 헤더 */}
        <div className="bg-[#FEE500] p-6 flex items-center justify-center">
          <div className="text-2xl font-bold text-gray-800">회원가입</div>
        </div>

        {/* 회원가입 폼 */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">

            <div>
                <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700 mb-1">
                  프로필 이미지
                </label>
                <input
                  id="profileImage"
                  name="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FEE500] focus:border-transparent text-gray-800"
                />
              </div>




              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  사용자명
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FEE500] focus:border-transparent text-gray-800"
                  placeholder="사용자명을 입력하세요"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  이메일
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FEE500] focus:border-transparent text-gray-800"
                  placeholder="이메일을 입력하세요"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  비밀번호 확인
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FEE500] focus:border-transparent text-gray-800"
                  placeholder="비밀번호를 다시 입력하세요"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-md">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[#FEE500] text-gray-800 font-medium rounded-md hover:bg-[#FDD800] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FEE500] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-gray-800 border-t-transparent rounded-full animate-spin mr-2"></div>
                  가입 중...
                </div>
              ) : (
                '회원가입'
              )}
            </button>

            <div className="text-center text-sm text-gray-600">
              이미 계정이 있으신가요?{' '}
              <a href="/login" className="text-[#FEE500] hover:text-[#FDD800] transition-colors duration-200">
                로그인하기
              </a>
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