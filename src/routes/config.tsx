import React from 'react';
import { HomeOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  label: string;
  icon?: React.ReactNode;
  children?: RouteConfig[];
  auth?: boolean;
}

// Lazy load components
const Home = React.lazy(() => import('../pages/dashboard/Home'));
const Profile = React.lazy(() => import('../pages/user/Profile'));
const Settings = React.lazy(() => import('../pages/system/Settings'));
const Login = React.lazy(() => import('../pages/auth/Login'));
const NotFound = React.lazy(() => import('../pages/error/NotFound'));

export const routes: RouteConfig[] = [
  {
    path: '/login',
    element: <Login />,
    label: '登录',
    auth: false,
  },
  {
    path: '/',
    element: <Home />,
    label: '首页',
    icon: <HomeOutlined />,
    auth: true,
  },
  {
    path: '/profile',
    element: <Profile />,
    label: '个人信息',
    icon: <UserOutlined />,
    auth: true,
  },
  {
    path: '/settings',
    element: <Settings />,
    label: '系统设置',
    icon: <SettingOutlined />,
    auth: true,
  },
  {
    path: '*',
    element: <NotFound />,
    label: '404',
    auth: false,
  }
];

export const getMenuItems = (routes: RouteConfig[]): MenuProps['items'] => {
  return routes
    .filter(route => route.auth && route.icon) // Only show authenticated routes with icons in menu
    .map((route) => ({
      key: route.path,
      icon: route.icon,
      label: route.label,
      children: route.children ? getMenuItems(route.children) : undefined,
    }));
};