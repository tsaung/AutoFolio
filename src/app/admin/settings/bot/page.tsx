import { Separator } from "@/components/ui/separator";
import { getBotConfig } from "@/lib/actions/bot-config";
import { getProfile } from "@/lib/actions/profile";
import { BotConfigForm } from "@/components/admin/settings/bot-config-form";

export default async function SettingsBotPage() {
  const [config, profile] = await Promise.all([
    getBotConfig("public_agent"),
    getProfile()
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Public Bot Configuration</h3>
        <p className="text-sm text-muted-foreground">
          Customize how your public portfolio assistant behaves, what model it
          uses, and the suggested questions for visitors.
        </p>
      </div>
      <Separator />
      <BotConfigForm initialData={config} profileData={profile} type="public_agent" />
    </div>
  );
}
