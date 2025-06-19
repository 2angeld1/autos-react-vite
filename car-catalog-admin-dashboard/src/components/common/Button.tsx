import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      children,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      ...props
    },
    ref
  ) => {
    const baseClasses = [
      'inline-flex items-center justify-center rounded-md font-medium transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
    ];

    const variantClasses = {
      primary: [
        'bg-primary-600 text-white hover:bg-primary-700',
        'shadow-sm focus-visible:ring-primary-500',
      ],
      secondary: [
        'bg-gray-100 text-gray-900 hover:bg-gray-200',
        'shadow-sm focus-visible:ring-gray-500',
      ],
      outline: [
        'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
        'shadow-sm focus-visible:ring-gray-500',
      ],
      ghost: [
        'text-gray-700 hover:bg-gray-100',
        'focus-visible:ring-gray-500',
      ],
      danger: [
        'bg-red-600 text-white hover:bg-red-700',
        'shadow-sm focus-visible:ring-red-500',
      ],
    };

    const sizeClasses = {
      sm: 'h-8 px-3 text-sm gap-2',
      md: 'h-10 px-4 py-2 gap-2',
      lg: 'h-12 px-6 py-3 text-lg gap-3',
    };

    const widthClasses = fullWidth ? 'w-full' : '';

    const combinedClasses = clsx(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      widthClasses,
      className
    );

    const iconElement = loading ? (
      <Loader2 className="h-4 w-4 animate-spin" />
    ) : (
      icon
    );

    return (
      <button
        ref={ref}
        className={combinedClasses}
        disabled={disabled || loading}
        {...props}
      >
        {iconElement && iconPosition === 'left' && iconElement}
        {children}
        {iconElement && iconPosition === 'right' && iconElement}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;