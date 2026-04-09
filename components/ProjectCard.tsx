"use client";

import { Card, CardBody, CardFooter } from "./ui/Card";
import { Badge } from "./ui/Badge";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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
  
  // Try cover_image first, then image, then placeholder
  const rawSrc = project.cover_image || project.image;
  const src = imageError ? "/placeholder.jpg" : (rawSrc ? getImageUrl(rawSrc) : "/placeholder.jpg");
  const projectLink = `/projects/${project.slug || project.id}`;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group"
    >
      <Link href={projectLink} className="no-underline">
        <Card variant="interactive" className="h-full overflow-hidden flex flex-col">
          {/* Image Container */}
          <div className="relative overflow-hidden h-56 bg-gradient-to-br from-slate-700 to-slate-800">
            {/* Loading skeleton */}
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 animate-pulse" />
            )}

            {/* Image */}
            <motion.div
              className="relative w-full h-full"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
            >
              <Image
                src={src}
                alt={project.title}
                width={400}
                height={224}
                className="w-full h-full object-cover"
                onLoadingComplete={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                priority={false}
                unoptimized={process.env.NODE_ENV === 'development'}
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>

            {/* Badge overlay */}
            {project.categories && project.categories.length > 0 && (
              <div className="absolute bottom-3 left-3 flex flex-wrap gap-2 z-10">
                {project.categories.slice(0, 2).map((c: any) => (
                  <Badge key={c.id} variant="primary" size="sm">
                    {c.name}
                  </Badge>
                ))}
                {project.categories.length > 2 && (
                  <Badge variant="secondary" size="sm">
                    +{project.categories.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Content */}
          <CardBody className="flex-1 flex flex-col gap-3">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-100 group-hover:text-primary-400 transition-colors duration-200 line-clamp-2">
                {project.title}
              </h3>

              <p className="text-sm text-slate-400 line-clamp-3">
                {project.short_description || project.description?.replace(/<[^>]*>/g, "") || "No description available"}
              </p>
            </div>
          </CardBody>

          {/* Footer with CTA */}
          <CardFooter className="justify-between items-center">
            <span className="text-xs font-semibold text-primary-400 group-hover:text-primary-300 transition-colors duration-200 flex items-center gap-1">
              Learn More
              <motion.span
                initial={{ x: 0 }}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <ArrowRight className="w-3 h-3" />
              </motion.span>
            </span>

            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-400 hover:text-primary-400 transition-colors duration-200 underline no-underline hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                Visit
              </a>
            )}
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}
