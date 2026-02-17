"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  Share2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
} from "lucide-react";
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
import {
  deleteSocialLink,
  reorderSocialLinks,
} from "@/lib/actions/social-links";
import { toast } from "sonner";
import Link from "next/link";
import { SocialLinkForm } from "@/components/admin/portfolio/social-link-form";

type SocialLink = Database["public"]["Tables"]["social_links"]["Row"];

interface SocialLinksListProps {
  initialLinks: SocialLink[];
}

export function SocialLinksList({ initialLinks }: SocialLinksListProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deletingLink, setDeletingLink] = useState<SocialLink | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReordering, setIsReordering] = useState(false);

  function handleDeleteClick(link: SocialLink) {
    setDeletingLink(link);
    setDeleteDialogOpen(true);
  }

  async function handleDeleteConfirm() {
    if (!deletingLink) return;
    setIsDeleting(true);

    try {
      await deleteSocialLink(deletingLink.id);
      setDeleteDialogOpen(false);
      setDeletingLink(null);
      toast.success("Social link deleted successfully");
    } catch (error) {
      console.error("Failed to delete social link:", error);
      toast.error("Failed to delete social link");
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleReorder(index: number, direction: "up" | "down") {
    if (isReordering) return;
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === initialLinks.length - 1) return;

    setIsReordering(true);
    const newLinks = [...initialLinks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    // Swap items
    [newLinks[index], newLinks[targetIndex]] = [
      newLinks[targetIndex],
      newLinks[index],
    ];

    // Update sort_order for all affected items
    const updates = newLinks.map((link, idx) => ({
      id: link.id,
      sort_order: idx,
    }));

    try {
      await reorderSocialLinks(updates);
      toast.success("Order updated");
    } catch (error) {
      console.error("Failed to reorder links:", error);
      toast.error("Failed to reorder links");
    } finally {
      setIsReordering(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Social Links</h1>
          <p className="text-muted-foreground">
            Manage your social media profiles and external links.
          </p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Link
        </Button>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr className="border-b">
              <th className="h-10 px-4 font-medium w-[50px]">Order</th>
              <th className="h-10 px-4 font-medium">Platform / Label</th>
              <th className="h-10 px-4 font-medium hidden sm:table-cell">
                URL
              </th>
              <th className="h-10 px-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {initialLinks.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  No social links added yet. Click &quot;Add Link&quot; to get
                  started.
                </td>
              </tr>
            ) : (
              initialLinks.map((link, index) => (
                <tr
                  key={link.id}
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
                          index === initialLinks.length - 1 || isReordering
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
                        <Share2 className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold">{link.platform}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <Link
                      href={link.url}
                      target="_blank"
                      className="flex items-center gap-1 hover:underline text-muted-foreground"
                    >
                      {link.url}
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          router.push(`/portfolio/social-links/${link.id}/edit`)
                        }
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteClick(link)}
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
            <DialogTitle>Delete Social Link</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this link? This action cannot be
              undone.
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

      {/* Add Social Link Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Social Link</DialogTitle>
            <DialogDescription>
              Add a link to your social media profile or external site.
            </DialogDescription>
          </DialogHeader>
          <SocialLinkForm isDialog onSuccess={() => setAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
