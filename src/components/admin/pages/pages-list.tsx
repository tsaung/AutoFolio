"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  FileText,
  ExternalLink,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type PageListItem = {
  _id: string;
  title: string;
  slug: string;
  _updatedAt: string;
};

export function PagesList({ initialPages }: { initialPages: PageListItem[] }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [pages] = useState<PageListItem[]>(initialPages);

  const filteredPages = pages.filter((page) =>
    page.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.slug?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pages</h1>
          <p className="text-muted-foreground">
            Manage your dynamic site pages via the page builder.
          </p>
        </div>
        <Button onClick={() => router.push("/admin/pages/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Page
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search pages..."
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
                  <th className="h-10 px-4 font-medium">Page Title</th>
                  <th className="h-10 px-4 font-medium">Slug / Path</th>
                  <th className="h-10 px-4 font-medium text-right">Last Updated</th>
                  <th className="h-10 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPages.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="h-24 text-center text-muted-foreground"
                    >
                      {searchQuery
                        ? "No pages match your search."
                        : 'No pages yet. Click "Add Page" to get started.'}
                    </td>
                  </tr>
                ) : (
                  filteredPages.map((page) => (
                    <tr
                      key={page._id}
                      className="border-b last:border-0 hover:bg-muted/50"
                    >
                      <td className="p-4 font-medium">
                        <div className="flex items-center gap-3">
                          <div className="bg-muted rounded-md p-2 hidden sm:block">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <span>{page.title}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <code className="text-xs bg-muted/50 px-2 py-1 rounded">
                          /{page.slug === 'home' ? '' : page.slug}
                        </code>
                      </td>
                      <td className="p-4 text-right text-muted-foreground">
                        {page._updatedAt
                          ? formatDistanceToNow(new Date(page._updatedAt), {
                              addSuffix: true,
                            })
                          : "Never"}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground"
                            asChild
                          >
                            <a
                              href={`/${page.slug === 'home' ? '' : page.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              title="View live page"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              router.push(`/admin/pages/${page._id}/edit`)
                            }
                            title="Edit page builder"
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          {/* For now we disable delete to keep it simple, typically you delete via Studio but we can add later */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            disabled
                            title="Delete not implemented in sandbox"
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
    </div>
  );
}
