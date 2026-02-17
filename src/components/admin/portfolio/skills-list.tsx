"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Code2, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Database } from "@/types/database";
import { deleteSkill, reorderSkills } from "@/lib/actions/skills";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress"; // Using Progress for proficiency visual
import { toast } from "sonner";

import { SkillForm } from "@/components/admin/portfolio/skill-form";

type Skill = Database["public"]["Tables"]["skills"]["Row"];

interface SkillsListProps {
  initialSkills: Skill[];
}

export function SkillsList({ initialSkills }: SkillsListProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deletingSkill, setDeletingSkill] = useState<Skill | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReordering, setIsReordering] = useState(false);

  function handleDeleteClick(skill: Skill) {
    setDeletingSkill(skill);
    setDeleteDialogOpen(true);
  }

  async function handleDeleteConfirm() {
    if (!deletingSkill) return;
    setIsDeleting(true);

    try {
      await deleteSkill(deletingSkill.id);
      setDeleteDialogOpen(false);
      setDeletingSkill(null);
      toast.success("Skill deleted successfully");
    } catch (error) {
      console.error("Failed to delete skill:", error);
      toast.error("Failed to delete skill");
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleReorder(index: number, direction: "up" | "down") {
    if (isReordering) return;
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === initialSkills.length - 1) return;

    setIsReordering(true);
    const newSkills = [...initialSkills];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    // Swap items
    [newSkills[index], newSkills[targetIndex]] = [
      newSkills[targetIndex],
      newSkills[index],
    ];

    // Update sort_order for all affected items
    const updates = newSkills.map((skill, idx) => ({
      id: skill.id,
      sort_order: idx,
    }));

    try {
      await reorderSkills(updates);
      toast.success("Skill order updated");
    } catch (error) {
      console.error("Failed to reorder skills:", error);
      toast.error("Failed to reorder skills");
    } finally {
      setIsReordering(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Skills</h1>
          <p className="text-muted-foreground">
            Manage your technical skills and proficiencies.
          </p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Skill
        </Button>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr className="border-b">
              <th className="h-10 px-4 font-medium w-[50px]">Order</th>
              <th className="h-10 px-4 font-medium">Skill</th>
              <th className="h-10 px-4 font-medium hidden sm:table-cell">
                Category
              </th>
              <th className="h-10 px-4 font-medium hidden md:table-cell w-[200px]">
                Proficiency
              </th>
              <th className="h-10 px-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {initialSkills.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No skills added yet. Click &quot;Add Skill&quot; to get
                  started.
                </td>
              </tr>
            ) : (
              initialSkills.map((skill, index) => (
                <tr
                  key={skill.id}
                  className="border-b last:border-0 hover:bg-muted/50"
                >
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleReorder(index, "up")}
                        disabled={index === 0 || isReordering}
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
                          index === initialSkills.length - 1 || isReordering
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
                        <Code2 className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <span className="font-semibold text-base">
                        {skill.name}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <Badge variant="outline">{skill.category}</Badge>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <Progress
                        value={(skill.proficiency ?? 0) * 20}
                        className="h-2 w-[100px]"
                      />
                      <span className="text-xs text-muted-foreground">
                        Level {skill.proficiency}/5
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          router.push(`/portfolio/skills/${skill.id}/edit`)
                        }
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteClick(skill)}
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

      <button
        className="hidden" // Hidden button to prevent form submission on enter
        type="submit"
        disabled={isDeleting}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Skill</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingSkill?.name}&quot;?
              This action cannot be undone.
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

      {/* Add Skill Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Skill</DialogTitle>
            <DialogDescription>
              Add a technical skill to your portfolio.
            </DialogDescription>
          </DialogHeader>
          <SkillForm isDialog onSuccess={() => setAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
