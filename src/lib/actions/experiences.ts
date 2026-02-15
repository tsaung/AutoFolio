"use server";

import { createClient } from "@/lib/db/server";
import { Database } from "@/types/database";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { syncExperiencesToKnowledge } from "@/lib/rag/portfolio-sync";

type Experience = Database["public"]["Tables"]["experiences"]["Row"];
type ExperienceInsert = Database["public"]["Tables"]["experiences"]["Insert"];
type ExperienceUpdate = Database["public"]["Tables"]["experiences"]["Update"];

/**
 * Admin Actions
 */

export async function getExperiences(): Promise<Experience[]> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return [];
  }

  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .eq("user_id", user.id)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching experiences:", error);
    return [];
  }

  return data ?? [];
}

export async function getExperience(id: string): Promise<Experience | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching experience:", error);
    return null;
  }

  return data;
}

export async function createExperience(
  input: Omit<ExperienceInsert, "user_id">,
): Promise<Experience> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("experiences")
    .insert({
      ...input,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating experience:", error);
    throw new Error("Failed to create experience");
  }

  revalidatePath("/experiences");
  after(() => syncExperiencesToKnowledge(user.id));
  return data;
}

export async function updateExperience(
  id: string,
  input: ExperienceUpdate,
): Promise<Experience> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("experiences")
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating experience:", error);
    throw new Error("Failed to update experience");
  }

  revalidatePath("/experiences");
  after(() => syncExperiencesToKnowledge(user.id));
  return data;
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

  const { error } = await supabase
    .from("experiences")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting experience:", error);
    throw new Error("Failed to delete experience");
  }

  revalidatePath("/experiences");
  after(() => syncExperiencesToKnowledge(user.id));
}

export async function reorderExperiences(
  items: { id: string; sort_order: number }[],
): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const updates = items.map((item) =>
    supabase
      .from("experiences")
      .update({ sort_order: item.sort_order })
      .eq("id", item.id)
      .eq("user_id", user.id),
  );

  const results = await Promise.all(updates);
  const errors = results.filter((r) => r.error);

  if (errors.length > 0) {
    console.error("Error reordering experiences:", errors);
    throw new Error("Failed to reorder experiences");
  }

  revalidatePath("/experiences");
  after(() => syncExperiencesToKnowledge(user.id));
}

/**
 * Public Actions
 */

export async function getPublicExperiences(
  userId: string,
): Promise<Experience[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .eq("user_id", userId)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching public experiences:", error);
    return [];
  }

  return data ?? [];
}
