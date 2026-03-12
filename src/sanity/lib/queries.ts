import { groq } from "next-sanity";

/**
 * Fetches a single `page` document by its slug.
 * Returns the full pageBuilder array so PageRenderer can map blocks.
 */
export const PAGES_QUERY = groq`
  *[_type == "page"] | order(_updatedAt desc) {
    _id,
    title,
    "slug": slug.current,
    _updatedAt
  }
`;

export const PAGE_BY_SLUG_QUERY = groq`
  *[_type == "page" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    seo,
    pageBuilder[]{
      _key,
      ...@->{
        ...,
        _type == "projectGridBlock" => {
          projects[]->
        }
      }
    }
  }
`;

export const BLOCKS_QUERY = groq`
  *[_type in $types] | order(_updatedAt desc)
`;

export const BLOCK_BY_ID_QUERY = groq`
  *[_id == $id][0]
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

export const PROJECTS_QUERY = groq`
  *[_type == "project"] | order(sortOrder asc)
`;

export const PROJECT_BY_ID_QUERY = groq`
  *[_type == "project" && _id == $id][0]
`;

export const PUBLIC_PROJECTS_QUERY = groq`
  *[_type == "project" && status == "published"] | order(sortOrder asc)
`;

export const SKILLS_QUERY = groq`
  *[_type == "skill"] | order(sortOrder asc)
`;

export const SKILL_BY_ID_QUERY = groq`
  *[_type == "skill" && _id == $id][0]
`;

export const SOCIAL_LINKS_QUERY = groq`
  *[_type == "socialLink"] | order(sortOrder asc)
`;

export const SOCIAL_LINK_BY_ID_QUERY = groq`
  *[_type == "socialLink" && _id == $id][0]
`;

export const SITE_SETTINGS_QUERY = groq`
  *[_type == "siteSettings"][0]{
    ...,
    mainNavigation->{
      items[]{
        label,
        link[]{
          _type == "reference" => @->{ "slug": slug.current, _type },
          _type == "externalLink" => { "url": url, _type }
        },
        children
      }
    },
    footerNavigation->{
      items[]{
        label,
        link[]{
          _type == "reference" => @->{ "slug": slug.current, _type },
          _type == "externalLink" => { "url": url, _type }
        },
        children
      }
    }
  }
`;
