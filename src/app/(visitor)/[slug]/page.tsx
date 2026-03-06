import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { PAGE_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import { PageRenderer, type SanityBlock } from "@/components/v2/page-renderer";
import { VisitorNav } from "@/components/portfolio/visitor-nav";
import { VisitorFooter } from "@/components/portfolio/visitor-footer";
import { getPublicProfile } from "@/lib/actions/profile";
import { getPublicSocialLinks } from "@/lib/actions/social-links";
import { getPublicSiteSettings } from "@/lib/actions/site-settings";

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
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
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

export default async function DynamicPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const isPreview = preview === "true";

  // When previewing via iframe from the builder, bypass CDN and fetch latest drafts/published
  const fetchClient = isPreview
    ? client.withConfig({ useCdn: false, perspective: 'previewDrafts' })
    : client;
  const fetchOptions = isPreview ? { cache: 'no-store' as RequestCache } : undefined;

  // Fetch Sanity page and required shared data in parallel
  const [page, profile, siteSettings] = await Promise.all([
    fetchClient.fetch<SanityPage | null>(PAGE_BY_SLUG_QUERY, { slug }, fetchOptions),
    getPublicProfile(),
    getPublicSiteSettings()
  ]);

  const socialLinks = profile ? await getPublicSocialLinks(profile.id) : [];

  if (!page) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-max w-full bg-background text-foreground">
      <VisitorNav name={profile?.name} avatarUrl={profile?.avatar_url} siteSettings={siteSettings} />

      <main className="flex-grow pt-16">
        <PageRenderer blocks={page.pageBuilder ?? []} />
      </main>

      <VisitorFooter profile={profile} socialLinks={socialLinks} siteSettings={siteSettings} />
    </div>
  );
}
