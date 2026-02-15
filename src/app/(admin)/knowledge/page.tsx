import { getDocuments } from "@/lib/actions/knowledge";
import { KnowledgeList } from "@/components/admin/knowledge/knowledge-list";

export default async function KnowledgeBasePage() {
  const documents = await getDocuments();

  return <KnowledgeList initialDocuments={documents} />;
}
