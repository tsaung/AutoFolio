"use server";

import { createClient } from "@/lib/db/server";
import { revalidatePath } from "next/cache";
import { updateBotConfig, getBotConfig } from "./bot-config";

export async function getProfile() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      console.error("Error fetching profile:", error);
      return null;
    }
    // Profile doesn't exist yet, but user is authenticated
    // Return partial profile with just email
    return { email: user.email } as any;
  }

  return { ...data, email: user.email };
}

export async function getPublicProfile() {
  const supabase = await createClient();

  // Fetch the first profile found. Ideally this should be filtered by "owner" role or similar if multi-user.
  // Since this is a portfolio, we assume the single user is the owner.
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .limit(1)
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      console.error("Error fetching public profile:", error);
    }
    return null;
  }

  return data;
}

export async function updateProfile(data: Record<string, any>) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      ...data,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error updating profile:", error);
    throw new Error("Failed to update profile");
  }

  // Check if bot config exists, if not, create default
  try {
    const botConfig = await getBotConfig("public_agent");
    if (!botConfig) {
      await updateBotConfig("public_agent", {
        model: "google/gemini-2.0-flash-001",
        provider: "openrouter",
        system_prompt: `You are ${data.name}'s Portfolio Assistant. You are a helpful assistant that answers questions about their work and experience.`,
        predefined_prompts: [
          "Tell me about your experience",
          "What are your skills?",
          "Contact information",
          "Tell me about your projects",
        ],
      });
    }
  } catch (err) {
    console.error("Error managing bot config:", err);
  }

  revalidatePath("/settings/profile");
  return { success: true };
}
