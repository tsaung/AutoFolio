"use server";

import { createClient } from "@/lib/db/server";
import { Database } from "@/types/database";
import { revalidatePath } from "next/cache";

type SocialLink = Database["public"]["Tables"]["social_links"]["Row"];
type SocialLinkInsert = Database["public"]["Tables"]["social_links"]["Insert"];
type SocialLinkUpdate = Database["public"]["Tables"]["social_links"]["Update"];

/**
 * Admin Actions
 */

export async function getSocialLinks(): Promise<SocialLink[]> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return [];
  }

  const { data, error } = await supabase
    .from("social_links")
    .select("*")
    .eq("user_id", user.id)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching social links:", error);
    return [];
  }

  return data ?? [];
}

export async function getSocialLink(id: string): Promise<SocialLink | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from("social_links")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching social link:", error);
    return null;
  }

  return data;
}

export async function createSocialLink(
  input: Omit<SocialLinkInsert, "user_id">,
): Promise<SocialLink> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("social_links")
    .insert({
      ...input,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating social link:", error);
    throw new Error("Failed to create social link");
  }

  revalidatePath("/social-links");
  revalidatePath("/dashboard");
  return data;
}

export async function updateSocialLink(
  id: string,
  input: SocialLinkUpdate,
): Promise<SocialLink> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("social_links")
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating social link:", error);
    throw new Error("Failed to update social link");
  }

  revalidatePath("/social-links");
  revalidatePath("/dashboard");
  return data;
}

export async function deleteSocialLink(id: string): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("social_links")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting social link:", error);
    throw new Error("Failed to delete social link");
  }

  revalidatePath("/social-links");
  revalidatePath("/dashboard");
}

export async function reorderSocialLinks(
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
      .from("social_links")
      .update({ sort_order: item.sort_order })
      .eq("id", item.id)
      .eq("user_id", user.id),
  );

  const results = await Promise.all(updates);
  const errors = results.filter((r) => r.error);

  if (errors.length > 0) {
    console.error("Error reordering social links:", errors);
    throw new Error("Failed to reorder social links");
  }

  revalidatePath("/social-links");
  revalidatePath("/dashboard");
}

/**
 * Public Actions
 */

export async function getPublicSocialLinks(
  userId: string,
): Promise<SocialLink[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("social_links")
    .select("*")
    .eq("user_id", userId)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching public social links:", error);
    return [];
  }

  return data ?? [];
}
