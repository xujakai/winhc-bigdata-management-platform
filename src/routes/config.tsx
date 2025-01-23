import React from 'react';
import { HomeOutlined, UserOutlined, SettingOutlined, TableOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

export interface RouteConfig {
  path: string;
  element?: React.ReactNode;
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
const AreaCodeView = React.lazy(() => import('../pages/area_code/AreaCodeView'));
const AreaCodeChange = React.lazy(() => import('../pages/area_code/AddAreaCode'));
const AreaCodeChangeEventList = React.lazy(() => import('../pages/area_code/ChangeEventList'));

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
    path: '/area-code',
    label: '区划管理',
    icon: <TableOutlined />,
    auth: true,
    children: [
      {
        path: '/area-code/view',
        element: <AreaCodeView />,
        label: '区划列表',
        auth: true,
      },
      {
        path: '/area-code/add',
        element: <AreaCodeChange />,
        label: '新增区划',
        auth: true,
      },
      {
        path: '/area-code/change-list',
        element: <AreaCodeChangeEventList />,
        label: '变更记录',
        auth: true,
      }
    ]
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
    .filter(route => route.auth && route.path !== '*' && route.icon)
    .map((route) => ({
      key: route.path,
      icon: route.icon,
      label: route.label,
      children: route.children ? route.children.map(child => ({
        key: child.path,
        label: child.label,
      })) : undefined,
    }));
};