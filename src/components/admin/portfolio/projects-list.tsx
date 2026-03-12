"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  FolderKanban,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Github,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { SanityProject } from "@/types/sanity-types";
import { deleteProject, reorderProjects } from "@/lib/actions/sanity-portfolio";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ProjectsListProps {
  initialProjects: SanityProject[];
}

export function ProjectsList({ initialProjects }: ProjectsListProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingProject, setDeletingProject] = useState<SanityProject | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReordering, setIsReordering] = useState(false);

  const filteredProjects = initialProjects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  function handleDeleteClick(project: SanityProject) {
    setDeletingProject(project);
    setDeleteDialogOpen(true);
  }

  async function handleDeleteConfirm() {
    if (!deletingProject) return;
    setIsDeleting(true);

    try {
      await deleteProject(deletingProject._id);
      setDeleteDialogOpen(false);
      setDeletingProject(null);
      toast.success("Project deleted successfully");
    } catch (error) {
      console.error("Failed to delete project:", error);
      toast.error("Failed to delete project");
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleReorder(index: number, direction: "up" | "down") {
    if (isReordering) return;
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === initialProjects.length - 1) return;

    setIsReordering(true);
    const newProjects = [...initialProjects];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    // Swap items
    [newProjects[index], newProjects[targetIndex]] = [
      newProjects[targetIndex],
      newProjects[index],
    ];

    // Update sortOrder for all affected items (simple reassignment based on index)
    const updates = newProjects.map((project, idx) => ({
      id: project._id,
      sortOrder: idx,
    }));

    try {
      await reorderProjects(updates);
      toast.success("Project order updated");
    } catch (error) {
      console.error("Failed to reorder projects:", error);
      toast.error("Failed to reorder projects");
    } finally {
      setIsReordering(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage your portfolio projects.
          </p>
        </div>
        <Button onClick={() => router.push("/admin/projects/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search projects..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr className="border-b">
                  <th className="h-10 px-4 font-medium w-[50px]">Order</th>
                  <th className="h-10 px-4 font-medium">Project</th>
                  <th className="h-10 px-4 font-medium text-center">Status</th>
                  <th className="h-10 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      {searchQuery
                        ? "No projects match your search."
                        : 'No projects yet. Click "Add Project" to get started.'}
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((project, index) => (
                    <tr
                      key={project._id}
                      className="border-b last:border-0 hover:bg-muted/50"
                    >
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleReorder(index, "up")}
                            disabled={
                              index === 0 || isReordering || searchQuery !== ""
                            }
                            title="Move Up"
                          >
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleReorder(index, "down")}
                            disabled={
                              index === initialProjects.length - 1 ||
                              isReordering ||
                              searchQuery !== ""
                            }
                            title="Move Down"
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                      <td className="p-4 font-medium">
                        <div className="flex items-center gap-3">
                          <div className="bg-muted rounded-md p-2 hidden sm:block">
                            <FolderKanban className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold truncate max-w-[200px]">
                              {project.title}
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {project.tags?.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] text-muted-foreground"
                                >
                                  {tag}
                                </span>
                              ))}
                              {(project.tags?.length ?? 0) > 3 && (
                                <span className="text-[10px] text-muted-foreground">
                                  +{project.tags!.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <StatusBadge status={project.status ?? "draft"} />
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {project.liveUrl && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground"
                              asChild
                            >
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          {project.repoUrl && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground"
                              asChild
                            >
                              <a
                                href={project.repoUrl}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Github className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              router.push(`/admin/projects/${project._id}/edit`)
                            }
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteClick(project)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingProject?.title}
              &quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    published:
      "border-green-200 bg-green-50 text-green-700 dark:border-green-900/30 dark:bg-green-900/30 dark:text-green-400",
    draft:
      "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-900/30 dark:bg-yellow-900/30 dark:text-yellow-400",
    archived:
      "border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-400",
  };

  const labels: Record<string, string> = {
    published: "Published",
    draft: "Draft",
    archived: "Archived",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        styles[status] ?? styles.draft,
      )}
    >
      {labels[status] ?? status}
    </span>
  );
}
