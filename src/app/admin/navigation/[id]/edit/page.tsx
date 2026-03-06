import { NavigationForm } from "@/components/admin/navigation/navigation-form";
import { getPages, getNavigationById } from "@/lib/actions/navigation";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Edit Navigation | Admin Dashboard",
};

export default async function EditNavigationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [pages, navigation] = await Promise.all([
    getPages(),
    getNavigationById(id),
  ]);

  if (!navigation) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Edit Navigation: {navigation.name}
        </h2>
        <p className="text-muted-foreground">
          Update the structure and links of this menu.
        </p>
      </div>

      <NavigationForm availablePages={pages} initialData={navigation} />
    </div>
  );
}
