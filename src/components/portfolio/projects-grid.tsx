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
import { cloudinaryUrl } from "@/lib/cloudinary";

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
          className="group relative flex flex-col h-full rounded-2xl overflow-hidden bg-card border border-border/40 hover:border-border/60 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          {/* Main Click Area */}
          <Link
            href={`/projects/${project.id}`}
            className="flex-1 flex flex-col"
          >
            {/* Image Container */}
            <div className="relative w-full aspect-[4/3] bg-muted overflow-hidden">
              {project.image_url ? (
                <img
                  src={cloudinaryUrl(project.image_url, {
                    width: 600,
                    height: 450,
                    crop: "fill",
                  })}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-muted-foreground bg-muted/50">
                  <span className="text-4xl filter grayscale opacity-50">
                    🚀
                  </span>
                </div>
              )}
              {/* Overlay Gradient on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Content Body */}
            <div className="flex flex-col flex-1 p-5 space-y-3">
              <div className="space-y-1">
                <h3 className="font-bold text-xl leading-tight group-hover:text-primary transition-colors line-clamp-1">
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
            <div className="px-5 pb-5 pt-0 flex gap-3 mt-auto">
              {project.live_url && (
                <Link
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors py-2 px-2 -mx-2 rounded-md min-h-[44px]"
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
                  className="text-xs font-medium flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors py-2 px-2 -mx-2 rounded-md min-h-[44px]"
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
