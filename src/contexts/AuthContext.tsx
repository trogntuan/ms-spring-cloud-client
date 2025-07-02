import { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { AuthState, UserDto } from '../types';
import { apiService } from '../services/api';

interface AuthContextType extends AuthState {
  login: () => void;
  logout: () => void;
  loadUser: () => Promise<void>;
  handleCallback: (code: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { token: string; user: UserDto } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'LOAD_USER_START' }
  | { type: 'LOAD_USER_SUCCESS'; payload: UserDto }
  | { type: 'LOAD_USER_FAILURE' };

const initialState: AuthState = {
  isAuthenticated: false,
  accessToken: localStorage.getItem('accessToken'),
  user: null,
  loading: false,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        accessToken: action.payload.token,
        user: action.payload.user,
        loading: false,
      };
    case 'LOGIN_FAILURE':
      return { ...state, isAuthenticated: false, accessToken: null, user: null, loading: false };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false, accessToken: null, user: null };
    case 'LOAD_USER_START':
      return { ...state, loading: true };
    case 'LOAD_USER_SUCCESS':
      return { ...state, user: action.payload, loading: false };
    case 'LOAD_USER_FAILURE':
      return { ...state, loading: false };
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const isInitialized = useRef(false);

  const login = () => {
    // Redirect to OAuth2 authorization server
    const authUrl = apiService.getAuthorizationUrl();
    window.location.href = authUrl;
  };

  const handleCallback = async (code: string) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      
      // Exchange authorization code for access token
      const tokenResponse = await apiService.exchangeCodeForToken(code);
      
      localStorage.setItem('accessToken', tokenResponse.access_token);
      
      // Load user info after successful login
      const userResponse = await apiService.getUserInfo();
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { token: tokenResponse.access_token, user: userResponse.data },
      });
      
      localStorage.setItem('user', JSON.stringify(userResponse.data));
    } catch (error) {
      console.error('Login failed:', error);
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const logout = () => {
    apiService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  const loadUser = async () => {
    if (!state.accessToken) return;

    try {
      dispatch({ type: 'LOAD_USER_START' });
      const response = await apiService.getUserInfo();
      dispatch({ type: 'LOAD_USER_SUCCESS', payload: response.data });
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (error) {
      console.error('Failed to load user:', error);
      dispatch({ type: 'LOAD_USER_FAILURE' });
      logout();
    }
  };

  // Chỉ load user một lần khi component mount và có accessToken
  useEffect(() => {
    if (!isInitialized.current && state.accessToken && !state.user) {
      isInitialized.current = true;
      loadUser();
    }
  }, []); // Empty dependency array

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    loadUser,
    handleCallback,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 