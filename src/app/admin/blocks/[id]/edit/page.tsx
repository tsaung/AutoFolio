import { unstable_noStore as noStore } from "next/cache";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/db/server";
import { sanityFetch } from "@/sanity/lib/client";
import { BlockForm } from "@/components/admin/blocks/block-form";
import { type SanityHeroBlock, type SanityCtaBlock } from "@/types/sanity-types";

async function getBlock(id: string) {
  const query = `
    *[_type in ["heroBlock", "ctaBlock"] && _id == $id][0] {
      _id,
      _type,
      name,
      headline,
      subheadline,
      buttons,
      backgroundImage,
      heading,
      text,
      button
    }
  `;

  return await sanityFetch<SanityHeroBlock | SanityCtaBlock | null>({
    query,
    params: { id },
    tags: [`block:${id}`],
  });
}

export default async function EditBlockPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  noStore();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;
  const block = await getBlock(id);

  if (!block) {
    notFound();
  }

  // We need to type cast it correctly based on the _type for the form
  if (block._type !== "heroBlock" && block._type !== "ctaBlock") {
    notFound();
  }

  return <BlockForm type={block._type} initialData={block} blockId={block._id} />;
}
