"use server";

import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";
import { createClient } from "@/lib/db/server";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { revalidatePath, revalidateTag } from "next/cache";

export async function getSiteSettings() {
  return await client.withConfig({ useCdn: false }).fetch(
    SITE_SETTINGS_QUERY,
    {},
    {
      cache: "no-store",
      perspective: "published",
      next: { tags: ["siteSettings"] },
    },
  );
}

export async function getPublicSiteSettings() {
  try {
    return await client.fetch(
      SITE_SETTINGS_QUERY,
      {},
      {
        next: { tags: ["siteSettings"] },
      },
    );
  } catch (error) {
    console.error("Error fetching public site settings:", error);
    return null;
  }
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
    { returnDocuments: false },
  );

  // Apply updates as patch
  await writeClient.patch("siteSettings").set(input).commit();

<<<<<<< feature-navigation-management-ui-10778918090352703678
=======
  revalidateTag("siteSettings", "siteSettings");
>>>>>>> sanity
  revalidatePath("/settings", "layout");
  revalidatePath("/dashboard");
  return { success: true, settings: { _id: "siteSettings" } };
}
