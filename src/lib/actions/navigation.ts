"use server";

import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";
import { createClient } from "@/lib/db/server";
import { revalidatePath, revalidateTag } from "next/cache";
import type { SanityNavigation, SanityPage } from "@/types/sanity-types";

// Helper to check user auth
async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized");
  }

  return user;
}

// Fetch all navigations
export async function getNavigations(): Promise<SanityNavigation[]> {
  try {
    const query = `*[_type == "navigation"] | order(_createdAt desc)`;
    return await client
      .withConfig({ useCdn: false })
      .fetch(query, {}, { cache: "no-store", perspective: "published", next: { tags: ["navigation"] } });
  } catch (error) {
    console.error("Error fetching navigations:", error);
    return [];
  }
}

// Fetch a single navigation by ID
export async function getNavigationById(id: string): Promise<SanityNavigation | null> {
  try {
    const query = `*[_type == "navigation" && _id == $id][0]`;
    return await client
      .withConfig({ useCdn: false })
      .fetch(query, { id }, { cache: "no-store", perspective: "published", next: { tags: ["navigation"] } });
  } catch (error) {
    console.error(`Error fetching navigation ${id}:`, error);
    return null;
  }
}

// Fetch available pages for reference linking
export async function getPages(): Promise<SanityPage[]> {
  try {
    const query = `*[_type == "page"] { _id, _type, title, slug } | order(title asc)`;
    return await client
      .withConfig({ useCdn: false })
      .fetch(query, {}, { cache: "no-store", perspective: "published", next: { tags: ["page"] } });
  } catch (error) {
    console.error("Error fetching pages:", error);
    return [];
  }
}

// Create a new navigation
export async function createNavigation(data: Omit<SanityNavigation, "_id" | "_createdAt" | "_updatedAt" | "createdBy" | "updatedBy">) {
  const user = await requireAuth();

  try {
    const newNav = await writeClient.create({
      _type: "navigation",
      name: data.name,
      items: data.items || [],
      createdBy: user.id,
      updatedBy: user.id,
    });

    revalidatePath("/admin/navigation", "layout");
    return { success: true, data: newNav };
  } catch (error) {
    console.error("Failed to create navigation:", error);
    throw new Error("Failed to create navigation");
  }
}

// Update an existing navigation
export async function updateNavigation(id: string, data: Partial<SanityNavigation>) {
  const user = await requireAuth();

  try {
    const updatedNav = await writeClient
      .patch(id)
      .set({
        ...data,
        updatedBy: user.id,
      })
      .commit();

    revalidatePath("/admin/navigation", "layout");
    revalidatePath(`/admin/navigation/${id}/edit`);
    return { success: true, data: updatedNav };
  } catch (error) {
    console.error(`Failed to update navigation ${id}:`, error);
    throw new Error("Failed to update navigation");
  }
}

// Delete a navigation
export async function deleteNavigation(id: string) {
  await requireAuth();

  try {
    await writeClient.delete(id);

    revalidatePath("/admin/navigation", "layout");
    return { success: true };
  } catch (error) {
    console.error(`Failed to delete navigation ${id}:`, error);
    throw new Error("Failed to delete navigation");
  }
}
