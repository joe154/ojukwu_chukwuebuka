import Link from "next/link";
import ProjectCard from "../../../components/ProjectCard";
import { notFound } from "next/navigation";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props) {
  const slug = params.slug;
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
  try {
    const res = await fetch(`${API_BASE}/categories/${encodeURIComponent(slug)}`);
    if (!res.ok) return { title: 'Category' };
    const cat = await res.json();
    return {
      title: `${cat.name} — Category`,
      description: `Projects in ${cat.name}`
    };
  } catch (e) {
    return { title: 'Category' };
  }
}

export default async function CategoryPage({ params }: Props) {
  const slug = params.slug;
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

  const catRes = await fetch(`${API_BASE}/categories/${encodeURIComponent(slug)}`);
  if (!catRes.ok) notFound();
  const category = await catRes.json();

  const projectsRes = await fetch(`${API_BASE}/projects?category=${encodeURIComponent(slug)}`);
  const projects = projectsRes.ok ? await projectsRes.json() : [];

  return (
    <section>
      <h2 className="text-3xl">{category.name}</h2>
      <p className="text-sm text-slate-400 mt-2">Projects tagged in "{category.name}"</p>

      <div className="mt-6">
        {projects.length === 0 ? (
          <div className="text-gray-500 mt-4">No projects found in this category.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((p: any) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-8">
        <Link href="/categories" className="text-indigo-400">Back to categories</Link>
      </div>
    </section>
  );
}
