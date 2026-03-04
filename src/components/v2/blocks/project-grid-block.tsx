import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SanityImage = {
  asset: { _ref: string };
  hotspot?: { x: number; y: number };
};

type Project = {
  _id: string;
  title: string;
  slug: { current: string };
  description: string;
  image?: SanityImage;
  liveUrl?: string;
  repoUrl?: string;
  tags?: string[];
  status?: string;
};

export type ProjectGridBlockData = {
  _type: "projectGridBlock";
  _key: string;
  projects: Project[];
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ProjectGridBlock({ data }: { data: ProjectGridBlockData }) {
  if (!data.projects || data.projects.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-6 py-16">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {data.projects.map((project) => (
          <div
            key={project._id || project.slug.current}
            className="flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md"
          >
            {project.image?.asset && (
              <div className="relative aspect-video w-full overflow-hidden border-b bg-muted">
                <Image
                  src={urlFor(project.image).width(600).height(400).url()}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}

            <div className="flex flex-1 flex-col p-6">
              <h3 className="mb-2 text-xl font-bold tracking-tight">
                {project.title}
              </h3>

              <p className="mb-4 flex-1 text-sm text-muted-foreground line-clamp-3">
                {project.description}
              </p>

              {project.tags && project.tags.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-4 pt-4 mt-auto border-t">
                {project.liveUrl && (
                  <Link
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                  >
                    View Live
                  </Link>
                )}
                {project.repoUrl && (
                  <Link
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Source Code
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
