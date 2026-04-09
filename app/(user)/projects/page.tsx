"use client";

import useSWR from "swr";
import api from "../../../lib/api";
import ProjectCard from "../../../components/ProjectCard";
import { AnimatePresence, motion } from "framer-motion";
import { MotionH2, MotionDiv } from "../../../lib/motion";
import CategoryFilter from "../../../components/CategoryFilter";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "../../../components/ToastProvider";
import { ProjectGridSkeleton } from "../../../components/ui/Skeleton";
import { ErrorFallback } from "../../../components/ui/ErrorFallback";
import { Badge } from "../../../components/ui/Badge";
import { Filter, Grid3x3, List } from "lucide-react";

const fetcher = (url: string) => api.get(url).then((r) => r.data);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function Projects() {
  const { data: projects, error, isLoading } = useSWR("/projects", fetcher);
  const { data: categories, error: catError } = useSWR("/categories", fetcher);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const { error: showError } = useToast();

  useEffect(() => {
    const q = searchParams?.get("category");
    setSelectedCategory(q ? parseInt(q) : null);
  }, [searchParams]);

  useEffect(() => {
    if (error) showError("Failed to load projects");
  }, [error, showError]);

  useEffect(() => {
    if (catError) showError("Failed to load categories");
  }, [catError, showError]);

  const onSelectCategory = (id: number | null) => {
    setSelectedCategory(id);
    const url = new URL(window.location.href);
    if (id) url.searchParams.set("category", String(id));
    else url.searchParams.delete("category");
    router.replace(url.pathname + url.search);
  };

  const filtered = !projects
    ? []
    : (projects as any[]).filter((p) => {
        const matchesCategory = !selectedCategory || (p.categories || []).some((c: any) => c.id === selectedCategory);
        const matchesSearch =
          !searchQuery ||
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.short_description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.description || "").toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      });

  return (
    <motion.section className="pb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      {/* Page Header */}
      <motion.div
        className="space-y-6 mb-12 sm:mb-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Grid3x3 className="w-5 h-5 text-primary-400" />
            <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-400">
              My Portfolio
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold">
            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-400">Projects</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl">
            A curated collection of my recent work spanning web development, design, and full-stack applications.
          </p>
        </div>
      </motion.div>

      {/* Filters and Controls */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4 mb-10 sm:mb-12 items-start sm:items-center justify-between"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Search Input */}
        <div className="relative flex-1 max-w-md w-full">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input w-full"
          />
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-all duration-200 ${
              viewMode === "grid"
                ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30"
                : "bg-slate-700/50 text-slate-400 hover:bg-slate-700"
            }`}
            aria-label="Grid view"
          >
            <Grid3x3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-all duration-200 ${
              viewMode === "list"
                ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30"
                : "bg-slate-700/50 text-slate-400 hover:bg-slate-700"
            }`}
            aria-label="List view"
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </motion.div>

      {/* Categories Filter */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-primary-400" />
            <span className="text-sm font-semibold text-slate-300">Filter by Category</span>
          </div>

          {!categories ? (
            <div className="h-10 w-full bg-gradient-to-r from-slate-700/50 via-slate-600/50 to-slate-700/50 rounded-lg animate-pulse" />
          ) : (
            <CategoryFilter categories={categories} selected={selectedCategory} onChange={onSelectCategory} />
          )}
        </div>
      </motion.div>

      {/* Results Info */}
      {!isLoading && (
        <motion.div className="mb-8 flex items-center justify-between" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <span className="text-sm text-slate-400">
            Showing <span className="font-semibold text-slate-200">{filtered.length}</span> of{" "}
            <span className="font-semibold text-slate-200">{projects?.length || 0}</span> projects
          </span>
          {selectedCategory && (
            <motion.button
              onClick={() => onSelectCategory(null)}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-700/50 text-slate-300 hover:bg-slate-700 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear filters
            </motion.button>
          )}
        </motion.div>
      )}

      {/* Projects Grid/List */}
      {isLoading ? (
        <ProjectGridSkeleton count={viewMode === "grid" ? 6 : 4} />
      ) : error ? (
        <ErrorFallback
          title="Failed to Load Projects"
          message="Something went wrong while loading the projects. Please try again."
          action={{
            label: "Retry",
            onClick: () => window.location.reload(),
          }}
        />
      ) : filtered.length === 0 ? (
        <motion.div
          className="card text-center py-16"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Grid3x3 className="w-12 h-12 mx-auto text-slate-600 mb-4 opacity-50" />
          <p className="text-slate-400 mb-2">No projects found</p>
          <p className="text-sm text-slate-500">
            {searchQuery ? "Try adjusting your search query" : "Try selecting a different category"}
          </p>
        </motion.div>
      ) : viewMode === "grid" ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key="grid"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((p: any) => (
              <motion.div key={p.id} variants={itemVariants} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                <ProjectCard project={p} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible" key="list">
          <AnimatePresence mode="popLayout">
            {filtered.map((p: any) => (
              <motion.div
                key={p.id}
                variants={itemVariants}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <a href={`/projects/${p.slug || p.id}`} className="no-underline">
                  <div className="card p-6 hover:border-primary-500/50 group">
                    <div className="flex gap-4 items-start">
                      {(p.cover_image || p.image) && (
                        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-slate-700">
                          <img
                            src={p.cover_image || p.image}
                            alt={p.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="flex-1 space-y-3">
                        <div className="space-y-1">
                          <h3 className="text-lg font-bold text-slate-100 group-hover:text-primary-400 transition-colors duration-200">
                            {p.title}
                          </h3>
                          <p className="text-sm text-slate-400 line-clamp-2">
                            {p.short_description || p.description?.replace(/<[^>]*>/g, "")}
                          </p>
                        </div>
                        {p.categories && (
                          <div className="flex gap-2 flex-wrap">
                            {p.categories.slice(0, 3).map((c: any) => (
                              <Badge key={c.id} variant="primary" size="sm">
                                {c.name}
                              </Badge>
                            ))}
                            {p.categories.length > 3 && (
                              <Badge variant="secondary" size="sm">
                                +{p.categories.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.section>
  );
}
