import { unstable_noStore as noStore } from "next/cache";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/db/server";
import { BLOCK_FORM_REGISTRY } from "@/components/admin/blocks/forms";

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

  const FormComponent = BLOCK_FORM_REGISTRY[type];

  if (!FormComponent) {
    notFound();
  }

  return <FormComponent type={type} />;
}
