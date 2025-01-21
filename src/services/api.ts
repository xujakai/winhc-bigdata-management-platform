import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { message } from 'antd';

// API configuration
const API_CONFIG = {
  baseURL: '/api',
  timeout: 10000,
};

// Create axios instance
const instance: AxiosInstance = axios.create(API_CONFIG);

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized access
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          message.error('Access forbidden');
          break;
        case 404:
          message.error('Resource not found');
          break;
        case 500:
          message.error('Server error');
          break;
        default:
          message.error('An error occurred');
      }
    }
    return Promise.reject(error);
  }
);

// Generic request method
const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await instance.request<any, AxiosResponse<T>>(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API methods
export const api = {
  get: <T>(url: string, params?: any) =>
    request<T>({ method: 'GET', url, params }),
  post: <T>(url: string, data?: any) =>
    request<T>({ method: 'POST', url, data }),
  put: <T>(url: string, data?: any) =>
    request<T>({ method: 'PUT', url, data }),
  delete: <T>(url: string) =>
    request<T>({ method: 'DELETE', url }),
};