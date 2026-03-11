import { defineType, defineField } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "siteName",
      title: "Site Name",
      type: "string",
      description: "Appears in the header and as the default SEO title base.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "mainNavigation",
      title: "Main Navigation",
      type: "reference",
      to: [{ type: "navigation" }],
      description: "Select a navigation menu for the header.",
    }),
    defineField({
      name: "footerNavigation",
      title: "Footer Navigation",
      type: "reference",
      to: [{ type: "navigation" }],
      description: "Select a navigation menu for the footer.",
    }),
    defineField({
      name: "footer",
      title: "Footer Settings",
      type: "object",
      fields: [
        defineField({
          name: "copyrightText",
          title: "Copyright Text",
          type: "string",
          description: "e.g., '© 2026 Your Name. All rights reserved.'",
        }),
        defineField({
          name: "socialLinks",
          title: "Social Links",
          type: "array",
          of: [
            {
              type: "object",
              name: "socialLink",
              title: "Social Link",
              fields: [
                defineField({
                  name: "platform",
                  title: "Platform",
                  type: "string",
                }),
                defineField({ name: "url", title: "URL", type: "url" }),
                defineField({
                  name: "icon",
                  title: "Icon Enum",
                  type: "string",
                  description:
                    "Name of the icon to render (e.g., 'github', 'linkedin', 'twitter').",
                }),
              ],
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "brandColors",
      title: "Brand Colors",
      type: "object",
      fields: [
        defineField({
          name: "themePreset",
          title: "Theme Preset",
          type: "string",
          description: "Select a predefined theme or choose 'Custom' to use manual hex colors.",
          options: {
            list: [
              { title: "Zinc", value: "zinc" },
              { title: "Slate", value: "slate" },
              { title: "Stone", value: "stone" },
              { title: "Gray", value: "gray" },
              { title: "Neutral", value: "neutral" },
              { title: "Red", value: "red" },
              { title: "Rose", value: "rose" },
              { title: "Orange", value: "orange" },
              { title: "Green", value: "green" },
              { title: "Blue", value: "blue" },
              { title: "Yellow", value: "yellow" },
              { title: "Violet", value: "violet" },
              { title: "Custom", value: "custom" },
            ],
          },
          initialValue: "zinc",
        }),
        defineField({
          name: "primary",
          title: "Primary Color (Hex)",
          type: "string",
          hidden: ({ parent }) => parent?.themePreset !== "custom",
          validation: (rule) =>
            rule.custom((value, context) => {
              const themePreset = (context.parent as any)?.themePreset;
              if (themePreset === "custom" && !value) {
                return "Primary color is required when using a custom theme";
              }
              if (value && !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
                return "Must be a valid hex color code";
              }
              return true;
            }),
        }),
        defineField({
          name: "secondary",
          title: "Secondary Color (Hex)",
          type: "string",
          hidden: ({ parent }) => parent?.themePreset !== "custom",
          validation: (rule) =>
            rule.custom((value, context) => {
              const themePreset = (context.parent as any)?.themePreset;
              if (themePreset === "custom" && !value) {
                return "Secondary color is required when using a custom theme";
              }
              if (value && !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
                return "Must be a valid hex color code";
              }
              return true;
            }),
        }),
        defineField({
          name: "accent",
          title: "Accent Color (Hex)",
          type: "string",
          hidden: ({ parent }) => parent?.themePreset !== "custom",
          validation: (rule) =>
            rule.custom((value, context) => {
              const themePreset = (context.parent as any)?.themePreset;
              if (themePreset === "custom" && !value) {
                return "Accent color is required when using a custom theme";
              }
              if (value && !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
                return "Must be a valid hex color code";
              }
              return true;
            }),
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
