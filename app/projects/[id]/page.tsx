import ProjectDetailsClient from "../../../components/ProjectDetails";
import { notFound } from 'next/navigation';

export default async function ProjectDetails({ params }: { params: { id: string } }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${params.id}`);
  if (!res.ok) return notFound();
  const data = await res.json();
  return <ProjectDetailsClient project={data} />;
}
