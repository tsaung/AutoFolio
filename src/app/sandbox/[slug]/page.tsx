import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { PAGE_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import { PageRenderer, type SanityBlock } from "@/components/v2/page-renderer";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SanityPage = {
  _id: string;
  title: string;
  slug: { current: string };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    noIndex?: boolean;
  };
  pageBuilder: SanityBlock[];
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page: SanityPage | null = await client.fetch(PAGE_BY_SLUG_QUERY, {
    slug,
  });

  if (!page) return {};

  return {
    title: page.seo?.metaTitle || page.title,
    description: page.seo?.metaDescription,
    robots: page.seo?.noIndex ? { index: false, follow: false } : undefined,
  };
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default async function SandboxPage({ params }: PageProps) {
  const { slug } = await params;
  const page: SanityPage | null = await client.fetch(PAGE_BY_SLUG_QUERY, {
    slug,
  });

  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Dev-only banner so it's obvious this is a sandbox route */}
      {process.env.NODE_ENV === "development" && (
        <div className="bg-yellow-400 px-4 py-2 text-center text-xs font-medium text-yellow-900">
          🧪 Sandbox Route — rendering Sanity page:{" "}
          <strong>{page.title}</strong>
        </div>
      )}

      <PageRenderer blocks={page.pageBuilder ?? []} />
    </div>
  );
}
