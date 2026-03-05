import { defineType, defineField } from "sanity";

export const navigation = defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "Internal name for this menu (e.g., 'Main Menu', 'Footer Menu').",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "items",
      title: "Navigation Items",
      type: "array",
      of: [{ type: "navigationItem" }],
      description: "List of items in this menu.",
    }),
  ],
  preview: {
    select: { title: "name" },
  },
});
