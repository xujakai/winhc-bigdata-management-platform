import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/Layout';
import { routes } from './routes/config';
import AuthRoute from './components/AuthRoute';
import ErrorBoundary from './components/ErrorBoundary';
const Login = React.lazy(() => import('./pages/auth/Login'));

function App() {
  const renderRoutes = (routes: any[]) => {
    return routes.map((route) => {
      if (route.children) {
        return (
          <Route key={route.path} path={route.path}>
            {route.element && (
              <Route
                index
                element={
                  <Suspense fallback={<div>加载中...</div>}>
                    {route.element}
                  </Suspense>
                }
              />
            )}
            {renderRoutes(route.children)}
          </Route>
        );
      }
      return (
        <Route
          key={route.path}
          path={route.path}
          element={
            <Suspense fallback={<div>加载中...</div>}>
              {route.element}
            </Suspense>
          }
        />
      );
    });
  };

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Login route */}
          <Route
            path="/login"
            element={
              <Suspense fallback={<div>加载中...</div>}>
                <Login />
              </Suspense>
            }
          />
          
          {/* Protected routes */}
          <Route
            element={
              <AuthRoute>
                <AppLayout />
              </AuthRoute>
            }
          >
            {renderRoutes(routes.filter(route => route.path !== '/login'))}
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;