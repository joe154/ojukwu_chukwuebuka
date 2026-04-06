'use client';

import React from 'react';

interface SkeletonProps {
  variant?: 'text' | 'rounded' | 'card';
  width?: string | number;
  height?: string | number;
  count?: number;
  className?: string;
}

export const Skeleton = ({
  variant = 'text',
  width = '100%',
  height = '20px',
  count = 1,
  className = '',
}: SkeletonProps) => {
  const variantClasses = {
    text: 'rounded',
    rounded: 'rounded-lg',
    card: 'rounded-xl',
  };

  const base = `${variantClasses[variant]} bg-gradient-to-r from-slate-700/50 via-slate-600/50 to-slate-700/50 animate-pulse ${className}`.trim();

  const skeletons = Array.from({ length: count }).map((_, i) => (
    <div
      key={i}
      className={base}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        marginBottom: i < count - 1 ? '12px' : '0',
      }}
    />
  ));

  return <>{skeletons}</>;
};

/* Skeleton Composites */

export const CardSkeleton = () => (
  <div className="card">
    <Skeleton variant="rounded" height={200} className="mb-4 w-full" />
    <Skeleton variant="text" width="80%" height={24} className="mb-3" />
    <Skeleton variant="text" width="100%" height={16} count={2} className="mb-4" />
    <Skeleton variant="text" width={120} height={16} />
  </div>
);

export const ProjectGridSkeleton = ({ count = 3 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);
