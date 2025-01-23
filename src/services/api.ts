import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { message } from 'antd';

const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

const instance: AxiosInstance = axios.create(API_CONFIG);

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    message.error('请求发送失败');
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem('token');
          window.location.href = '/login';
          message.error('登录已过期，请重新登录');
          break;
        case 403:
          message.error('没有权限访问');
          break;
        case 404:
          message.error('请求的资源不存在');
          break;
        case 500:
          message.error('服务器错误');
          break;
        default:
          message.error('发生错误：' + (error.response.data?.message || '未知错误'));
      }
    } else if (error.request) {
      message.error('无法连接到服务器');
    } else {
      message.error('请求配置错误');
    }
    return Promise.reject(error);
  }
);

export const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await instance.request<any, AxiosResponse<T>>(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

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