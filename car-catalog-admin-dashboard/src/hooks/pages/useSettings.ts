import { useState, useRef, useCallback, useEffect } from 'react';
import { useAuthStore } from '@/store/authSlice';
import toast from 'react-hot-toast';
import { Lock } from 'lucide-react';
import React from 'react';

export const useSettings = () => {
  const { user, updateProfile, loading, logout } = useAuthStore();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  
  const countdownRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const toastIdRef = useRef<string | null>(null);

  // Start countdown function with toast
  const startCountdown = useCallback(() => {
    console.log('🚀 startCountdown called');
    countdownRef.current = 10;
    
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Create persistent toast
    toastIdRef.current = toast.custom(
      (t) => (
        React.createElement('div', { className: `${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5` },
          React.createElement('div', { className: 'flex-1 w-0 p-4' },
            React.createElement('div', { className: 'flex items-start' },
              React.createElement('div', { className: 'flex-shrink-0 pt-0.5' },
                React.createElement('div', { className: 'h-10 w-10 rounded-full bg-green-100 flex items-center justify-center' },
                  React.createElement(Lock, { className: 'h-5 w-5 text-green-600' })
                )
              ),
              React.createElement('div', { className: 'ml-3 flex-1' },
                React.createElement('p', { className: 'text-sm font-medium text-gray-900' }, 'Contraseña Actualizada'),
                React.createElement('p', { className: 'mt-1 text-sm text-gray-500' },
                  'Cerrando sesión en ',
                  React.createElement('span', { className: 'font-bold text-primary-600' }, countdownRef.current),
                  ' segundos...'
                )
              )
            )
          ),
          React.createElement('div', { className: 'flex border-l border-gray-200' },
            React.createElement('button', {
              onClick: () => {
                toast.dismiss(t.id);
                logout();
              },
              className: 'w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-primary-600 hover:text-primary-500 focus:outline-none'
            }, 'Cerrar Ahora')
          )
        )
      ),
      { duration: Infinity, id: 'password-countdown' }
    );

    intervalRef.current = setInterval(() => {
      if (countdownRef.current !== null && countdownRef.current > 0) {
        countdownRef.current--;
        console.log('⏱️ Countdown tick:', countdownRef.current);

        // Update the toast with new countdown
        if (toastIdRef.current) {
          toast.custom(
            (t) => (
              React.createElement('div', { className: `${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5` },
                React.createElement('div', { className: 'flex-1 w-0 p-4' },
                  React.createElement('div', { className: 'flex items-start' },
                    React.createElement('div', { className: 'flex-shrink-0 pt-0.5' },
                      React.createElement('div', { className: 'h-10 w-10 rounded-full bg-green-100 flex items-center justify-center' },
                        React.createElement(Lock, { className: 'h-5 w-5 text-green-600' })
                      )
                    ),
                    React.createElement('div', { className: 'ml-3 flex-1' },
                      React.createElement('p', { className: 'text-sm font-medium text-gray-900' }, 'Contraseña Actualizada'),
                      React.createElement('p', { className: 'mt-1 text-sm text-gray-500' },
                        'Cerrando sesión en ',
                        React.createElement('span', { className: 'font-bold text-primary-600' }, countdownRef.current),
                        ' segundos...'
                      )
                    )
                  )
                ),
                React.createElement('div', { className: 'flex border-l border-gray-200' },
                  React.createElement('button', {
                    onClick: () => {
                      toast.dismiss(t.id);
                      logout();
                    },
                    className: 'w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-primary-600 hover:text-primary-500 focus:outline-none'
                  }, 'Cerrar Ahora')
                )
              )
            ),
            { duration: Infinity, id: 'password-countdown' }
          );
        }

        if (countdownRef.current <= 0) {
          console.log('🚪 Logging out...');
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          toast.dismiss('password-countdown');
          logout();
        }
      }
    }, 1000);
  }, [logout]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (toastIdRef.current) {
        toast.dismiss('password-countdown');
      }
    };
  }, []);

  return {
    user,
    loading,
    avatarPreview,
    setAvatarPreview,
    showPasswordFields,
    setShowPasswordFields,
    updateProfile,
    startCountdown
  };
};
