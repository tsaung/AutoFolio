import { NavigationForm } from "@/components/admin/navigation/navigation-form";
import { getPages } from "@/lib/actions/navigation";

export const metadata = {
  title: "Create Navigation | Admin Dashboard",
};

export default async function NewNavigationPage() {
  const pages = await getPages();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Create Navigation</h2>
        <p className="text-muted-foreground">
          Build a new navigation menu.
        </p>
      </div>

      <NavigationForm availablePages={pages} />
    </div>
  );
}
