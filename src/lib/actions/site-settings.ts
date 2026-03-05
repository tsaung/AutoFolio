"use server";

import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";
import { createClient } from "@/lib/db/server";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { revalidatePath } from "next/cache";

export async function getSiteSettings() {
  return await client.fetch(SITE_SETTINGS_QUERY, {}, { cache: "no-store", perspective: "published" });
}

export async function updateSiteSettings(input: any) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized");
  }

  // Create document if it doesn't exist
  await writeClient.createIfNotExists(
    { _id: "siteSettings", _type: "siteSettings" },
    { returnDocuments: false }
  );

  // Apply updates as patch
  await writeClient
    .patch("siteSettings")
    .set(input)
    .commit();

  revalidatePath("/", "layout"); // Revalidate entire site
  return { success: true, settings: { _id: "siteSettings" } };
}
