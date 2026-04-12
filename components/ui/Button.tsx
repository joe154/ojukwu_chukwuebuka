'use client';

import React, { ButtonHTMLAttributes, ReactNode, useState } from 'react';
import { MotionButton } from '../../lib/motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger' | 'magnetic';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: ReactNode;
  showRipple?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      className = '',
      disabled,
      children,
      showRipple = true,
      onClick,
      ...props
    },
    ref
  ) => {
    const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (showRipple && !isLoading && !disabled) {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newRipple = { id: Date.now(), x, y };
        setRipples(prev => [...prev, newRipple]);

        setTimeout(() => {
          setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
        }, 600);
      }

      onClick?.(e);
    };

    const baseClass = 'btn group relative overflow-hidden';
    const variantClasses = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      tertiary: 'btn-tertiary',
      ghost: 'btn-ghost',
      danger: 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg hover:shadow-glow hover:shadow-rose-500/50 active:scale-95',
      magnetic: 'btn-primary animate-magnetic',
    };

    const sizeClasses = {
      sm: 'btn-sm',
      md: 'text-sm px-4 py-2.5',
      lg: 'btn-lg',
    };

    const finalClassName = `
      ${baseClass}
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${fullWidth ? 'w-full' : ''}
      ${isLoading || disabled ? 'opacity-60 cursor-not-allowed' : ''}
      ${className}
    `.trim();

    return (
      <MotionButton
        ref={ref}
        className={finalClassName}
        disabled={isLoading || disabled}
        onClick={handleClick}
        whileHover={
          !isLoading && !disabled
            ? {
                scale: variant === 'magnetic' ? 1.05 : 1.02,
                y: -1,
              }
            : {}
        }
        whileTap={!isLoading && !disabled ? { scale: 0.98 } : {}}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 17,
          mass: 0.8,
        }}
        {...props}
      >
        {/* Shimmer Effect for Primary Buttons */}
        {variant === 'primary' && !isLoading && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="animate-shimmer absolute inset-0" />
          </div>
        )}

        {/* Ripple Effects */}
        {ripples.map(ripple => (
          <span
            key={ripple.id}
            className="absolute rounded-full bg-white/30 pointer-events-none animate-ping"
            style={{
              left: ripple.x - 10,
              top: ripple.y - 10,
              width: 20,
              height: 20,
              animation: 'ripple 0.6s linear',
            }}
          />
        ))}

        {/* Glow Effect for Magnetic Buttons */}
        {variant === 'magnetic' && (
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-400/20 to-cyan-400/20 rounded-xl blur-xl" />
          </div>
        )}

        {/* Content */}
        <span className="relative z-10 flex items-center gap-2">
          {isLoading ? (
            <>
              <motion.svg
                className="h-5 w-5 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </motion.svg>
              <span className="animate-pulse">Loading...</span>
            </>
          ) : (
            <>
              {icon && iconPosition === 'left' && (
                <motion.span
                  className="flex-shrink-0"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  {icon}
                </motion.span>
              )}
              <span className="font-medium">{children}</span>
              {icon && iconPosition === 'right' && (
                <motion.span
                  className="flex-shrink-0"
                  whileHover={{ scale: 1.1, x: 2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  {icon}
                </motion.span>
              )}
            </>
          )}
        </span>
      </MotionButton>
    );
  }
);

Button.displayName = 'Button';
