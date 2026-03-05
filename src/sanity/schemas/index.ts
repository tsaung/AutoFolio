// Objects
import { seo } from "./objects/seo";

// Blocks
import { heroBlock } from "./blocks/hero-block";
import { richTextBlock } from "./blocks/rich-text-block";
import { ctaBlock } from "./blocks/cta-block";

// Documents
import { page } from "./documents/page";
import { project } from "./documents/project";
import { experience } from "./documents/experience";
import { siteSettings } from "./documents/site-settings";
import { skill } from "./documents/skill";
import { socialLink } from "./documents/social-link";

export const schemaTypes = [
  // Objects
  seo,
  // Blocks
  heroBlock,
  richTextBlock,
  ctaBlock,
  // Documents
  page,
  project,
  experience,
  skill,
  socialLink,
  siteSettings,
];
