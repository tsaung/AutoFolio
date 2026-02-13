import { ChatInterface } from "@/components/chat/chat-interface";
import { getPublicProfile } from "@/lib/actions/profile";
import { SetupChecklist } from "@/components/visitor/setup-checklist";

export default async function VisitorPage() {
  const profile = await getPublicProfile();

  // Check if profile is ready for public view (needs at least a name)
  const isReady = !!(profile && profile.name);

  return (
    <main className="min-h-screen bg-background">
      {isReady ? (
        <ChatInterface profile={profile} />
      ) : (
        <SetupChecklist profile={profile} />
      )}
    </main>
  );
}
