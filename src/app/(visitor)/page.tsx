import { ChatInterface } from "@/components/chat/chat-interface";
import { getPublicProfile } from "@/lib/actions/profile";
import { SetupChecklist } from "@/components/visitor/setup-checklist";
import { adminClient } from "@/lib/db/admin";

export default async function VisitorPage() {
  const profile = await getPublicProfile();

  // Check if any user exists in the system (using admin client since auth.users is protected)
  // We only need to know if count > 0
  const {
    data: { users },
  } = await adminClient.auth.admin.listUsers({ page: 1, perPage: 1 });
  const hasAnyUser = users.length > 0;

  // Check if profile is ready for public view (needs at least a name)
  const isReady = !!(profile && profile.name);

  return (
    <main className="min-h-screen bg-background">
      {isReady ? (
        <ChatInterface profile={profile} />
      ) : (
        <SetupChecklist profile={profile} hasAnyUser={hasAnyUser} />
      )}
    </main>
  );
}
