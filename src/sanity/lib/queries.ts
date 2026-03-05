import { groq } from "next-sanity";

/**
 * Fetches a single `page` document by its slug.
 * Returns the full pageBuilder array so PageRenderer can map blocks.
 */
export const PAGE_BY_SLUG_QUERY = groq`
  *[_type == "page" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    seo,
    pageBuilder[]
  }
`;

/**
 * Fetches all \`experience\` documents, ordered by sortOrder ascending.
 */
export const EXPERIENCES_QUERY = groq`
  *[_type == "experience"] | order(sortOrder asc)
`;

/**
 * Fetches a single \`experience\` document by its ID.
 */
export const EXPERIENCE_BY_ID_QUERY = groq`
  *[_type == "experience" && _id == $id][0]
`;
