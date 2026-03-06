import { notFound } from "next/navigation";
import { getExperience } from "@/lib/actions/sanity-experiences"; // Now exists
import { ExperienceForm } from "@/components/admin/portfolio/experience-form";

interface EditExperiencePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditExperiencePage({
  params,
}: EditExperiencePageProps) {
  const { id } = await params;
  const experience = await getExperience(id);

  if (!experience) {
    notFound();
  }

  return <ExperienceForm initialData={experience} />;
}
