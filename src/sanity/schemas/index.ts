// Objects
import { seo } from "./objects/seo";
import { navigationItem } from "./objects/navigation-item";

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
import { navigation } from "./documents/navigation";

export const schemaTypes = [
  // Objects
  seo,
  navigationItem,
  // Blocks
  heroBlock,
  richTextBlock,
  ctaBlock,
  // Documents
  page,
  project,
  experience,
  skill,
  siteSettings,
  navigation,
];
