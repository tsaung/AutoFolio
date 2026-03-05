import { defineType, defineField } from "sanity";

export const socialLink = defineType({
  name: "socialLink",
  title: "Social Link",
  type: "document",
  icon: () => "🔗",
  fields: [
    defineField({
      name: "platform",
      title: "Platform Name",
      type: "string",
      validation: (rule) => rule.required(),
      description: "e.g., GitHub, LinkedIn, Twitter",
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon Name",
      type: "string",
      description: "Name of the icon from lucide-react, e.g., 'github', 'linkedin'",
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
      title: "platform",
      subtitle: "url",
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
