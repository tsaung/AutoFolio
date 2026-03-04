import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/lib/db/admin";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];

    // Verify Sanity token
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch config from Supabase
    const { data, error } = await adminClient
      .from("bot_configs")
      .select("*")
      .eq("type", "public_agent")
      .single();

    if (error && error.code !== "PGRST116") {
      console.error(`Error fetching admin bot config:`, error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /api/admin/bot-config error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];

    // Verify Sanity token
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { model, provider, system_prompt, predefined_prompts } =
      await req.json();

    // Check existing
    const { data: existing, error: existingError } = await adminClient
      .from("bot_configs")
      .select("id")
      .eq("type", "public_agent")
      .single();

    if (existing) {
      const { error: updateError } = await adminClient
        .from("bot_configs")
        .update({
          model,
          provider,
          system_prompt,
          predefined_prompts,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);

      if (updateError) throw updateError;
    } else {
      // Find a user_id to satisfy the FK until it's migrated out natively
      const { data: users, error: userError } =
        await adminClient.auth.admin.listUsers();
      if (userError || !users.users.length) {
        throw new Error("No users found to attach config to");
      }

      const { error: insertError } = await adminClient
        .from("bot_configs")
        .insert({
          user_id: users.users[0].id,
          type: "public_agent",
          model: model || "google/gemini-2.0-flash-001",
          provider: provider || "openrouter",
          system_prompt,
          predefined_prompts,
        });

      if (insertError) throw insertError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/admin/bot-config error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
