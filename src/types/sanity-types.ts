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
