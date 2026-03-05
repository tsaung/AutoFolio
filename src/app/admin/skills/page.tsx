import { getSkills } from "@/lib/actions/sanity-portfolio";
import { SkillsList } from "@/components/admin/portfolio/skills-list";

export default async function SkillsPage() {
  const skills = await getSkills();

  return <SkillsList initialSkills={skills} />;
}
