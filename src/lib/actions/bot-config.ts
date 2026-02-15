"use server";

import { createClient } from "@/lib/db/server";
import { Database } from "@/types/database";
import { revalidatePath } from "next/cache";

export type BotConfig = Database["public"]["Tables"]["bot_configs"]["Row"];
type BotConfigInsert = Database["public"]["Tables"]["bot_configs"]["Insert"];
type BotConfigUpdate = Database["public"]["Tables"]["bot_configs"]["Update"];

export async function getBotConfig(type: "public_agent" | "admin_agent") {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from("bot_configs")
    .select("*")
    .eq("user_id", user.id)
    .eq("type", type)
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      console.error(`Error fetching bot config for ${type}:`, error);
    }
    return null;
  }

  return data;
}

export async function getPublicBotConfig(userId?: string) {
  const supabase = await createClient();

  // If userId is provided, use it. Otherwise, try to infer from the single-tenant setup
  // For now, we'll try to get the first user if not provided, or better, leverage getPublicProfile logic's user
  // Actually, getPublicProfile gets the FIRST profile. We should mirror that logic.

  let targetUserId = userId;

  if (!targetUserId) {
    // Determine user ID similar to getPublicProfile
    // For single tenant, we might just query the first bot_config of type public_agent
    const { data, error } = await supabase
      .from("bot_configs")
      .select("*")
      .eq("type", "public_agent")
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching public bot config:", error);
      return null;
    }
    return data;
  }

  const { data, error } = await supabase
    .from("bot_configs")
    .select("*")
    .eq("user_id", targetUserId)
    .eq("type", "public_agent")
    .single();

  if (error) {
    console.error("Error fetching public bot config:", error);
    return null;
  }

  return data;
}

export async function updateBotConfig(
  type: "public_agent" | "admin_agent",
  data: Partial<BotConfigUpdate>,
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  // Check if config exists first to handle upsert correctly with user_id
  const existing = await getBotConfig(type);

  let error;
  if (existing) {
    const { error: updateError } = await supabase
      .from("bot_configs")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
    error = updateError;
  } else {
    const { error: insertError } = await supabase.from("bot_configs").insert({
      user_id: user.id,
      type,
      model: data.model || "google/gemini-2.0-flash-001", // Default fallback
      provider: data.provider || "openrouter",
      system_prompt: data.system_prompt,
      predefined_prompts: data.predefined_prompts,
    } as BotConfigInsert);
    error = insertError;
  }

  if (error) {
    console.error(`Error updating bot config for ${type}:`, error);
    throw new Error("Failed to update bot config");
  }

  revalidatePath("/settings/bot");
  return { success: true };
}
