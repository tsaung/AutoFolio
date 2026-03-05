import { getSiteSettings } from "@/lib/actions/site-settings";
import { SiteSettingsForm } from "@/components/admin/settings/site-settings-form";

export default async function SiteSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Site Settings</h3>
        <p className="text-sm text-muted-foreground">
          Update your site name, brand colors, navigation, and footer.
        </p>
      </div>
      <SiteSettingsForm initialData={settings || {}} />
    </div>
  );
}
