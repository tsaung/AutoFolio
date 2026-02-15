"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, FileText, Pencil, Trash2 } from "lucide-react";
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
import { Database } from "@/types/database";
import { deleteDocument } from "@/lib/actions/knowledge";

type KnowledgeDocument =
  Database["public"]["Tables"]["knowledge_documents"]["Row"];

interface KnowledgeListProps {
  initialDocuments: KnowledgeDocument[];
}

export function KnowledgeList({ initialDocuments }: KnowledgeListProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingDocument, setDeletingDocument] =
    useState<KnowledgeDocument | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredDocuments = initialDocuments.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  function handleDeleteClick(doc: KnowledgeDocument) {
    setDeletingDocument(doc);
    setDeleteDialogOpen(true);
  }

  async function handleDeleteConfirm() {
    if (!deletingDocument) return;
    setIsDeleting(true);

    try {
      await deleteDocument(deletingDocument.id);
      setDeleteDialogOpen(false);
      setDeletingDocument(null);
    } catch (error) {
      console.error("Failed to delete document:", error);
    } finally {
      setIsDeleting(false);
    }
  }

  function formatDate(dateString: string | null) {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Knowledge Base</h1>
          <p className="text-muted-foreground">
            {initialDocuments.length === 0
              ? "Add documents for the AI to reference when answering questions."
              : `${initialDocuments.length} document${initialDocuments.length === 1 ? "" : "s"} in your knowledge base.`}
          </p>
        </div>
        <Button onClick={() => router.push("/knowledge/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Create New
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search documents..."
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
                  <th className="h-10 px-4 font-medium">Title</th>
                  <th className="h-10 px-4 font-medium">Type</th>
                  <th className="h-10 px-4 font-medium hidden sm:table-cell">
                    Last Updated
                  </th>
                  <th className="h-10 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="h-24 text-center text-muted-foreground"
                    >
                      {searchQuery
                        ? "No documents match your search."
                        : 'No documents yet. Click "Create New" to get started.'}
                    </td>
                  </tr>
                ) : (
                  filteredDocuments.map((doc) => (
                    <tr
                      key={doc.id}
                      className="border-b last:border-0 hover:bg-muted/50"
                    >
                      <td className="p-4 font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="truncate max-w-[200px] sm:max-w-none">
                            {doc.title}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <TypeBadge type={doc.type} />
                      </td>
                      <td className="p-4 text-muted-foreground hidden sm:table-cell">
                        {formatDate(doc.updated_at)}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              router.push(`/knowledge/${doc.id}/edit`)
                            }
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteClick(doc)}
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
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingDocument?.title}
              &quot;? This action cannot be undone and will also remove any
              associated chunks.
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

function TypeBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    manual:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    ai_generated:
      "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  };

  const labels: Record<string, string> = {
    manual: "Manual",
    ai_generated: "AI Generated",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        styles[type] ?? styles.manual,
      )}
    >
      {labels[type] ?? type}
    </span>
  );
}
