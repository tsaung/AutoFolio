"use server";

import { createClient } from "@/lib/db/server";
import { Database } from "@/types/database";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { syncSkillsToKnowledge } from "@/lib/rag/portfolio-sync";

type Skill = Database["public"]["Tables"]["skills"]["Row"];
type SkillInsert = Database["public"]["Tables"]["skills"]["Insert"];
type SkillUpdate = Database["public"]["Tables"]["skills"]["Update"];

/**
 * Admin Actions
 */

export async function getSkills(): Promise<Skill[]> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return [];
  }

  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .eq("user_id", user.id)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching skills:", error);
    return [];
  }

  return data ?? [];
}

export async function getSkill(id: string): Promise<Skill | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching skill:", error);
    return null;
  }

  return data;
}

export async function createSkill(
  input: Omit<SkillInsert, "user_id">,
): Promise<Skill> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("skills")
    .insert({
      ...input,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating skill:", error);
    throw new Error("Failed to create skill");
  }

  revalidatePath("/skills");
  after(() => syncSkillsToKnowledge(user.id));
  return data;
}

export async function updateSkill(
  id: string,
  input: SkillUpdate,
): Promise<Skill> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("skills")
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating skill:", error);
    throw new Error("Failed to update skill");
  }

  revalidatePath("/skills");
  after(() => syncSkillsToKnowledge(user.id));
  return data;
}

export async function deleteSkill(id: string): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("skills")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting skill:", error);
    throw new Error("Failed to delete skill");
  }

  revalidatePath("/skills");
  after(() => syncSkillsToKnowledge(user.id));
}

export async function reorderSkills(
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
      .from("skills")
      .update({ sort_order: item.sort_order })
      .eq("id", item.id)
      .eq("user_id", user.id),
  );

  const results = await Promise.all(updates);
  const errors = results.filter((r) => r.error);

  if (errors.length > 0) {
    console.error("Error reordering skills:", errors);
    throw new Error("Failed to reorder skills");
  }

  revalidatePath("/skills");
  after(() => syncSkillsToKnowledge(user.id));
}

/**
 * Public Actions
 */

export async function getPublicSkills(userId: string): Promise<Skill[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .eq("user_id", userId)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching public skills:", error);
    return [];
  }

  return data ?? [];
}
