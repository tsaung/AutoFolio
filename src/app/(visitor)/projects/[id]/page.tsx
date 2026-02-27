import { getPublicProject } from "@/lib/actions/projects";
import { getPublicProfile } from "@/lib/actions/profile";
import { getPublicBotConfig } from "@/lib/actions/bot-config";
import { getPublicSocialLinks } from "@/lib/actions/social-links";
import { VisitorNav } from "@/components/portfolio/visitor-nav";
import { VisitorFooter } from "@/components/portfolio/visitor-footer";
import { FloatingChat } from "@/components/portfolio/floating-chat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { cloudinaryUrl } from "@/lib/cloudinary";

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;

  const [project, profile] = await Promise.all([
    getPublicProject(id),
    getPublicProfile(),
  ]);

  if (!project) {
    notFound();
  }

  const [botConfig, socialLinks] = await Promise.all([
    getPublicBotConfig(profile?.id),
    profile ? getPublicSocialLinks(profile.id) : Promise.resolve([]),
  ]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <VisitorNav name={profile?.name} avatarUrl={profile?.avatar_url} />

      <div className="container mx-auto px-4 py-24 space-y-12 pt-28">
        {/* Header Section */}
        <div className="space-y-6 max-w-4xl mx-auto">
          <Button asChild variant="ghost" size="sm" className="mb-4">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Portfolio
            </Link>
          </Button>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              {project.title}
            </h1>
            <div className="flex flex-wrap gap-2">
              {project.tags?.map((tag) => (
                <Badge key={tag} variant="secondary" className="px-3 py-1">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-4 pt-2">
            {project.live_url && (
              <Button asChild variant="default" size="lg">
                <Link
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Live Demo
                </Link>
              </Button>
            )}
            {project.repo_url && (
              <Button asChild variant="outline" size="lg">
                <Link
                  href={project.repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="w-5 h-5 mr-2" />
                  Source Code
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Hero Image */}
        {project.image_url && (
          <div className="max-w-5xl mx-auto bg-muted">
            <img
              src={cloudinaryUrl(project.image_url, {
                width: 1200,
                crop: "limit",
              })}
              alt={project.title}
              className="w-full h-auto object-contain block"
            />
          </div>
        )}

        {/* Content Section */}
        <div className="max-w-3xl mx-auto space-y-8 pb-12">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold border-b pb-2">About Project</h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground text-lg leading-relaxed whitespace-pre-wrap">
              {project.description}
            </div>
          </div>
        </div>
      </div>

      <VisitorFooter profile={profile} socialLinks={socialLinks} />
      <FloatingChat profile={profile} botConfig={botConfig} />
    </main>
  );
}
