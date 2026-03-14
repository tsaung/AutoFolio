import { getPublicProfile } from "@/lib/actions/profile";
import { getPublicBotConfig } from "@/lib/actions/bot-config";
import { getPublicProjects } from "@/lib/actions/projects";
import { getPublicExperiences } from "@/lib/actions/experiences";
import { getPublicSkills } from "@/lib/actions/skills";
import { getPublicSiteSettings } from "@/lib/actions/site-settings";

import { ProfileHero } from "@/components/visitor/profile-hero";
import { ProjectsGrid } from "@/components/portfolio/projects-grid";

import dynamic from "next/dynamic";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const ExperienceTimeline = dynamic(() =>
  import("@/components/portfolio/experience-timeline").then(
    (mod) => mod.ExperienceTimeline,
  ),
);

import { VisitorNav } from "@/components/portfolio/visitor-nav";

import { VisitorFooter } from "@/components/portfolio/visitor-footer";

export default async function VisitorPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const profile = await getPublicProfile();

  // Extract preview params
  const { preview } = await searchParams;
  const isPreview = preview === "true";

  // Parallel data fetching for performance
  const [projects, experiences, skills, siteSettings] = await Promise.all([
    profile ? getPublicProjects(profile.id, isPreview) : Promise.resolve([]),
    profile ? getPublicExperiences(profile.id, isPreview) : Promise.resolve([]),
    profile ? getPublicSkills(profile.id) : Promise.resolve([]),
    getPublicSiteSettings(),
  ]);

  const socialLinks = siteSettings?.footer?.socialLinks || [];

  return (
    <div className="flex flex-col min-h-max w-full bg-background text-foreground">
      <VisitorNav name={profile?.name} avatarUrl={profile?.avatar_url} siteSettings={siteSettings} />

      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section
          id="about"
          className="min-h-[60vh] flex flex-col justify-center"
        >
          <ProfileHero
            profile={profile}
            socialLinks={socialLinks}
            skills={skills}
          />
        </section>
      </div>

      {/* Projects Section */}
      {projects.length > 0 && (
        <section
          id="projects"
          className="relative w-full py-24 my-24 bg-background text-foreground overflow-hidden border-y border-border/50 bg-grid-pattern"
        >
          <div className="container mx-auto px-4 relative z-10 space-y-8">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Featured Projects
              </h2>
              <p className="text-muted-foreground">
                Some of the things I've built
              </p>
            </div>
            <ProjectsGrid projects={projects} />
          </div>
        </section>
      )}

      <div className="container mx-auto px-4 pb-24 space-y-24 flex-grow">
        {/* Experience Section */}
        {experiences.length > 0 && (
          <section
            id="experience"
            className="space-y-8 scroll-mt-24 max-w-3xl mx-auto"
          >
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Work Experience
              </h2>
              <p className="text-muted-foreground">My professional journey</p>
            </div>
            <Separator className="max-w-xs mx-auto" />
            <ExperienceTimeline experiences={experiences} />
          </section>
        )}
      </div>

      <VisitorFooter profile={profile} socialLinks={socialLinks} siteSettings={siteSettings} />
    </div>
  );
}
