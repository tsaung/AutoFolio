import { defineType, defineField } from "sanity";

export const imageGalleryBlock = defineType({
  name: "imageGalleryBlock",
  title: "Image Gallery",
  type: "document",
  icon: () => "🖼️",
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
      name: "subheadline",
      title: "Subheadline",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              type: "string",
              title: "Alternative text",
              description: "Important for SEO and accessiblity.",
            }),
            defineField({
              name: "caption",
              type: "string",
              title: "Caption",
            }),
          ],
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "layout",
      title: "Layout",
      type: "string",
      options: {
        list: [
          { title: "Grid", value: "grid" },
          { title: "Masonry", value: "masonry" },
          { title: "Carousel", value: "carousel" },
        ],
        layout: "radio",
      },
      initialValue: "grid",
    }),
  ],
  preview: {
    select: {
      title: "name",
      images: "images",
    },
    prepare: ({ title, images }) => {
      return {
        title: title || "Image Gallery Block",
        subtitle: images ? `${images.length} images` : "0 images",
        media: images?.[0] || (() => "🖼️"),
      };
    },
  },
});
