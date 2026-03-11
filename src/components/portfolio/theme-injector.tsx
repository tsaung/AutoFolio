import { THEMES } from "@/lib/themes";

export function ThemeInjector({
  brandColors,
}: {
  brandColors?: {
    themePreset?: string;
    primary?: string;
    secondary?: string;
    accent?: string;
  };
}) {
  if (!brandColors) {
    return null;
  }

  const isCustom = !brandColors.themePreset || brandColors.themePreset === "custom";
  const preset = THEMES.find((t) => t.name === brandColors.themePreset);

  if (isCustom) {
    if (!brandColors.primary && !brandColors.secondary && !brandColors.accent) {
      return null;
    }
    // We inject these variables globally.
    // By targeting :root, .light, and .dark, we override the default theme values defined in globals.css
    return (
      <style
        dangerouslySetInnerHTML={{
          __html: `
            :root, .light, .dark {
              ${brandColors.primary ? `--primary: ${brandColors.primary};` : ""}
              ${brandColors.secondary ? `--secondary: ${brandColors.secondary};` : ""}
              ${brandColors.accent ? `--accent: ${brandColors.accent};` : ""}
            }
          `,
        }}
      />
    );
  }

  if (preset) {
    return (
      <style
        dangerouslySetInnerHTML={{
          __html: `
            :root, .light {
              --primary: ${preset.light.primary};
              --secondary: ${preset.light.secondary};
              --accent: ${preset.light.accent};
            }
            .dark {
              --primary: ${preset.dark.primary};
              --secondary: ${preset.dark.secondary};
              --accent: ${preset.dark.accent};
            }
          `,
        }}
      />
    );
  }

  return null;
}
