'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  variant?: 'default' | 'interactive' | 'elevated';
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', children, className = '', onClick, href }, ref) => {
    const variantClasses = {
      default: 'card',
      interactive: 'card-interactive',
      elevated: 'card shadow-xl',
    };

    const baseClass = `${variantClasses[variant]} ${className}`.trim();

    if (href) {
      return (
        <a
          href={href}
          className={`${baseClass} block no-underline`}
        >
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {children}
          </motion.div>
        </a>
      );
    }

    return (
      <motion.div
        ref={ref}
        whileHover={variant === 'interactive' ? { y: -4 } : {}}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div className={baseClass} onClick={onClick}>
          {children}
        </div>
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

/* Card Content Components */

export const CardHeader = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`pb-4 border-b border-slate-700/50 ${className}`}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`py-4 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`pt-4 border-t border-slate-700/50 flex gap-2 ${className}`}>
    {children}
  </div>
);
