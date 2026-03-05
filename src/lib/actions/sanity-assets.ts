"use server";

import { createClient } from "@/lib/db/server";
import { writeClient } from "@/sanity/lib/write-client";

export async function uploadImage(formData: FormData) {
  // 1. Verify Authentication
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  // 2. Extract file from FormData
  const file = formData.get("file") as File;
  
  if (!file) {
    throw new Error("No file provided");
  }

  // 3. Upload to Sanity
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Use the filename if available
    const filename = file.name || "uploaded-image";

    const asset = await writeClient.assets.upload("image", buffer, {
      filename,
    });

    return {
      success: true,
      assetId: asset._id,
      url: asset.url
    };
  } catch (error) {
    console.error("Image upload failed:", error);
    throw new Error("Failed to upload image to Sanity");
  }
}
