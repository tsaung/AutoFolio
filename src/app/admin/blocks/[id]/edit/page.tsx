import { unstable_noStore as noStore } from "next/cache";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/db/server";
import { sanityFetch } from "@/sanity/lib/client";
import { BLOCK_FORM_REGISTRY } from "@/components/admin/blocks/forms";

async function getBlock(id: string) {
  const query = `
    *[_type in [
      "heroBlock", "ctaBlock", "richTextBlock",
      "statsBlock", "embedBlock", "faqBlock", "featureGridBlock"
    ] && _id == $id][0] {
      ...
    }
  `;

  return await sanityFetch<any | null>({
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

  const FormComponent = BLOCK_FORM_REGISTRY[block._type];

  if (!FormComponent) {
    notFound();
  }

  return <FormComponent type={block._type} initialData={block} blockId={block._id} />;
}
