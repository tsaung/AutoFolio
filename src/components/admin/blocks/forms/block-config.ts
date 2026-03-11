import {
  MonitorPlay,
  MousePointerClick,
  FileText,
  BarChart3,
  Code2,
  HelpCircle,
  LayoutGrid,
  Image as ImageIcon,
  Mail,
  Cloud,
  MessageSquare,
  Briefcase,
  History,
  Wrench,
} from "lucide-react";
import { type LucideIcon } from "lucide-react";

export interface BlockConfig {
  title: string;
  description: string;
  icon: LucideIcon;
  category: "simple" | "medium" | "complex";
}

export const BLOCK_CONFIG: Record<string, BlockConfig> = {
  heroBlock: {
    title: "Hero",
    description: "A prominent section typically used at the top of a page, featuring a headline, subheadline, background image, and call-to-action buttons.",
    icon: MonitorPlay,
    category: "complex",
  },
  ctaBlock: {
    title: "Call to Action",
    description: "A focused section designed to drive users towards a specific goal, with a bold heading, supporting text, and a primary button.",
    icon: MousePointerClick,
    category: "simple",
  },
  richTextBlock: {
    title: "Rich Text",
    description: "A flexible text block for general content, supporting markdown or rich formatting.",
    icon: FileText,
    category: "simple",
  },
  statsBlock: {
    title: "Stats",
    description: "Display key metrics or numbers in a visually appealing grid.",
    icon: BarChart3,
    category: "simple",
  },
  embedBlock: {
    title: "Embed",
    description: "Embed content from external sources like YouTube, Vimeo, or custom HTML/iframe.",
    icon: Code2,
    category: "simple",
  },
  faqBlock: {
    title: "FAQ",
    description: "A list of frequently asked questions and their answers.",
    icon: HelpCircle,
    category: "medium",
  },
  featureGridBlock: {
    title: "Feature Grid",
    description: "A grid highlighting key features, services, or benefits, often with icons.",
    icon: LayoutGrid,
    category: "medium",
  },
  imageGalleryBlock: {
    title: "Image Gallery",
    description: "A collection of images displayed in a grid, masonry, or carousel layout.",
    icon: ImageIcon,
    category: "complex",
  },
  contactFormBlock: {
    title: "Contact Form",
    description: "An interactive form allowing users to get in touch with you.",
    icon: Mail,
    category: "complex",
  },
  logoCloudBlock: {
    title: "Logo Cloud",
    description: "A section showcasing logos of clients, partners, or featured technologies.",
    icon: Cloud,
    category: "complex",
  },
  testimonialBlock: {
    title: "Testimonial",
    description: "A collection of quotes and reviews from clients or colleagues.",
    icon: MessageSquare,
    category: "complex",
  },
  projectGridBlock: {
    title: "Project Grid",
    description: "A dynamic grid of selected portfolio projects fetched from your CMS.",
    icon: Briefcase,
    category: "complex",
  },
  experienceTimelineBlock: {
    title: "Experience Timeline",
    description: "A visual timeline displaying selected work experiences.",
    icon: History,
    category: "complex",
  },
  skillsBlock: {
    title: "Skills",
    description: "A section detailing your professional skills and expertise.",
    icon: Wrench,
    category: "complex",
  },
};
