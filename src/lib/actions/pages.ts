"use server";

import { z } from "zod";
import { writeClient } from "@/sanity/lib/write-client";
import { createClient } from "@/lib/db/server";
import { revalidatePath, revalidateTag } from "next/cache";

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const PageSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
});

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createPage(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  // Parse fields
  const validatedFields = PageSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Required Fields. Failed to Create Page.",
    };
  }

  const { title, slug } = validatedFields.data;

  try {
    const newPage = await writeClient.create({
      _type: "page",
      title,
      slug: {
        _type: "slug",
        current: slug,
      },
      pageBuilder: [],
    });

    revalidateTag("pages");
    revalidatePath("/admin/pages");

    return {
      success: true,
      message: "Page created successfully",
      page: newPage,
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Failed to create page:", error);
    return {
      success: false,
      message: error.message || "Failed to create page.",
    };
  }
}

export async function updatePageBlocks(
  pageId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  blocks: any[]
) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  try {
    await writeClient
      .patch(pageId)
      .set({ pageBuilder: blocks })
      .commit();

    revalidateTag("pages");
    revalidatePath(`/admin/pages/${pageId}/edit`);
    revalidatePath(`/(visitor)/[slug]`, "page"); // generic path invalidation

    return { success: true };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Failed to update page blocks:", error);
    throw new Error(error.message || "Failed to update page.");
  }
}
