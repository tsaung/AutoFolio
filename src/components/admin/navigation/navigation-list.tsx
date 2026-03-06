"use client";

import { useState } from "react";
import Link from "next/link";
import { SanityNavigation } from "@/types/sanity-types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { deleteNavigation } from "@/lib/actions/navigation";
import { toast } from "sonner";
import { Edit2, Trash2 } from "lucide-react";

interface NavigationListProps {
  initialNavigations: SanityNavigation[];
}

export function NavigationList({ initialNavigations }: NavigationListProps) {
  const [navigations, setNavigations] = useState(initialNavigations);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(id);
    try {
      await deleteNavigation(id);
      setNavigations((prev) => prev.filter((nav) => nav._id !== id));
      toast.success(`Navigation "${name}" deleted successfully.`);
    } catch (error) {
      toast.error(`Failed to delete "${name}".`);
      console.error(error);
    } finally {
      setIsDeleting(null);
    }
  };

  if (navigations.length === 0) {
    return (
      <div className="text-center p-12 border rounded-lg bg-muted/20">
        <p className="text-muted-foreground mb-4">No navigation menus found.</p>
        <Link href="/admin/navigation/new">
          <Button variant="outline">Create your first menu</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {navigations.map((nav) => (
        <Card key={nav._id} className="flex flex-col">
          <CardHeader>
            <CardTitle>{nav.name}</CardTitle>
            <CardDescription>
              {nav.items?.length || 0} top-level items
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date(nav._updatedAt).toLocaleDateString()}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <Link href={`/admin/navigation/${nav._id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button
              variant="destructive"
              size="sm"
              disabled={isDeleting === nav._id}
              onClick={() => handleDelete(nav._id, nav.name)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
