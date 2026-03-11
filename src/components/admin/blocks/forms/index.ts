import React, { ComponentType } from "react";
import { type BlockFormProps } from "./block-form-shell";

import { CtaBlockForm } from "./cta-block-form";
import { RichTextBlockForm } from "./rich-text-block-form";
import { StatsBlockForm } from "./stats-block-form";
import { EmbedBlockForm } from "./embed-block-form";
import { FaqBlockForm } from "./faq-block-form";
import { FeatureGridBlockForm } from "./feature-grid-block-form";
import { HeroBlockForm } from "./hero-block-form";
import { ImageGalleryBlockForm } from "./image-gallery-block-form";
import { ContactFormBlockForm } from "./contact-form-block-form";
import { LogoCloudBlockForm } from "./logo-cloud-block-form";
import { TestimonialBlockForm } from "./testimonial-block-form";
import { ProjectGridBlockForm } from "./project-grid-block-form";
import { ExperienceTimelineBlockForm } from "./experience-timeline-block-form";
import { SkillsBlockForm } from "./skills-block-form";

export const BLOCK_FORM_REGISTRY: Record<string, ComponentType<BlockFormProps>> = {
  ctaBlock: CtaBlockForm,
  richTextBlock: RichTextBlockForm,
  statsBlock: StatsBlockForm,
  embedBlock: EmbedBlockForm,
  faqBlock: FaqBlockForm,
  featureGridBlock: FeatureGridBlockForm,
  heroBlock: HeroBlockForm,
  imageGalleryBlock: ImageGalleryBlockForm,
  contactFormBlock: ContactFormBlockForm,
  logoCloudBlock: LogoCloudBlockForm,
  testimonialBlock: TestimonialBlockForm,
  projectGridBlock: ProjectGridBlockForm,
  experienceTimelineBlock: ExperienceTimelineBlockForm,
  skillsBlock: SkillsBlockForm,
};

export * from "./block-form-shell";
export * from "./block-config";
