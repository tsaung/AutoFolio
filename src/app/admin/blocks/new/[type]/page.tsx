import { unstable_noStore as noStore } from "next/cache";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/db/server";
import { BlockForm } from "@/components/admin/blocks/block-form";

export default async function NewSpecificBlockPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  noStore();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { type } = await params;

  if (type !== "heroBlock" && type !== "ctaBlock") {
    notFound();
  }

  return <BlockForm type={type} />;
}
