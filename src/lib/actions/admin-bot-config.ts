"use server";

import { createServerClient } from "@supabase/ssr";
import { revalidatePath } from "next/cache";

export async function getAdminBotConfig(token: string) {
  if (!token) {
    throw new Error("Unauthorized");
  }

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const userReq = await fetch(
    `https://${projectId}.api.sanity.io/v2021-06-07/users/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!userReq.ok) {
    throw new Error("Unauthorized");
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } },
  );

  const { data, error } = await supabase
    .from("bot_configs")
    .select("*")
    .eq("type", "public_agent")
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      console.error(`Error fetching admin bot config:`, error);
    }
    return null;
  }

  return data;
}

export async function updateAdminBotConfig(token: string, data: any) {
  if (!token) {
    throw new Error("Unauthorized");
  }

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const userReq = await fetch(
    `https://${projectId}.api.sanity.io/v2021-06-07/users/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!userReq.ok) {
    throw new Error("Unauthorized");
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } },
  );

  const existing = await getAdminBotConfig(token);
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
    // If we're creating the default config for the first time
    // we need to attach it to a user based on the V1 schema.
    // In our single-tenant case, we'll try to find any auth user, or we'll assume there is one.
    // Actually, V1 schema requires user_id. For the service role and single-tenant setup,
    // let's fetch the first user in the auth.users table.

    const { data: users, error: userError } =
      await supabase.auth.admin.listUsers();

    if (userError || !users.users.length) {
      throw new Error("No users found to attach config to");
    }

    const { error: insertError } = await supabase.from("bot_configs").insert({
      user_id: users.users[0].id,
      type: "public_agent",
      model: data.model || "google/gemini-2.0-flash-001",
      provider: data.provider || "openrouter",
      system_prompt: data.system_prompt,
      predefined_prompts: data.predefined_prompts,
    });
    error = insertError;
  }

  if (error) {
    console.error(`Error updating admin bot config:`, error);
    throw new Error("Failed to update bot config");
  }

  revalidatePath("/settings/bot");
  return { success: true };
}
