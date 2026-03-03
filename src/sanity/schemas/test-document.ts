import { defineType, defineField } from "sanity";

/**
 * A temporary test document type used to verify that Sanity Studio
 * is correctly embedded and functional. Remove this after Phase 1a
 * verification is complete and real schemas are in place.
 */
export const testDocument = defineType({
  name: "testDocument",
  title: "Test Document",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
  ],
});
