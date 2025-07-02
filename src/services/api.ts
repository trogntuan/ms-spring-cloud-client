import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type { UserDto, ApiResponse } from '../types';

const OAUTH2_SERVER_URL = import.meta.env.VITE_OAUTH2_SERVER_URL || 'http://localhost:9000';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082';
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID || 'ipt';
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET || 'q1w2e3r4';
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI || 'http://localhost:3000/callback';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true,
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers = config.headers || {};
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle auth errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // OAuth2 Authorization Code Flow - Step 1: Redirect to authorization server
  getAuthorizationUrl(): string {
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      scope: 'READ WRITE',
      response_type: 'code',
      response_mode: 'form_post',
      state: this.generateRandomString(32),
      nonce: this.generateRandomString(32)
    });

    const authUrl = `${OAUTH2_SERVER_URL}/oauth2/authorize?${params.toString()}`;
    console.log('Authorization URL:', authUrl);
    return authUrl;
  }

  // OAuth2 Authorization Code Flow - Step 2: Exchange code for token using Basic Auth
  async exchangeCodeForToken(code: string): Promise<{ access_token: string; token_type: string }> {
    console.log('Exchanging code for token...', { code: code.substring(0, 10) + '...' });
    
    // Create Basic Auth header
    const credentials = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
    
    const formData = new FormData();
    formData.append('grant_type', 'authorization_code');
    formData.append('code', code);
    formData.append('redirect_uri', REDIRECT_URI);

    try {
      const response: AxiosResponse<{ access_token: string; token_type: string }> = await axios.post(
        `${OAUTH2_SERVER_URL}/oauth2/token`,
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${credentials}`
          },
        }
      );

      console.log('Token exchange successful');
      return response.data;
    } catch (error: any) {
      console.error('Token exchange failed:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  }

  // Get user info
  async getUserInfo(): Promise<ApiResponse<UserDto>> {
    try {
      const response: AxiosResponse<ApiResponse<UserDto>> = await this.api.get('/user-service/info');
      return response.data;
    } catch (error: any) {
      console.error('Get user info failed:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  }

  // Get product list
  async getProductList(): Promise<any[]> {
    try {
      const response = await this.api.get('/product-service/all');
      return response.data;
    } catch (error: any) {
      console.error('Get product list failed:', error);
      throw error;
    }
  }

  // Create order
  async createOrder(order: any): Promise<any> {
    try {
      const response = await this.api.post('/order-service', order);
      return response.data;
    } catch (error: any) {
      console.error('Create order failed:', error);
      throw error;
    }
  }

  // Get order list
  async getOrderList(): Promise<any[]> {
    try {
      const response = await this.api.get('/order-service');
      return response.data;
    } catch (error: any) {
      console.error('Get order list failed:', error);
      throw error;
    }
  }

  // WELCOME USER
  async getMessage(): Promise<any[]> {
    try {
      const response = await this.api.get('/order-service/welcome');
      return response.data;
    } catch (error: any) {
      console.error('getMessage failed:', error);
      throw error;
    }
  }

  // Logout
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  }

  // Generate random string for state and nonce
  private generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}

export const apiService = new ApiService();

export const getUserInfo = async () => {
  return await apiService.getUserInfo();
};

export const getProductList = async () => {
  return await apiService.getProductList();
};

export const createOrder = async (order: any) => {
  return await apiService.createOrder(order);
};

export const getOrderList = async () => {
  return await apiService.getOrderList();
}; 

export const getMessage = async () => {
  return await apiService.getMessage();
};