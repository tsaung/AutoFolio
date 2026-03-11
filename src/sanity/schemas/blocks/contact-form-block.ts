import { defineType, defineField } from "sanity";

export const contactFormBlock = defineType({
  name: "contactFormBlock",
  title: "Contact Form",
  type: "document",
  icon: () => "✉️",
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
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subheadline",
      title: "Subheadline",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "submitLabel",
      title: "Submit Button Label",
      type: "string",
      initialValue: "Send Message",
    }),
    defineField({
      name: "showPhone",
      title: "Show Phone Field",
      type: "boolean",
      description: "Enable the Phone Number input field.",
      initialValue: false,
    }),
    defineField({
      name: "showCompany",
      title: "Show Company Field",
      type: "boolean",
      description: "Enable the Company input field.",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "headline" },
    prepare: ({ title, subtitle }) => ({
      title: title || "Contact Form Block",
      subtitle: subtitle || "No headline",
      media: () => "✉️",
    }),
  },
});
