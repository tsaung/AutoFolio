import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { PageBuilder } from "@/components/admin/pages/page-builder";
import { groq } from "next-sanity";

export const dynamic = "force-dynamic";

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch page directly by ID
  const page = await client.withConfig({ useCdn: false }).fetch(
    groq`*[_type == "page" && _id == $id][0]{
      _id,
      title,
      "slug": slug.current,
      pageBuilder[]{
        _key,
        _ref,
        _type,
        "blockName": @->name,
        "blockType": @->_type
      }
    }`,
    { id },
    { cache: "no-store" }
  );

  if (!page) {
    notFound();
  }

  // Ensure pageBuilder is at least an empty array
  const initialBlocks = page.pageBuilder || [];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center gap-4 px-6 py-4 border-b shrink-0 bg-background z-10">
        <Link
          href="/admin/pages"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Edit Page: {page.title}
          </h1>
          <p className="text-xs text-muted-foreground">
            Editing route: /{page.slug === 'home' ? '' : page.slug}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <PageBuilder pageId={page._id} initialBlocks={initialBlocks} slug={page.slug} />
      </div>
    </div>
  );
}
