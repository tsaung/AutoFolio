"use client";

import { Database } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { cloudinaryLoader } from "@/lib/cloudinary-loader";
import { BrowserMockup } from "@/components/portfolio/browser-mockup";

type Project = Database["public"]["Tables"]["projects"]["Row"];

interface ProjectsGridProps {
  projects: Project[];
}

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((project) => (
        <div
          key={project.id}
          className="group relative flex flex-col h-full bg-transparent transition-all duration-300"
        >
          {/* Main Click Area */}
          <Link
            href={`/projects/${project.id}`}
            className="flex-1 flex flex-col"
          >
            {/* Image Container */}
            <div className="relative w-full aspect-[4/3] flex items-start justify-center">
              {project.image_url ? (
                <BrowserMockup
                  url={project.live_url || project.repo_url || undefined}
                  className="w-full h-full border-none shadow-none rounded-2xl rounded-b-none"
                >
                  <Image
                    loader={cloudinaryLoader}
                    src={project.image_url}
                    alt={project.title}
                    width={600}
                    height={450}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="w-full h-full object-cover"
                  />
                </BrowserMockup>
              ) : (
                <div className="flex items-center justify-center w-full h-full text-muted-foreground bg-muted/20 rounded-xl border border-border/20 shadow-sm">
                  <span className="text-4xl filter grayscale opacity-50">
                    🚀
                  </span>
                </div>
              )}
            </div>

            {/* Content Body */}
            <div
              className={`flex-1 flex flex-col pt-5 p-4 bg-card/90 backdrop-blur-md border-x border-border/50 shadow-sm transition-all duration-300 group-hover:shadow-md z-10 -mt-1 ${!(project.live_url || project.repo_url) ? "rounded-b-xl border-b" : ""}`}
            >
              {/* Title */}
              <h3 className="font-semibold leading-none group-hover:text-primary transition-colors line-clamp-1">
                {project.title}
              </h3>

              {/* Tag chips */}
              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {project.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium text-muted-foreground outline outline-1 outline-border px-2 py-0.5 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Description */}
              <p className="text-sm text-muted-foreground line-clamp-2 mt-3">
                {project.description}
              </p>
            </div>
          </Link>

          {/* Footer Actions — outside Link to avoid nested <a> */}
          {(project.live_url || project.repo_url) && (
            <div className="flex gap-4 px-4 py-3 border-t border-border/50 bg-card/90 backdrop-blur-md rounded-b-xl border-x border-b border-border/50 z-10">
              {project.live_url && (
                <Link
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors py-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Live Demo
                </Link>
              )}
              {project.repo_url && (
                <Link
                  href={project.repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors py-1"
                >
                  <Github className="w-3.5 h-3.5" />
                  Source Code
                </Link>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
