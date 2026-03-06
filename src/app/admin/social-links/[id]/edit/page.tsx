import { notFound } from "next/navigation";
import { getSocialLink } from "@/lib/actions/sanity-portfolio";
import { SocialLinkForm } from "@/components/admin/portfolio/social-link-form";

interface EditSocialLinkPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditSocialLinkPage({
  params,
}: EditSocialLinkPageProps) {
  const { id } = await params;
  const link = await getSocialLink(id);

  if (!link) {
    notFound();
  }

  return <SocialLinkForm initialData={link} />;
}
