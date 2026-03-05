import { notFound } from "next/navigation";
import { getSkill } from "@/lib/actions/sanity-portfolio";
import { SkillForm } from "@/components/admin/portfolio/skill-form";

interface EditSkillPageProps {
  params: {
    id: string;
  };
}

export default async function EditSkillPage({ params }: EditSkillPageProps) {
  const { id } = await params;
  const skill = await getSkill(id);

  if (!skill) {
    notFound();
  }

  return <SkillForm initialData={skill} />;
}
