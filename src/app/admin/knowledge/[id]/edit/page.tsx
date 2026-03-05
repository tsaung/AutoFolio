import { notFound } from "next/navigation";
import { getDocument } from "@/lib/actions/knowledge";
import { DocumentForm } from "@/components/admin/knowledge/document-form";

interface EditDocumentPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDocumentPage({
  params,
}: EditDocumentPageProps) {
  const { id } = await params;
  const document = await getDocument(id);

  if (!document) {
    notFound();
  }

  return <DocumentForm document={document} />;
}
