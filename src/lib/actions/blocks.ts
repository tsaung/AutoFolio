"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/db/server";
import { writeClient, client } from "@/sanity/lib/client";

const ALLOWED_BLOCK_TYPES = [
  "heroBlock",
  "ctaBlock",
  "richTextBlock",
  "statsBlock",
  "embedBlock",
  "faqBlock",
  "featureGridBlock",
];

export async function createBlock(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "Unauthorized" };
    }

    const dataString = formData.get("data") as string;
    const type = formData.get("type") as string;

    if (!dataString || !type || !ALLOWED_BLOCK_TYPES.includes(type)) {
      return { error: "Missing or invalid required fields" };
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
    const type = formData.get("type") as string;

    if (!id || !dataString || !type || !ALLOWED_BLOCK_TYPES.includes(type)) {
      return { error: "Missing or invalid required fields" };
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

export async function deleteBlock(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "Unauthorized" };
    }

    const id = formData.get("id") as string;

    if (!id) {
      return { error: "Missing block ID" };
    }

    await writeClient.delete(id);

    revalidatePath("/admin/blocks", "page");

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting block:", error);
    return { error: error.message || "Failed to delete block" };
  }
}

export async function fetchBlocks(type?: string) {
  try {
    const query = type 
      ? `*[_type == $type] | order(_updatedAt desc)`
      : `*[_type in $types] | order(_updatedAt desc)`;
      
    const params = type ? { type } : { types: ALLOWED_BLOCK_TYPES };
    
    const blocks = await client.fetch(query, params);
    return { success: true, blocks };
  } catch (error: any) {
    console.error("Error fetching blocks:", error);
    return { error: error.message || "Failed to fetch blocks", blocks: [] };
  }
}
