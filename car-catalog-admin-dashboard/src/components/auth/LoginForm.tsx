import React from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Lock, Mail, AlertCircle, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { useAuthStore } from '@/store/authSlice';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = React.useState(false);
  const { login, loading, error } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      toast.success(t('auth.welcomeBack'));
    } catch (error: any) {
      toast.error(error.message || t('auth.loginFailed'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-2xl">
            <Zap className="h-10 w-10 text-white fill-current" />
          </div>
          <h1 className="mt-6 text-4xl font-extrabold text-gray-900 tracking-tight">
            Velo<span className="text-orange-600">Drive</span>
          </h1>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {t('auth.signIn')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('auth.accessDashboard')}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {t('auth.authError')}
                </h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form
          className="mt-8 space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            // Explicitly call react-hook-form's handleSubmit to ensure default navigation is prevented
            handleSubmit(onSubmit)(e as any);
          }}
        >
          <div className="space-y-4">
            <Input
              label={t('auth.email')}
              type="email"
              autoComplete="email"
              {...register('email', {
                required: t('validation.required'),
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: t('validation.invalidEmail'),
                },
              })}
              error={errors.email?.message}
              startIcon={<Mail className="h-4 w-4" />}
              placeholder="admin@example.com"
              fullWidth
            />

            <div className="relative">
              <Input
                label={t('auth.password')}
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                {...register('password', {
                  required: t('validation.required'),
                  minLength: {
                    value: 6,
                    message: t('validation.minLength', { min: 6 }),
                  },
                })}
                error={errors.password?.message}
                startIcon={<Lock className="h-4 w-4" />}
                placeholder={t('auth.password')}
                fullWidth
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center top-6"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                {...register('rememberMe')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                {t('auth.rememberMe')}
              </label>
            </div>

            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                {t('auth.forgotPassword')}
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            loading={loading}
            fullWidth
            size="lg"
          >
            {t('auth.signInButton')}
          </Button>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-2">
              {t('auth.demoCredentials')}
            </h4>
            <div className="text-xs text-blue-700 space-y-1">
              <div>
                <strong>{t('auth.admin')}:</strong> admin@example.com / admin123
              </div>
              <div>
                <strong>{t('auth.user')}:</strong> user@example.com / user123
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;