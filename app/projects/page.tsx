"use client";
import useSWR from "swr";
import api from "../../lib/api";
import ProjectCard from "../../components/ProjectCard";
import { AnimatePresence } from "framer-motion";
import { MotionH2, MotionDiv } from "../../lib/motion";
import CategoryFilter from "../../components/CategoryFilter";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from '../../components/ToastProvider';

const fetcher = (url: string) => api.get(url).then((r) => r.data);

export default function Projects() {
  const { data, error } = useSWR("/projects", fetcher);
  const { data: categories, error: catError } = useSWR("/categories", fetcher);
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategory = parseInt(searchParams?.get("category") || "") || null;
  const [selectedCategory, setSelectedCategory] = useState<number | null>(initialCategory);

  useEffect(() => {
    const q = searchParams?.get("category");
    setSelectedCategory(q ? parseInt(q) : null);
  }, [searchParams]);

  const { error: showError } = useToast();
  useEffect(() => {
    if (error) showError('Failed to load projects');
  }, [error, showError]);
  useEffect(() => {
    if (catError) showError('Failed to load categories');
  }, [catError, showError]);

  const onSelectCategory = (id: number | null) => {
    setSelectedCategory(id);
    const url = new URL(window.location.href);
    if (id) url.searchParams.set("category", String(id)); else url.searchParams.delete("category");
    router.replace(url.pathname + url.search);
  };

  const filtered = !data
    ? []
    : (data as any[]).filter((p) => {
        if (!selectedCategory) return true;
        return (p.categories || []).some((c: any) => c.id === selectedCategory);
      });

  return (
    <section>
      <MotionH2 className="text-3xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        Projects
      </MotionH2>

      <div className="mt-4">
        {!categories ? (
          <div className="h-8 w-48 bg-slate-700 rounded animate-pulse" />
        ) : (
          <CategoryFilter categories={categories} selected={selectedCategory} onChange={onSelectCategory} />
        )}
      </div>

      <MotionDiv className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {!data ? (
          [1, 2, 3].map((i) => <div key={i} className="h-48 bg-slate-700 rounded-lg animate-pulse" />)
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.map((p: any) => (
              <MotionDiv key={p.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <ProjectCard project={p} />
              </MotionDiv>
            ))}
          </AnimatePresence>
        )}
      </MotionDiv>
    </section>
  );
}
