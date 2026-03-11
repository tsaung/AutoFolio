export function ThemeInjector({
  brandColors,
}: {
  brandColors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
}) {
  if (!brandColors || (!brandColors.primary && !brandColors.secondary && !brandColors.accent)) {
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
