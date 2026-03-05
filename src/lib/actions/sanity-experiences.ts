"use server";

import { createClient } from "@/lib/db/server";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";
import { EXPERIENCES_QUERY, EXPERIENCE_BY_ID_QUERY } from "@/sanity/lib/queries";
import { SanityExperience } from "@/types/sanity-types";
import { revalidatePath } from "next/cache";

/**
 * Admin Actions
 */

export async function getExperiences(): Promise<SanityExperience[]> {
  const supabase = await createClient();

  // 1. Verify caller is an authenticated admin
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return [];
  }

  // 2. Fetch from Sanity (no user filtering, content is site-wide)
  // Ensure admin sees fresh data by bypassing CDN and Next.js cache
  const data = await client
    .withConfig({ useCdn: false })
    .fetch<SanityExperience[]>(EXPERIENCES_QUERY, {}, { cache: "no-store" });
  
  return data ?? [];
}

export async function getExperience(id: string): Promise<SanityExperience | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return null;
  }

  const data = await client
    .withConfig({ useCdn: false })
    .fetch<SanityExperience | null>(EXPERIENCE_BY_ID_QUERY, { id }, { cache: "no-store" });

  return data;
}

export async function createExperience(
  input: Omit<SanityExperience, "_id" | "_type" | "_createdAt" | "_updatedAt" | "createdBy" | "updatedBy">,
): Promise<SanityExperience> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  try {
    const data = await writeClient.create({
      _type: "experience",
      ...input,
      createdBy: user.id,
      updatedBy: user.id,
    });

    revalidatePath("/experiences", "layout");
    // TODO: RAG pipeline sync
    return data as unknown as SanityExperience;
  } catch (error) {
    console.error("Error creating experience in Sanity:", error);
    throw new Error("Failed to create experience");
  }
}

export async function updateExperience(
  id: string,
  input: Partial<Omit<SanityExperience, "_id" | "_type" | "_createdAt" | "_updatedAt" | "createdBy" | "updatedBy">>,
): Promise<SanityExperience> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  try {
    const data = await writeClient
      .patch(id)
      .set({
        ...input,
        updatedBy: user.id,
      })
      .commit();

    revalidatePath("/experiences", "layout");
    // TODO: RAG pipeline sync
    return data as unknown as SanityExperience;
  } catch (error) {
    console.error("Error updating experience in Sanity:", error);
    throw new Error("Failed to update experience");
  }
}

export async function deleteExperience(id: string): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  try {
    await writeClient.delete(id);
    revalidatePath("/experiences", "layout");
    // TODO: RAG pipeline sync
  } catch (error) {
    console.error("Error deleting experience from Sanity:", error);
    throw new Error("Failed to delete experience");
  }
}

export async function reorderExperiences(
  items: { id: string; sortOrder: number }[],
): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  try {
    const tx = writeClient.transaction();
    
    items.forEach((item) => {
      tx.patch(item.id, (p) => p.set({ sortOrder: item.sortOrder, updatedBy: user.id }));
    });

    await tx.commit();
    revalidatePath("/experiences", "layout");
    // TODO: RAG pipeline sync
  } catch (error) {
    console.error("Error reordering experiences in Sanity:", error);
    throw new Error("Failed to reorder experiences");
  }
}

/**
 * Public Actions
 */

export async function getPublicExperiences(): Promise<SanityExperience[]> {
  try {
    // No auth required, just fetch the global content
    const data = await client.fetch<SanityExperience[]>(EXPERIENCES_QUERY);
    return data ?? [];
  } catch (error) {
    console.error("Error fetching public experiences from Sanity:", error);
    return [];
  }
}
