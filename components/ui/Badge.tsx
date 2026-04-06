'use client';

import React, { ReactNode } from 'react';

interface BadgeProps {
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'secondary';
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Badge = ({ variant = 'primary', children, className = '', size = 'md' }: BadgeProps) => {
  const variantClasses = {
    primary: 'badge-primary',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    secondary: 'badge-secondary',
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-xs px-3 py-1.5',
    lg: 'text-sm px-4 py-2',
  };

  return (
    <span className={`badge ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim()}>
      {children}
    </span>
  );
};
