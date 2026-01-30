import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authSlice';
import LoadingSpinner from '@/components/layout/LoadingSpinner';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Layout from '@/components/layout/Layout';

// Lazy load pages for better performance
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const Cars = React.lazy(() => import('@/pages/Cars/Cars'));
const AddCar = React.lazy(() => import('@/pages/Cars/AddCar'));
const EditCar = React.lazy(() => import('@/pages/Cars/EditCar'));
const ViewCar = React.lazy(() => import('@/pages/Cars/ViewCar'));
const Users = React.lazy(() => import('@/pages/Users'));
const Login = React.lazy(() => import('@/pages/Login'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));
const Images = React.lazy(() => import('@/pages/Images'));
const Settings = React.lazy(() => import('@/pages/Settings'));
const Analytics = React.lazy(() => import('@/pages/Analytics'));
const Accessories = React.lazy(() => import('@/pages/Accessories'));
const Brands = React.lazy(() => import('@/pages/Brands'));
const Quotes = React.lazy(() => import('@/pages/Quotes/Quotes'));
const Promotions = React.lazy(() => import('@/pages/Promotions'));
const Categories = React.lazy(() => import('@/pages/Categories'));
const IronTrail = React.lazy(() => import('@/pages/IronTrail'));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" text="Loading page..." />
  </div>
);

const AppRoutes: React.FC = () => {
  const { loading, initializeAuth } = useAuthStore();

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
          <Route path="cars/add" element={<AddCar />} />
          <Route path="cars/:id/edit" element={<EditCar />} />
          <Route path="cars/:id" element={<ViewCar />} />

          {/* Inventory Routes */}
          <Route path="accessories" element={<Accessories />} />
          <Route path="brands" element={<Brands />} />
          <Route path="categories" element={<Categories />} />

          {/* Sales Routes */}
          <Route path="quotes" element={<Quotes />} />
          <Route path="promotions" element={<Promotions />} />

          {/* IronTrail Routes */}
          <Route path="irontrail" element={<IronTrail />} />

          {/* Users Routes - Admin only */}
          <Route
            path="users"
            element={
              <ProtectedRoute requiredRole="admin">
                <Users />
              </ProtectedRoute>
            }
          />

          {/* Settings Routes */}
          <Route
            path="settings"
            element={
              <ProtectedRoute requiredRole="admin">
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Analytics Routes */}
          <Route path="analytics" element={<Analytics />} />

          {/* Images/Files Routes */}
          <Route path="images" element={<Images />} />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;