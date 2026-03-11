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
  _key: string;
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
  _type: "richTextBlock";
  _key: string;
  content: PortableTextBlock[];
}

export type SanityPageBlock = SanityBlockReference | SanityRichTextBlock;

export interface SanityPage {
  _id: string;
  _type: "page";
  title: string;
  slug?: { current: string };
  pageBuilder?: SanityPageBlock[];
}
