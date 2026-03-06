import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PageForm } from "@/components/admin/pages/page-form";

export const dynamic = "force-dynamic";

export default function NewPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/pages"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Page</h1>
          <p className="text-muted-foreground">
            Create a new page document to start building.
          </p>
        </div>
      </div>

      <PageForm />
    </div>
  );
}
