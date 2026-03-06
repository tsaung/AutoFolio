import { notFound } from "next/navigation";
import { getProject } from "@/lib/actions/sanity-portfolio";
import { ProjectForm } from "@/components/admin/portfolio/project-form";

interface EditProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  return <ProjectForm initialData={project} />;
}
