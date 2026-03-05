import { getExperiences } from "@/lib/actions/sanity-experiences";
import { ExperiencesList } from "@/components/admin/portfolio/experiences-list";

export default async function ExperiencesPage() {
  const experiences = await getExperiences();

  return <ExperiencesList initialExperiences={experiences} />;
}
