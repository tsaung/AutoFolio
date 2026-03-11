// Objects
import { seo } from "./objects/seo";
import { navigationItem } from "./objects/navigation-item";

// Block Documents
import { heroBlock } from "./blocks/hero-block";
import { richTextBlock } from "./blocks/rich-text-block";
import { ctaBlock } from "./blocks/cta-block";
import { statsBlock } from "./blocks/stats-block";
import { embedBlock } from "./blocks/embed-block";
import { faqBlock } from "./blocks/faq-block";
import { featureGridBlock } from "./blocks/feature-grid-block";

// Other Documents
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
  // Block Documents
  heroBlock,
  richTextBlock,
  ctaBlock,
  statsBlock,
  embedBlock,
  faqBlock,
  featureGridBlock,
  // Other Documents
  page,
  project,
  experience,
  skill,
  siteSettings,
  navigation,
];
