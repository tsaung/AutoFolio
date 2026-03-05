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
  image?: any;
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
