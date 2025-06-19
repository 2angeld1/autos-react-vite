import React from 'react';
import { useForm } from 'react-hook-form';
import { Shield, ArrowLeft, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/components/common/Button';
import { useAuthStore } from '@/store/authSlice';
import toast from 'react-hot-toast';

interface TwoFactorFormData {
  code: string;
}

interface TwoFactorAuthProps {
  email: string;
  onBack: () => void;
}

const TwoFactorAuth: React.FC<TwoFactorAuthProps> = ({ email, onBack }) => {
  const [timeLeft, setTimeLeft] = React.useState(300); // 5 minutes
  const { verify2FA, resend2FA, loading } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TwoFactorFormData>();

  const codeValue = watch('code');

  // Countdown timer
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto-submit when code is complete
  React.useEffect(() => {
    if (codeValue && codeValue.length === 6) {
      handleSubmit(onSubmit)();
    }
  }, [codeValue, handleSubmit]);

  const onSubmit = async (data: TwoFactorFormData) => {
    try {
      await verify2FA(email, data.code);
      toast.success('Successfully authenticated!');
    } catch (error: any) {
      toast.error(error.message || '2FA verification failed');
    }
  };

  const handleResendCode = async () => {
    try {
      await resend2FA(email);
      setTimeLeft(300); // Reset timer
      toast.success('New verification code sent!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend code');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setValue('code', value);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary-600 rounded-lg flex items-center justify-center">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Two-Factor Authentication
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter the 6-digit code sent to
          </p>
          <p className="text-sm font-medium text-gray-900">{email}</p>
        </div>

        {/* 2FA Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="code" className="sr-only">
              Verification Code
            </label>
            <div className="relative">
              <input
                id="code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                {...register('code', {
                  required: 'Verification code is required',
                  pattern: {
                    value: /^\d{6}$/,
                    message: 'Code must be 6 digits',
                  },
                })}
                onChange={handleInputChange}
                className="appearance-none relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 text-center text-2xl font-mono tracking-widest"
                placeholder="000000"
                autoComplete="one-time-code"
              />
            </div>
            {errors.code && (
              <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
            )}
          </div>

          {/* Timer */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Code expires in{' '}
              <span className={`font-medium ${timeLeft < 60 ? 'text-red-600' : 'text-gray-900'}`}>
                {formatTime(timeLeft)}
              </span>
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            loading={loading}
            disabled={!codeValue || codeValue.length !== 6}
            fullWidth
            size="lg"
          >
            Verify Code
          </Button>

          {/* Resend Code */}
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              Didn't receive the code?
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={handleResendCode}
              disabled={timeLeft > 240} // Allow resend after 1 minute
              icon={<RefreshCw className="h-4 w-4" />}
            >
              {timeLeft > 240 ? `Resend in ${formatTime(timeLeft - 240)}` : 'Resend Code'}
            </Button>
          </div>

          {/* Back to Login */}
          <div className="text-center">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Login
            </button>
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 mb-2">
            Having trouble?
          </h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Check your email spam/junk folder</li>
            <li>• Make sure you're using the latest code</li>
            <li>• Contact support if you continue having issues</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuth;