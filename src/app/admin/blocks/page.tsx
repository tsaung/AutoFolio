import { type ReactNode } from "react";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, LayoutTemplate, Trash2, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { sanityFetch } from "@/sanity/lib/client";
import { createClient } from "@/lib/db/server";
import { BLOCK_CONFIG } from "@/components/admin/blocks/forms/block-config";

async function getGlobalBlocks() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const query = `
    *[_type in ["heroBlock", "ctaBlock", "richTextBlock", "statsBlock", "embedBlock", "faqBlock", "featureGridBlock", "imageGalleryBlock", "contactFormBlock", "logoCloudBlock", "testimonialBlock", "projectGridBlock", "experienceTimelineBlock", "skillsBlock"]] | order(_createdAt desc) {
      _id,
      _type,
      _createdAt,
      _updatedAt,
      name,
      "preview": select(
        _type == "heroBlock" => headline,
        _type == "ctaBlock" => heading,
        _type == "richTextBlock" => content,
        _type == "statsBlock" => coalesce(heading + " - ", "") + items[0].label,
        _type == "embedBlock" => embedType,
        _type == "faqBlock" => coalesce(heading + " - ", "") + items[0].question,
        _type == "featureGridBlock" => coalesce(heading + " - ", "") + features[0].title,
        _type == "imageGalleryBlock" => headline,
        _type == "contactFormBlock" => headline,
        _type == "logoCloudBlock" => headline,
        _type == "testimonialBlock" => headline,
        _type == "projectGridBlock" => headline,
        _type == "experienceTimelineBlock" => headline,
        _type == "skillsBlock" => headline
      )
    }
  `;

  return await sanityFetch<any[]>({
    query,
    tags: ["globalBlocks"],
  });
}

export default async function BlocksPage() {
  noStore();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const blocks = await getGlobalBlocks();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Global Blocks Library</h2>
          <p className="text-muted-foreground">
            Manage reusable layout components that can be placed on multiple pages.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/admin/blocks/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Block
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {blocks.map((block) => (
          <Card key={block._id} className="relative group overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <CardTitle className="line-clamp-1">{block.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1.5 uppercase text-xs tracking-wider font-semibold">
                    {BLOCK_CONFIG[block._type] ? (
                      <>
                        {(() => {
                          const Icon = BLOCK_CONFIG[block._type].icon;
                          return <Icon className="w-3.5 h-3.5" />;
                        })()}
                        {BLOCK_CONFIG[block._type].title}
                      </>
                    ) : (
                      <>
                        <LayoutTemplate className="w-3.5 h-3.5" />
                        {block._type}
                      </>
                    )}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground line-clamp-2 italic mb-4">
                "{block.preview}"
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/blocks/${block._id}/edit`} className="w-full">
                  <Button variant="outline" className="w-full h-8" size="sm">
                    <Pencil className="w-3.5 h-3.5 mr-2" />
                    Edit
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {blocks.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl bg-muted/20">
          <div className="rounded-full bg-primary/10 p-4 mb-4">
            <LayoutTemplate className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">No global blocks yet</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-6 max-w-sm">
            Create reusable sections like Heroes or CTAs that you can place across multiple pages.
          </p>
          <Link href="/admin/blocks/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create your first block
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
