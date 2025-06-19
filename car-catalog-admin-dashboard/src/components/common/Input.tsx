import React from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  variant?: 'default' | 'filled';
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      error,
      helperText,
      startIcon,
      endIcon,
      variant = 'default',
      fullWidth = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    const containerClasses = clsx(
      'relative',
      fullWidth ? 'w-full' : ''
    );

    const inputClasses = clsx(
      'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
      'placeholder:text-gray-400',
      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
      'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50',
      {
        'border-red-500 focus:ring-red-500': error,
        'pl-10': startIcon,
        'pr-10': endIcon || isPassword,
        'bg-gray-50': variant === 'filled',
      },
      className
    );

    const labelClasses = clsx(
      'block text-sm font-medium text-gray-700 mb-1',
      {
        'text-red-600': error,
      }
    );

    const helperTextClasses = clsx(
      'mt-1 text-sm',
      {
        'text-red-600': error,
        'text-gray-500': !error,
      }
    );

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className={containerClasses}>
        {label && (
          <label className={labelClasses}>
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {startIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="h-4 w-4 text-gray-400">
                {startIcon}
              </div>
            </div>
          )}
          
          <input
            ref={ref}
            type={inputType}
            className={inputClasses}
            disabled={disabled}
            {...props}
          />
          
          {isPassword && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={togglePasswordVisibility}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          )}
          
          {endIcon && !isPassword && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <div className="h-4 w-4 text-gray-400">
                {endIcon}
              </div>
            </div>
          )}
        </div>
        
        {(error || helperText) && (
          <p className={helperTextClasses}>
            {error && (
              <span className="inline-flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {error}
              </span>
            )}
            {!error && helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;