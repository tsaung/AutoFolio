import { Separator } from "@/components/ui/separator";
import { getBotConfig } from "@/lib/actions/bot-config";
import { BotConfigForm } from "@/components/admin/settings/bot-config-form";

export default async function SettingsBotPage() {
  const config = await getBotConfig("public_agent");

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
      <BotConfigForm initialData={config} type="public_agent" />
    </div>
  );
}
