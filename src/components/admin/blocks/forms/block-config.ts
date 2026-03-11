import {
  MonitorPlay,
  MousePointerClick,
  FileText,
  BarChart3,
  Code2,
  HelpCircle,
  LayoutGrid,
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
};
