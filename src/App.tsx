import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/Layout';
import { routes } from './routes/config';
import AuthRoute from './components/AuthRoute';
const Login = React.lazy(() => import('./pages/auth/Login'));

function App() {
  return (
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
          {routes
            .filter(route => route.path !== '/login')
            .map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <Suspense fallback={<div>加载中...</div>}>
                    {route.element}
                  </Suspense>
                }
              />
            ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;