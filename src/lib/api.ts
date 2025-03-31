//lib/ (비즈니스 로직 & 외부 API 관련 함수)

// 📌 개념:

// - 특정 비즈니스 로직이 들어간 코드를 저장하는 폴더
// - API 호출, Zustand 상태 업데이트, 인증 관련 기능 등을 포함
// - utils/와 다르게 상태(store)나 API 연동이 포함될 수도 있음






import { LoginCredentials, LoginResponse, RefreshResponse, RegisterCredentials, User, ProfileUpdateCredentials } from '@/types/auth';
import { fetchApi } from "./fetchApi";

// API 함수 모음

// 로그인
export async function loginApi(credentials: LoginCredentials): Promise<LoginResponse> {
  return fetchApi<LoginResponse>("/auth/local", {
    method: "POST",
    credentials: "include", //httpOnly 쿠키 를 제어하려면 필요
    body: JSON.stringify(credentials),
  }, false);
}

//로그아웃
export async function logoutApi(): Promise<void> {
  return fetchApi<void>("/auth/logout", {
    method: "POST",
    credentials: "include", //httpOnly 쿠키 를 제어하려면 필요
  }, false);
}


//리플래쉬 = httponly - cookie 속의 refreshToken 을 사용하여 accessToken 을 재발급하는 함수
export async function refreshApi(): Promise<RefreshResponse> {
  return fetchApi<RefreshResponse>('/token/refresh', {
    method: 'POST',
    credentials: 'include', //httpOnly 쿠키 를 제어하려면 필요
  }, false);
}

//회원가입
export async function registerApi(credentials: RegisterCredentials): Promise<LoginResponse> {
  return fetchApi<LoginResponse>('/auth/local/register', {
    method: 'POST',
    credentials: 'include', //httpOnly 쿠키 를 제어하려면 필요
    body: JSON.stringify(credentials),
  }, false);
}


//유저 정보 수정
export async function profileUpdateApi(id: string, credentials: ProfileUpdateCredentials): Promise<User> {
  return fetchApi<User>(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(credentials),
  }, true);
}