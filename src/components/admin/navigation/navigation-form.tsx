"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SanityNavigation, SanityPage, SanityNavigationItem } from "@/types/sanity-types";
import { createNavigation, updateNavigation } from "@/lib/actions/navigation";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SortableTree } from "./sortable-tree/sortable-tree";
import { TreeItem } from "./sortable-tree/types";

// Flatten Sanity tree to flat list for dnd-kit
function buildFlatTree(
  items: SanityNavigationItem[],
  parentId: string | null = null,
  depth = 0
): TreeItem[] {
  let result: TreeItem[] = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    // Generate a temporary key if one doesn't exist
    const id = item._key || `temp-${Math.random().toString(36).substr(2, 9)}`;
    result.push({
      id,
      parentId,
      depth,
      item: { ...item, _key: id },
    });
    if (item.children && item.children.length > 0) {
      result = result.concat(buildFlatTree(item.children, id, depth + 1));
    }
  }
  return result;
}

// Convert flat list back to nested Sanity objects
function buildNestedTree(flatItems: TreeItem[]): SanityNavigationItem[] {
  const itemMap = new Map<string, SanityNavigationItem>();
  const rootItems: SanityNavigationItem[] = [];

  // First pass: Create new objects
  for (const flatItem of flatItems) {
    const itemData = { ...flatItem.item, children: [] };
    itemMap.set(String(flatItem.id), itemData);
  }

  // Second pass: Link children to parents
  for (const flatItem of flatItems) {
    const mappedItem = itemMap.get(String(flatItem.id))!;
    if (flatItem.parentId && itemMap.has(String(flatItem.parentId))) {
      const parent = itemMap.get(String(flatItem.parentId))!;
      parent.children!.push(mappedItem);
    } else {
      rootItems.push(mappedItem);
    }
  }

  // Clean up empty children arrays to match Sanity schema
  const cleanTree = (items: SanityNavigationItem[]) => {
    for (const item of items) {
      if (item.children && item.children.length === 0) {
        delete item.children;
      } else if (item.children) {
        cleanTree(item.children);
      }
    }
  };
  cleanTree(rootItems);

  return rootItems;
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

interface NavigationFormProps {
  initialData?: SanityNavigation | null;
  availablePages: SanityPage[];
}

export function NavigationForm({ initialData, availablePages }: NavigationFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<TreeItem[]>(() => {
    if (initialData?.items) {
      return buildFlatTree(initialData.items);
    }
    return [];
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const nestedItems = buildNestedTree(items);

      if (initialData?._id) {
        await updateNavigation(initialData._id, {
          name: values.name,
          items: nestedItems,
        });
        toast.success("Navigation updated successfully.");
      } else {
        await createNavigation({
          _type: "navigation",
          name: values.name,
          items: nestedItems,
        });
        toast.success("Navigation created successfully.");
        router.push("/admin/navigation");
      }
    } catch (error) {
      toast.error("Failed to save navigation.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card p-6 border rounded-lg shadow-sm">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Menu Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Main Navigation" {...field} />
                </FormControl>
                <FormDescription>Internal name used to identify this menu.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end gap-2 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/navigation")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Navigation"}
            </Button>
          </div>
        </form>
      </Form>

      <div className="bg-card border rounded-lg shadow-sm p-6">
        <div className="mb-4">
          <h3 className="text-lg font-medium">Menu Items</h3>
          <p className="text-sm text-muted-foreground">
            Drag and drop to reorder or nest items (up to 3 levels deep).
          </p>
        </div>
        <SortableTree
          items={items}
          onItemsChanged={setItems}
          availablePages={availablePages}
        />
      </div>
    </div>
  );
}
