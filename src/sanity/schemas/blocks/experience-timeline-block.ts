import { defineType, defineField } from "sanity";

export const experienceTimelineBlock = defineType({
  name: "experienceTimelineBlock",
  title: "Experience Timeline",
  type: "document",
  icon: () => "⏳",
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
      initialValue: "Work Experience",
    }),
    defineField({
      name: "subheadline",
      title: "Subheadline",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "experiences",
      title: "Selected Experiences",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "experience" }],
        },
      ],
      description: "Select and order the experiences you want to display.",
    }),
  ],
  preview: {
    select: { title: "name", experiences: "experiences" },
    prepare: ({ title, experiences }) => ({
      title: title || "Experience Timeline Block",
      subtitle: experiences ? `${experiences.length} experiences` : "0 experiences",
      media: () => "⏳",
    }),
  },
});
