import type { PortableTextBlock } from "next-sanity";

export interface SanityExperience {
  _id: string;
  _type: "experience";
  _createdAt: string;
  _updatedAt: string;
  title: string;
  company: string;
  location?: string;
  startDate: string; // "YYYY-MM-DD"
  endDate?: string; // "YYYY-MM-DD" or undefined
  description?: PortableTextBlock[];
  sortOrder: number;
  createdBy?: string;
  updatedBy?: string;
}

export interface SanityProject {
  _id: string;
  _type: "project";
  _createdAt: string;
  _updatedAt: string;
  title: string;
  slug?: { current: string };
  description: string;
  image?: {
    _type: "image";
    asset: {
      _ref: string;
      _type: "reference";
    };
  };
  liveUrl?: string;
  repoUrl?: string;
  tags?: string[];
  status: "published" | "draft" | "archived";
  sortOrder: number;
  createdBy?: string;
  updatedBy?: string;
}

export interface SanitySkill {
  _id: string;
  _type: "skill";
  _createdAt: string;
  _updatedAt: string;
  name: string;
  category: string;
  proficiency: number;
  sortOrder: number;
  createdBy?: string;
  updatedBy?: string;
}

export interface SanitySocialLink {
  _id: string;
  _type: "socialLink";
  _createdAt: string;
  _updatedAt: string;
  platform: string;
  url: string;
  icon?: string;
  sortOrder: number;
  createdBy?: string;
  updatedBy?: string;
}

export interface SanityNavigationItem {
  _key?: string;
  _type: "navigationItem";
  label: string;
  link?: Array<
    | { _type: "reference"; _ref: string; _key?: string }
    | { _type: "externalLink"; url: string; _key?: string }
  >;
  children?: SanityNavigationItem[];
}

export interface SanityNavigation {
  _id: string;
  _type: "navigation";
  _createdAt: string;
  _updatedAt: string;
  name: string;
  items?: SanityNavigationItem[];
  createdBy?: string;
  updatedBy?: string;
}

export interface SanityBlockReference {
  _type: "reference";
  _ref: string;
  _key?: string;
}

export interface SanityHeroBlock {
  _id: string;
  _type: "heroBlock";
  _key?: string;
  name: string;
  headline: string;
  subheadline?: string;
  buttons?: Array<{
    label: string;
    url: string;
    style: "primary" | "secondary" | "outline";
    _key: string;
  }>;
  backgroundImage?: any;
  createdBy?: string;
  updatedBy?: string;
}

export interface SanityCtaBlock {
  _id: string;
  _type: "ctaBlock";
  _key?: string;
  name: string;
  heading: string;
  text?: string;
  button?: {
    label: string;
    url: string;
  };
  createdBy?: string;
  updatedBy?: string;
}

export interface SanityRichTextBlock {
  _id: string;
  _type: "richTextBlock";
  _key?: string;
  name: string;
  content: PortableTextBlock[];
  createdBy?: string;
  updatedBy?: string;
}

export interface SanityStatsBlock {
  _id: string;
  _type: "statsBlock";
  _key?: string;
  name: string;
  items: Array<{
    _key: string;
    label: string;
    value: string;
    suffix?: string;
  }>;
  createdBy?: string;
  updatedBy?: string;
}

export interface SanityEmbedBlock {
  _id: string;
  _type: "embedBlock";
  _key?: string;
  name: string;
  embedType: "youtube" | "vimeo" | "custom";
  url?: string;
  code?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface SanityFaqBlock {
  _id: string;
  _type: "faqBlock";
  _key?: string;
  name: string;
  items: Array<{
    _key: string;
    question: string;
    answer: string;
  }>;
  createdBy?: string;
  updatedBy?: string;
}

export interface SanityFeatureGridBlock {
  _id: string;
  _type: "featureGridBlock";
  _key?: string;
  name: string;
  features: Array<{
    _key: string;
    icon?: string;
    title: string;
    description: string;
  }>;
  createdBy?: string;
  updatedBy?: string;
}

export type SanityPageBlock = 
  | SanityHeroBlock 
  | SanityCtaBlock 
  | SanityRichTextBlock 
  | SanityStatsBlock 
  | SanityEmbedBlock 
  | SanityFaqBlock 
  | SanityFeatureGridBlock;

export const BLOCK_TYPES = [
  "heroBlock",
  "ctaBlock",
  "richTextBlock",
  "statsBlock",
  "embedBlock",
  "faqBlock",
  "featureGridBlock",
] as const;

export interface SanityPage {
  _id: string;
  _type: "page";
  title: string;
  slug?: { current: string };
  pageBuilder?: SanityPageBlock[];
}
