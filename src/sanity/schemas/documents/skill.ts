import { defineType, defineField } from "sanity";

export const skill = defineType({
  name: "skill",
  title: "Skill",
  type: "document",
  icon: () => "⚡",
  fields: [
    defineField({
      name: "name",
      title: "Skill Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      validation: (rule) => rule.required(),
      description: "e.g., Frontend, Backend, Database, Tools",
    }),
    defineField({
      name: "proficiency",
      title: "Proficiency (0-100)",
      type: "number",
      validation: (rule) => rule.min(0).max(100),
      initialValue: 50,
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      description: "Lower numbers appear first.",
      initialValue: 0,
    }),
    defineField({
      name: "createdBy",
      title: "Created By (Supabase User ID)",
      type: "string",
      hidden: true,
    }),
    defineField({
      name: "updatedBy",
      title: "Updated By (Supabase User ID)",
      type: "string",
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category",
    },
  },
  orderings: [
    {
      title: "Sort Order, Asending",
      name: "sortOrderAsc",
      by: [{ field: "sortOrder", direction: "asc" }],
    },
  ],
});
