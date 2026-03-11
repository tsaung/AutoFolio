import { defineType, defineField } from "sanity";

export const skillsBlock = defineType({
  name: "skillsBlock",
  title: "Skills",
  type: "document",
  icon: () => "🛠️",
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
      initialValue: "Skills & Expertise",
    }),
    defineField({
      name: "subheadline",
      title: "Subheadline",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "skills",
      title: "Selected Skills",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "skill" }],
        },
      ],
      description: "Select and order the skills you want to display.",
    }),
  ],
  preview: {
    select: { title: "name", skills: "skills" },
    prepare: ({ title, skills }) => ({
      title: title || "Skills Block",
      subtitle: skills ? `${skills.length} skills` : "0 skills",
      media: () => "🛠️",
    }),
  },
});
