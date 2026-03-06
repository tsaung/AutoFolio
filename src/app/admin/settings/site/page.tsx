import { getSiteSettings } from "@/lib/actions/site-settings";
import { getNavigations } from "@/lib/actions/navigation";
import { SiteSettingsForm } from "@/components/admin/settings/site-settings-form";

export default async function SiteSettingsPage() {
  const [settings, navigations] = await Promise.all([
    getSiteSettings(),
    getNavigations()
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Site Settings</h3>
        <p className="text-sm text-muted-foreground">
          Update your site name, brand colors, navigation menus, and footer.
        </p>
      </div>
      <SiteSettingsForm initialData={settings || {}} availableNavigations={navigations} />
    </div>
  );
}
