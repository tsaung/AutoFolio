import { defineType, defineField } from "sanity";

export const projectGridBlock = defineType({
  name: "projectGridBlock",
  title: "Project Grid",
  type: "document",
  icon: () => "🚀",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "Internal name for this block in the library",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      initialValue: "Selected Projects",
    }),
    defineField({
      name: "subheadline",
      title: "Subheadline",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "projects",
      title: "Selected Projects",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "project" }],
        },
      ],
      description: "Select and order the projects you want to display.",
    }),
  ],
  preview: {
    select: { title: "name", projects: "projects" },
    prepare: ({ title, projects }) => ({
      title: title || "Project Grid Block",
      subtitle: projects ? `${projects.length} projects` : "0 projects",
      media: () => "🚀",
    }),
  },
});
