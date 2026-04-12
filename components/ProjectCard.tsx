"use client";

import { MagneticCard, CardBody, CardFooter } from "./ui/Card";
import { Badge } from "./ui/Badge";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, ExternalLink, Eye, Star } from "lucide-react";
import { useState } from "react";

type Props = {
  project: any;
};

/**
 * Process image URL to ensure it's properly formatted
 * - Handle relative paths (/uploads/...)
 * - Handle absolute URLs (http://...)
 * - Fall back to placeholder if needed
 */
function getImageUrl(src?: string): string {
  if (!src) return "/placeholder.jpg";

  // If it's already an absolute URL, return as-is
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }

  // If it starts with /, assume it's relative to backend API
  if (src.startsWith("/")) {
    // Check if it's an uploads path
    if (src.startsWith("/uploads/")) {
      return src; // Relative path - browser will resolve it
    }
    return `/api${src}`; // Prepend /api if it's another endpoint
  }

  // Otherwise, assume it's a relative path that should go to /uploads/
  if (!src.startsWith("/uploads/")) {
    return `/uploads/${src}`;
  }

  return src;
}

export default function ProjectCard({ project }: Props) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tracking for enhanced interactions
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]));
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    mouseX.set((e.clientX - centerX) / rect.width);
    mouseY.set((e.clientY - centerY) / rect.height);
  };

  // Try cover_image first, then image, then placeholder
  const rawSrc = project.cover_image || project.image;
  const src = imageError ? "/placeholder.jpg" : (rawSrc ? getImageUrl(rawSrc) : "/placeholder.jpg");
  const projectLink = `/projects/${project.slug || project.id}`;

  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseX.set(0);
        mouseY.set(0);
      }}
    >
      <Link href={projectLink} className="no-underline block">
        <MagneticCard
          className="h-full overflow-hidden relative"
          glowOnHover
          tiltOnHover
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        >
          {/* Enhanced Image Container */}
          <div className="relative overflow-hidden h-56 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900">
            {/* Premium Loading Skeleton */}
            {!imageLoaded && !imageError && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{ backgroundSize: '200% 200%' }}
              />
            )}

            {/* Premium Image with Enhanced Effects */}
            <motion.div
              className="relative w-full h-full"
              style={{ transform: 'translateZ(20px)' }}
              whileHover={{
                scale: 1.08,
                filter: 'brightness(1.1) contrast(1.05)',
              }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <Image
                src={src}
                alt={project.title}
                width={400}
                height={224}
                className="w-full h-full object-cover transition-all duration-700"
                onLoadingComplete={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                priority={false}
                unoptimized={process.env.NODE_ENV === 'development'}
              />

              {/* Premium Overlay with Gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"
                initial={{ opacity: 0.6 }}
                whileHover={{ opacity: 0.8 }}
                transition={{ duration: 0.3 }}
              />

              {/* Animated Shine Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                initial={{ x: '-200%' }}
                animate={isHovered ? { x: '200%' } : { x: '-200%' }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              />
            </motion.div>

            {/* Enhanced Badge Overlay */}
            {project.categories && project.categories.length > 0 && (
              <motion.div
                className="absolute bottom-4 left-4 flex flex-wrap gap-2 z-20"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {project.categories.slice(0, 2).map((c: any, index: number) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Badge variant="primary" size="sm" className="backdrop-blur-sm bg-slate-900/70 border-slate-600/50">
                      {c.name}
                    </Badge>
                  </motion.div>
                ))}
                {project.categories.length > 2 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Badge variant="secondary" size="sm" className="backdrop-blur-sm bg-slate-800/70 border-slate-700/50">
                      +{project.categories.length - 2}
                    </Badge>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Floating Action Buttons */}
            <motion.div
              className="absolute top-4 right-4 flex gap-2 z-20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                className="w-8 h-8 rounded-full bg-slate-900/70 backdrop-blur-sm border border-slate-600/50 flex items-center justify-center text-slate-300 hover:text-primary-400 hover:bg-slate-800/70 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.preventDefault();
                  // Handle preview action
                }}
              >
                <Eye className="w-4 h-4" />
              </motion.button>
              {project.link && (
                <motion.a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-900/70 backdrop-blur-sm border border-slate-600/50 flex items-center justify-center text-slate-300 hover:text-primary-400 hover:bg-slate-800/70 transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-4 h-4" />
                </motion.a>
              )}
            </motion.div>
          </div>

          {/* Enhanced Content */}
          <CardBody className="flex-1 flex flex-col gap-4 p-6">
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <motion.h3
                className="text-xl font-bold text-slate-100 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary-400 group-hover:to-cyan-400 transition-all duration-300 line-clamp-2"
                whileHover={{ scale: 1.02 }}
              >
                {project.title}
              </motion.h3>

              <motion.p
                className="text-sm text-slate-400 line-clamp-3 leading-relaxed"
                initial={{ opacity: 0.8 }}
                whileHover={{ opacity: 1 }}
              >
                {project.short_description || project.description?.replace(/<[^>]*>/g, "") || "No description available"}
              </motion.p>
            </motion.div>

            {/* Enhanced Stats */}
            {project.stats && (
              <motion.div
                className="flex items-center gap-4 text-xs text-slate-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {project.stats.stars && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    <span>{project.stats.stars}</span>
                  </div>
                )}
                {project.stats.views && (
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{project.stats.views}</span>
                  </div>
                )}
              </motion.div>
            )}
          </CardBody>

          {/* Enhanced Footer with CTA */}
          <CardFooter className="justify-between items-center px-6 pb-6">
            <motion.span
              className="text-sm font-semibold text-primary-400 group-hover:text-primary-300 transition-all duration-300 flex items-center gap-2"
              whileHover={{ x: 4 }}
            >
              <span>View Project</span>
              <motion.div
                animate={isHovered ? { x: 4 } : { x: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </motion.span>

            {/* Animated Progress Bar */}
            <motion.div
              className="w-16 h-1 bg-slate-700 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-primary-500 to-cyan-400 rounded-full"
                initial={{ width: '0%' }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </motion.div>
          </CardFooter>
        </MagneticCard>
      </Link>
    </motion.div>
  );
}
