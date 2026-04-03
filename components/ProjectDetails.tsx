"use client";
import React from "react";
import { MotionArticle } from "../lib/motion";
import Image from "next/image";

export default function ProjectDetails({ project }: { project: any }) {
  if (!project) return <div>Not found</div>;
  return (
    <MotionArticle
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="prose max-w-3xl mx-auto py-6"
    >
      <h2 className="text-3xl">{project.title}</h2>
      <div className="mt-2 flex gap-2 flex-wrap">
        {project.categories?.map((c: any) => (
          <span key={c.id} className="text-sm bg-slate-800 px-2 py-1 rounded">
            {c.name}
          </span>
        ))}
      </div>
      {project.cover_image && (
        <div className="my-4 overflow-hidden rounded">
          <Image src={project.cover_image} alt={project.title} width={1200} height={600} className="w-full h-auto object-cover rounded" />
        </div>
      )}
      <div dangerouslySetInnerHTML={{ __html: project.description || '' }} />
      {project.live_link && (
        <p>
          <a href={project.live_link} target="_blank" rel="noreferrer" className="text-indigo-500">View live</a>
        </p>
      )}
    </MotionArticle>
  );
}
