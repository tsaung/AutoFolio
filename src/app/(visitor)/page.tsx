import { ChatInterface } from "@/components/chat/chat-interface";
import { getPublicProfile } from "@/lib/actions/profile";

export default async function VisitorPage() {
  const profile = await getPublicProfile();

  return (
    <main className="min-h-screen bg-background">
      <ChatInterface profile={profile} />
    </main>
  );
}
