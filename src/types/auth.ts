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

export interface LoginResponse {
  jwt: string;
  user: User;
}

export interface RefreshResponse {
  jwt: string;
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
