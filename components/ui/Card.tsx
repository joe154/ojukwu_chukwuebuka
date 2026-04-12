'use client';

import React, { ReactNode, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface CardProps {
  variant?: 'default' | 'interactive' | 'elevated' | 'glass' | 'magnetic';
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  glowOnHover?: boolean;
  tiltOnHover?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({
    variant = 'default',
    children,
    className = '',
    onClick,
    href,
    glowOnHover = false,
    tiltOnHover = false,
    ...props
  }, ref) => {
    const [isHovered, setIsHovered] = useState(false);

    // Mouse tracking for tilt effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]));
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]));

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!tiltOnHover) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      mouseX.set((e.clientX - centerX) / rect.width);
      mouseY.set((e.clientY - centerY) / rect.height);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      if (tiltOnHover) {
        mouseX.set(0);
        mouseY.set(0);
      }
    };

    const variantClasses = {
      default: 'card',
      interactive: 'card card-interactive',
      elevated: 'card card-elevated',
      glass: 'glass card',
      magnetic: 'card card-interactive animate-magnetic',
    };

    const baseClass = `${variantClasses[variant]} ${className}`.trim();

    const cardContent = (
      <motion.div
        ref={ref}
        className={baseClass}
        style={tiltOnHover ? { rotateX, rotateY, transformStyle: 'preserve-3d' } : {}}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        whileHover={
          !tiltOnHover
            ? {
                y: variant === 'interactive' || variant === 'magnetic' ? -8 : -4,
                scale: variant === 'magnetic' ? 1.02 : 1,
              }
            : {}
        }
        whileTap={{ scale: 0.98 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
          mass: 0.8,
        }}
        {...props}
      >
        {/* Premium Glow Effect */}
        {glowOnHover && isHovered && (
          <motion.div
            className="absolute inset-0 rounded-2xl opacity-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-cyan-400/20 to-violet-500/20 rounded-2xl blur-2xl" />
          </motion.div>
        )}

        {/* Inner Highlight */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />

        {/* Animated Border */}
        {variant === 'magnetic' && (
          <motion.div
            className="absolute inset-0 rounded-2xl"
            initial={{ background: 'conic-gradient(from 0deg, transparent, transparent)' }}
            animate={{
              background: isHovered
                ? 'conic-gradient(from 0deg, rgba(14, 165, 233, 0.5), rgba(6, 182, 212, 0.5), rgba(139, 92, 246, 0.5), transparent, transparent)'
                : 'conic-gradient(from 0deg, transparent, transparent)',
            }}
            transition={{ duration: 0.8 }}
          />
        )}

        {/* Content Container */}
        <div className="relative z-10 h-full">
          {children}
        </div>
      </motion.div>
    );

    if (href) {
      return (
        <a
          href={href}
          className="block no-underline group"
        >
          {cardContent}
        </a>
      );
    }

    return cardContent;
  }
);

Card.displayName = 'Card';

/* Enhanced Card Content Components */

export const CardHeader = ({
  children,
  className = '',
  icon,
  title,
  subtitle
}: {
  children?: ReactNode;
  className?: string;
  icon?: ReactNode;
  title?: string;
  subtitle?: string;
}) => (
  <motion.div
    className={`pb-4 border-b border-slate-700/50 ${className}`}
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    {(icon || title || subtitle) && (
      <div className="flex items-start gap-3 mb-3">
        {icon && (
          <motion.div
            className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-cyan-400/20 flex items-center justify-center"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            {icon}
          </motion.div>
        )}
        {(title || subtitle) && (
          <div className="flex-1 min-w-0">
            {title && (
              <h3 className="text-lg font-semibold text-slate-100 group-hover:text-primary-400 transition-colors duration-300">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-slate-400 mt-1">{subtitle}</p>
            )}
          </div>
        )}
      </div>
    )}
    {children}
  </motion.div>
);

export const CardBody = ({
  children,
  className = '',
  padding = true
}: {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}) => (
  <motion.div
    className={`${padding ? 'py-4' : ''} ${className}`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.4, delay: 0.1 }}
  >
    {children}
  </motion.div>
);

export const CardFooter = ({
  children,
  className = '',
  justify = 'between',
  align = 'center'
}: {
  children: ReactNode;
  className?: string;
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';
}) => (
  <motion.div
    className={`pt-4 border-t border-slate-700/50 flex justify-${justify} items-${align} gap-3 ${className}`}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.2 }}
  >
    {children}
  </motion.div>
);

/* Premium Card Variants */

export const GlassCard = (props: CardProps) => <Card {...props} variant="glass" />;
export const MagneticCard = (props: CardProps) => <Card {...props} variant="magnetic" glowOnHover tiltOnHover />;
export const InteractiveCard = (props: CardProps) => <Card {...props} variant="interactive" glowOnHover />;
