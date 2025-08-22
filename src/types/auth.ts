// ✅ 로그인 타입
export interface Login {
  identifier: string;
  password: string;
}

// ✅ 로그인 응답 타입
export interface LoginResponse {
  jwt: string;
  user: User;
}

// ✅ 회원가입 타입
export interface Register {
  username: string;
  email: string;
  password: string;
  profileImage: string;
}

// ✅ 프로필 업데이트 타입
export interface ProfileUpdate {
  username: string;
  email: string;
  password: string;
  profileImage: string;
}

// ✅ 토큰 갱신 응답 타입
export interface RefreshResponse {
  jwt: string;
}

// ✅ 유저 타입
export interface User {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  profileImage: string;
}


export interface LoginCredentials {
  identifier: string;
  password: string;
} 


export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  profileImage: string;
}

export interface ProfileUpdateCredentials {
  username: string;
  email: string;
  password: string;
  profileImage: string;
}

