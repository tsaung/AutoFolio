import { client } from "@/sanity/lib/client";
import { PAGES_QUERY } from "@/sanity/lib/queries";
import { PagesList } from "@/components/admin/pages/pages-list";

export const dynamic = "force-dynamic";

export default async function PagesAdminPage() {
  const pages = await client.withConfig({ useCdn: false }).fetch(
    PAGES_QUERY,
    {},
    { cache: "no-store" }
  );

  return <PagesList initialPages={pages} />;
}
