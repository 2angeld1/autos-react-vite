import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authSlice';
import LoadingSpinner from '@/components/layout/LoadingSpinner';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Layout from '@/components/layout/Layout';

// Lazy load pages for better performance
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const Cars = React.lazy(() => import('@/pages/Cars'));
const Users = React.lazy(() => import('@/pages/Users'));
const Login = React.lazy(() => import('@/pages/Login'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" text="Loading page..." />
  </div>
);

const AppRoutes: React.FC = () => {
  const { isAuthenticated, loading, initializeAuth } = useAuthStore();

  // Initialize auth on app start
  React.useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Show loading while initializing
  if (loading) {
    return <PageLoader />;
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard Routes */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Cars Routes */}
          <Route path="cars" element={<Cars />} />
          
          {/* Users Routes - Admin only */}
          <Route 
            path="users" 
            element={
              <ProtectedRoute requiredRole="admin">
                <Users />
              </ProtectedRoute>
            } 
          />
          
          {/* Settings Routes - Admin only */}
          <Route 
            path="settings/*" 
            element={
              <ProtectedRoute requiredRole="admin">
                <div>Settings Page (Coming Soon)</div>
              </ProtectedRoute>
            } 
          />
          
          {/* Analytics Routes */}
          <Route 
            path="analytics" 
            element={<div>Analytics Page (Coming Soon)</div>} 
          />
          
          {/* Images Routes */}
          <Route 
            path="images" 
            element={<div>Images Page (Coming Soon)</div>} 
          />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;