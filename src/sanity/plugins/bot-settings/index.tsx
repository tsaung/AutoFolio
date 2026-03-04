import { definePlugin } from "sanity";
import { PlugIcon } from "@sanity/icons";
import { BotSettingsTool } from "./BotSettingsTool";

export const botSettingsPlugin = definePlugin({
  name: "bot-settings",
  tools: (prev) => {
    return [
      ...prev,
      {
        name: "bot-settings",
        title: "Bot Settings",
        icon: PlugIcon,
        component: BotSettingsTool,
      },
    ];
  },
});
