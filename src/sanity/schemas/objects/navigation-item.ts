import { defineType, defineField } from "sanity";

export const navigationItem = defineType({
  name: "navigationItem",
  title: "Navigation Item",
  type: "object",
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
              validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
            }),
          ],
        },
      ],
      validation: (rule) => rule.max(1),
    }),
    defineField({
      name: "children",
      title: "Children",
      type: "array",
      of: [{ type: "navigationItem" }],
      description: "Dropdown items (recursive, recommended up to 3 levels)",
    }),
  ],
  preview: {
    select: { title: "label" },
  },
});
