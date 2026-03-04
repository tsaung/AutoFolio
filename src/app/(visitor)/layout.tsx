import { getPublicProfile } from "@/lib/actions/profile";
import { getPublicBotConfig } from "@/lib/actions/bot-config";
import { VisitorLayoutWrapper } from "@/components/portfolio/visitor-layout-wrapper";
import { SetupChecklist } from "@/components/visitor/setup-checklist";
import { adminClient } from "@/lib/db/admin";

export default async function VisitorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getPublicProfile();
  const isReady = !!(profile && profile.name);

  // If the profile isn't ready, interrupt and show the SetupChecklist natively
  if (!isReady) {
    const userCheck = await adminClient.auth.admin.listUsers({
      page: 1,
      perPage: 1,
    });
    const hasAnyUser = userCheck.data.users.length > 0;
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <SetupChecklist profile={profile} hasAnyUser={hasAnyUser} />
      </main>
    );
  }

  // Pre-fetch BotConfig safely
  const botConfig = await getPublicBotConfig();

  return (
    <VisitorLayoutWrapper profile={profile} botConfig={botConfig}>
      {children}
    </VisitorLayoutWrapper>
  );
}
