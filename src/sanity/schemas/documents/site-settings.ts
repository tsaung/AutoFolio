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
      name: "navigation",
      title: "Main Navigation",
      type: "array",
      of: [
        {
          type: "object",
          name: "navItem",
          title: "Navigation Item",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "link",
              title: "Link",
              description: "Link to a page document or an external URL.",
              type: "array",
              of: [
                { type: "reference", to: [{ type: "page" }] },
                {
                  type: "object",
                  name: "externalLink",
                  title: "External URL",
                  fields: [
                    defineField({
                      name: "url",
                      title: "URL",
                      type: "url",
                      validation: (rule) =>
                        rule.uri({ scheme: ["http", "https"] }),
                    }),
                  ],
                },
              ],
              validation: (rule) => rule.max(1),
            }),
          ],
          preview: {
            select: { title: "label" },
          },
        },
      ],
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
          name: "primary",
          title: "Primary Color (Hex)",
          type: "string",
          validation: (rule) =>
            rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
              name: "hex color code",
            }),
        }),
        defineField({
          name: "secondary",
          title: "Secondary Color (Hex)",
          type: "string",
          validation: (rule) =>
            rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
              name: "hex color code",
            }),
        }),
        defineField({
          name: "accent",
          title: "Accent Color (Hex)",
          type: "string",
          validation: (rule) =>
            rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
              name: "hex color code",
            }),
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
