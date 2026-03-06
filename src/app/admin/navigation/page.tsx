import { getNavigations } from "@/lib/actions/navigation";
import { NavigationList } from "@/components/admin/navigation/navigation-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export const metadata = {
  title: "Navigation Menus | Admin Dashboard",
};

export default async function NavigationPage() {
  const navigations = await getNavigations();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Navigation Menus</h2>
          <p className="text-muted-foreground">
            Manage main menus, footers, and other navigation structures.
          </p>
        </div>
        <Link href="/admin/navigation/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Menu
          </Button>
        </Link>
      </div>

      <NavigationList initialNavigations={navigations} />
    </div>
  );
}
