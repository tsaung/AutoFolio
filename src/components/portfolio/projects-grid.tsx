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

type Project = Database["public"]["Tables"]["projects"]["Row"];

interface ProjectsGridProps {
  projects: Project[];
}

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Card
          key={project.id}
          className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 border-muted"
        >
          <div className="relative w-full h-48 bg-muted">
            {project.image_url ? (
              <img
                src={project.image_url}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                <span className="text-4xl">🚀</span>
              </div>
            )}
          </div>
          <CardHeader>
            <CardTitle>{project.title}</CardTitle>
            <div className="flex flex-wrap gap-2 mt-2">
              {project.tags &&
                project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <CardDescription className="line-clamp-3">
              {project.description}
            </CardDescription>
          </CardContent>
          <CardFooter className="flex gap-2">
            {project.live_url && (
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Demo
                </Link>
              </Button>
            )}
            {project.repo_url && (
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link
                  href={project.repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="w-4 h-4 mr-2" />
                  Code
                </Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
