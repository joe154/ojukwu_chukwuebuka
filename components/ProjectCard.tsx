"use client";
import { MotionArticle } from "../lib/motion";
import Image from "next/image";
import Link from "next/link";

type Props = {
  project: any;
};

export default function ProjectCard({ project }: Props) {
  const src = project.cover_image || project.image || "/placeholder.jpg";
  return (
    <MotionArticle
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-slate-800 rounded-lg p-4"
    >
      <div className="overflow-hidden rounded h-48">
        <Image
          src={src}
          alt={project.title}
          width={800}
          height={450}
          className="rounded w-full h-full object-cover"
        />
      </div>
      <h3 className="mt-3 text-xl">{project.title}</h3>
      <div className="mt-2 flex gap-2 flex-wrap">
        {project.categories?.map((c: any) => (
          <span key={c.id} className="text-xs bg-slate-700 px-2 py-1 rounded">
            {c.name}
          </span>
        ))}
      </div>
      <p className="mt-2 text-sm text-slate-300">{(project.short_description || (project.description || "").replace(/<[^>]*>/g, "")).slice(0, 120)}...</p>
      <Link href={`/projects/${project.slug || project.id}`} className="mt-3 inline-block text-indigo-400">
        Read more
      </Link>
    </MotionArticle>
  );
}
