"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createClient } from "@/lib/db/server";
import { adminClient } from "@/lib/db/admin";
import { writeClient } from "@/sanity/lib/client";

export async function createBlock(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "Unauthorized" };
    }

    const dataString = formData.get("data") as string;
    const type = formData.get("type") as "heroBlock" | "ctaBlock";

    if (!dataString || !type) {
      return { error: "Missing required fields" };
    }

    const data = JSON.parse(dataString);

    // Filter out empty buttons for Hero
    if (type === "heroBlock" && data.buttons) {
      data.buttons = data.buttons.filter((b: any) => b.label);
    }

    // Filter out empty button for CTA
    if (type === "ctaBlock" && data.button) {
      if (!data.button.label) {
        data.button = undefined;
      }
    }

    const doc = {
      _type: type,
      ...data,
      createdBy: user.id,
      updatedBy: user.id,
    };

    const result = await writeClient.create(doc);

    revalidatePath("/admin/blocks", "page");

    return { success: true, id: result._id };
  } catch (error: any) {
    console.error("Error creating block:", error);
    return { error: error.message || "Failed to create block" };
  }
}

export async function updateBlock(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "Unauthorized" };
    }

    const id = formData.get("id") as string;
    const dataString = formData.get("data") as string;
    const type = formData.get("type") as "heroBlock" | "ctaBlock";

    if (!id || !dataString || !type) {
      return { error: "Missing required fields" };
    }

    const data = JSON.parse(dataString);

    // Filter out empty buttons for Hero
    if (type === "heroBlock" && data.buttons) {
      data.buttons = data.buttons.filter((b: any) => b.label);
    }

    // Filter out empty button for CTA
    if (type === "ctaBlock" && data.button) {
      if (!data.button.label) {
        data.button = undefined;
      }
    }

    const doc = {
      ...data,
      updatedBy: user.id,
    };

    await writeClient.patch(id).set(doc).commit();

    revalidatePath("/admin/blocks", "page");
    revalidatePath(`/admin/blocks/${id}/edit`, "page");

    return { success: true };
  } catch (error: any) {
    console.error("Error updating block:", error);
    return { error: error.message || "Failed to update block" };
  }
}
