"use client";
import useSWR from "swr";
import api from "../lib/api";
import ProjectCard from "../components/ProjectCard";
import { MotionSection, MotionDiv } from "../lib/motion";

const fetcher = (url: string) => api.get(url).then((r) => r.data);

export default function Home() {
  const { data } = useSWR("/projects", fetcher);
  return (
    <MotionSection className="pb-6">
      <MotionDiv
        className="hero py-12"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <h1 className="text-4xl font-bold">Hi, I'm Your Name</h1>
        <p className="mt-4 text-lg">Software engineer focused on web apps.</p>
      </MotionDiv>

      <h2 className="mt-8 text-2xl">Featured Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {!data
          ? [1, 2, 3, 4].map((i) => (
              <div key={i} className="h-44 bg-slate-700 animate-pulse rounded-lg" />
            ))
          : data.slice(0, 4).map((p: any) => <ProjectCard key={p.id} project={p} />)}
      </div>
    </MotionSection>
  );
}
