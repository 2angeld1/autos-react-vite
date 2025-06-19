import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import TwoFactorAuth from '@/components/auth/TwoFactorAuth';
import { useAuthStore } from '@/store/authSlice';

const Login: React.FC = () => {
  const { isAuthenticated, requires2FA, user } = useAuthStore();
  const location = useLocation();
  const [email, setEmail] = React.useState('');
  const [show2FA, setShow2FA] = React.useState(false);

  // Redirect if already authenticated
  if (isAuthenticated && user) {
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  // Show 2FA if required
  if (requires2FA || show2FA) {
    return (
      <TwoFactorAuth
        email={email}
        onBack={() => setShow2FA(false)}
      />
    );
  }

  return <LoginForm />;
};

export default Login;