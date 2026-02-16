"use server";

import { createClient } from "@/lib/db/server";
import { Database } from "@/types/database"; // Correct import path
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { syncProjectsToKnowledge } from "@/lib/rag/portfolio-sync";

type Project = Database["public"]["Tables"]["projects"]["Row"];
type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];

/**
 * Admin Actions
 */

export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return [];
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .order("sort_order", { ascending: true }); // Default sort by sort_order ASC

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }

  return data ?? [];
}

export async function getProject(id: string): Promise<Project | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching project:", error);
    return null;
  }

  return data;
}

export async function createProject(
  input: Omit<ProjectInsert, "user_id">,
): Promise<Project> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({
      ...input,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating project:", error);
    throw new Error("Failed to create project");
  }

  revalidatePath("/projects");
  after(() => syncProjectsToKnowledge(user.id));

  return data;
}

export async function updateProject(
  id: string,
  input: ProjectUpdate,
): Promise<Project> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("projects")
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating project:", error);
    throw new Error("Failed to update project");
  }

  revalidatePath("/projects");
  after(() => syncProjectsToKnowledge(user.id));

  return data;
}

export async function deleteProject(id: string): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting project:", error);
    throw new Error("Failed to delete project");
  }

  revalidatePath("/projects");
  after(() => syncProjectsToKnowledge(user.id));
}

export async function reorderProjects(
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

  // Use upsert to update multiple rows efficiently, or simpler Promise.all
  // Supabase 'upsert' works best if we have all required fields, but here we only want to update sort_order.
  // Using a loop with update is safer for partial updates to ensure we don't accidentally overwrite other fields or hit constraints if we don't provide all fields.
  // Although, RPC would be ideal, but user asked for standard actions.
  // We will run them in parallel.

  const updates = items.map((item) =>
    supabase
      .from("projects")
      .update({ sort_order: item.sort_order })
      .eq("id", item.id)
      .eq("user_id", user.id),
  );

  const results = await Promise.all(updates);
  const errors = results.filter((r) => r.error);

  if (errors.length > 0) {
    console.error("Error reordering projects:", errors);
    throw new Error("Failed to reorder projects");
  }

  revalidatePath("/projects");
  after(() => syncProjectsToKnowledge(user.id));
}

/**
 * Public Actions
 */

export async function getPublicProjects(userId: string): Promise<Project[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("status", "published")
    .eq("user_id", userId)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching public projects:", error);
    return [];
  }

  return data ?? [];
}
export async function getPublicProject(id: string): Promise<Project | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .single();

  if (error) {
    console.error("Error fetching public project:", error);
    return null;
  }

  return data;
}
