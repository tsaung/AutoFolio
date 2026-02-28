import { getPublicProfile } from "@/lib/actions/profile";
import { getPublicBotConfig } from "@/lib/actions/bot-config";
import { getPublicProjects } from "@/lib/actions/projects";
import { getPublicExperiences } from "@/lib/actions/experiences";
import { getPublicSkills } from "@/lib/actions/skills";
import { getPublicSocialLinks } from "@/lib/actions/social-links";
import { SetupChecklist } from "@/components/visitor/setup-checklist";
import { adminClient } from "@/lib/db/admin";
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

const FloatingChat = dynamic(() =>
  import("@/components/portfolio/floating-chat").then(
    (mod) => mod.FloatingChat,
  ),
);
import { VisitorNav } from "@/components/portfolio/visitor-nav";

import { VisitorFooter } from "@/components/portfolio/visitor-footer";

export default async function VisitorPage() {
  const profile = await getPublicProfile();

  // Parallel data fetching for performance
  const [botConfig, projects, experiences, skills, socialLinks, userCheck] =
    await Promise.all([
      getPublicBotConfig(profile?.id),
      profile ? getPublicProjects(profile.id) : Promise.resolve([]),
      profile ? getPublicExperiences(profile.id) : Promise.resolve([]),
      profile ? getPublicSkills(profile.id) : Promise.resolve([]),
      profile ? getPublicSocialLinks(profile.id) : Promise.resolve([]),
      adminClient.auth.admin.listUsers({ page: 1, perPage: 1 }),
    ]);

  const hasAnyUser = userCheck.data.users.length > 0;
  const isReady = !!(profile && profile.name);

  if (!isReady) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <SetupChecklist profile={profile} hasAnyUser={hasAnyUser} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <VisitorNav name={profile?.name} avatarUrl={profile?.avatar_url} />

      <div className="container mx-auto px-4 pt-16">
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

      <VisitorFooter profile={profile} socialLinks={socialLinks} />
      <FloatingChat profile={profile} botConfig={botConfig} />
    </main>
  );
}
