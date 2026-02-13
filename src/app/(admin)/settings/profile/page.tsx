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

      {!profile?.id && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 p-4 rounded-md flex items-center gap-3 text-yellow-800 dark:text-yellow-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
          </svg>
          <p className="text-sm font-medium">
            Please complete your profile to continue. You won't be able to
            access other features until this is done.
          </p>
        </div>
      )}

      <ProfileForm initialData={profile || undefined} />
    </div>
  );
}
