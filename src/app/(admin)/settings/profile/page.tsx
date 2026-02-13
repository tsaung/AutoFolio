import { getProfile } from "@/lib/actions/profile";
import { ProfileForm } from "@/components/admin/settings/profile-form";
import { Separator } from "@/components/ui/separator";

export default async function SettingsProfilePage() {
  const profile = await getProfile();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is your public profile. It will be used to customize your bot's
          identity and welcome message.
        </p>
      </div>
      <Separator />
      <ProfileForm initialData={profile || undefined} />
    </div>
  );
}
