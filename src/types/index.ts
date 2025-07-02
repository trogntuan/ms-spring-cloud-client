export interface UserDto {
  userId: string;
  name: string;
  email: string;
  phone: string;
  pointAmount: number;
  accountId: number;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  user: UserDto | null;
  loading: boolean;
} 