"use client";

import { Database } from "@/types/database";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
          className="group relative flex flex-col h-full bg-transparent"
        >
          {/* Main Click Area */}
          <Link
            href={`/projects/${project.id}`}
            className="flex-1 flex flex-col"
          >
            {/* Image Container */}
            <div className="relative w-full aspect-[4/3] mb-6 flex items-start justify-center">
              {project.image_url ? (
                <BrowserMockup
                  url={project.live_url || project.repo_url || undefined}
                  className="w-full h-full"
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
                <div className="flex items-center justify-center w-full h-full text-muted-foreground bg-muted/20 rounded-xl border border-border/20 shadow-sm transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl">
                  <span className="text-4xl filter grayscale opacity-50">
                    🚀
                  </span>
                </div>
              )}
            </div>

            {/* Content Body */}
            <div className="flex flex-col flex-1 space-y-4 px-1">
              <div className="space-y-2.5">
                <h3 className="font-bold text-2xl tracking-tight group-hover:text-primary transition-colors line-clamp-1">
                  {project.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags &&
                    project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-medium text-secondary-foreground bg-secondary px-2 py-0.5 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  {project.tags && project.tags.length > 3 && (
                    <span className="text-xs text-muted-foreground px-1 py-0.5">
                      +{project.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                {project.description}
              </p>
            </div>
          </Link>

          {/* Footer Actions (Subtle) */}
          {(project.live_url || project.repo_url) && (
            <div className="px-1 pb-2 pt-6 flex gap-4 mt-auto">
              {project.live_url && (
                <Link
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors py-2 px-2 -mx-2 rounded-md min-h-[44px]"
                  onClick={(e) => e.stopPropagation()}
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
                  className="text-sm font-medium flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors py-2 px-2 -mx-2 rounded-md min-h-[44px]"
                  onClick={(e) => e.stopPropagation()}
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
