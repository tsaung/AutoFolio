import { defineType, defineField } from "sanity";

export const testimonialBlock = defineType({
  name: "testimonialBlock",
  title: "Testimonial",
  type: "document",
  icon: () => "💬",
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
    }),
    defineField({
      name: "testimonials",
      title: "Testimonials",
      type: "array",
      of: [
        {
          type: "object",
          name: "testimonial",
          fields: [
            defineField({
              name: "quote",
              title: "Quote",
              type: "text",
              rows: 4,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "author",
              title: "Author Name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "role",
              title: "Author Role",
              type: "string",
            }),
            defineField({
              name: "avatar",
              title: "Avatar",
              type: "image",
              options: { hotspot: true },
            }),
          ],
          preview: {
            select: {
              title: "author",
              subtitle: "quote",
              media: "avatar",
            },
          },
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "name", testimonials: "testimonials" },
    prepare: ({ title, testimonials }) => ({
      title: title || "Testimonial Block",
      subtitle: testimonials ? `${testimonials.length} testimonials` : "0 testimonials",
      media: () => "💬",
    }),
  },
});
