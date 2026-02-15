import { Metadata } from "next";
import { SettingsNav, settingsNavItems } from "@/components/admin/settings-nav";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your portfolio settings and AI configuration.",
};

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="space-y-6 p-10 pb-16 block">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your portfolio settings and AI configuration.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <aside className="-mx-4 lg:mx-0 lg:w-64">
          <SettingsNav items={settingsNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </div>
  );
}
