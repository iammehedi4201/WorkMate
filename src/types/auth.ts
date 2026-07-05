export interface User {
  id: string;
  email: string;
  name?: string;
  nickName?: string;
  avatarUrl?: string;
  dp?: string;
  level?: string;
  designations?: string[];
  departments?: string[];
  permissions?: string[];
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: TokenResponse;
}

export interface BackendLoginResponse {
  _id: string;
  email: string;
  name: string;
  nickName?: string;
  level: string;
  dp?: string;
  designations: string[];
  departments: string[];
  permissions: string[];
  token: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  setAuth: (user: User, accessToken: string) => void;
  clearAuth: () => void;
  setInitializing: (isInitializing: boolean) => void;
}
