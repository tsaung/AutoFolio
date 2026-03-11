import React, { ComponentType } from "react";
import { type BlockFormProps } from "./block-form-shell";

import { CtaBlockForm } from "./cta-block-form";
import { RichTextBlockForm } from "./rich-text-block-form";
import { StatsBlockForm } from "./stats-block-form";
import { EmbedBlockForm } from "./embed-block-form";
import { FaqBlockForm } from "./faq-block-form";
import { FeatureGridBlockForm } from "./feature-grid-block-form";

// We temporarily use the old monolithic BlockForm for heroBlock
import { BlockForm } from "../block-form";

export const BLOCK_FORM_REGISTRY: Record<string, ComponentType<BlockFormProps>> = {
  ctaBlock: CtaBlockForm,
  richTextBlock: RichTextBlockForm,
  statsBlock: StatsBlockForm,
  embedBlock: EmbedBlockForm,
  faqBlock: FaqBlockForm,
  featureGridBlock: FeatureGridBlockForm,
  heroBlock: (props: BlockFormProps) => React.createElement(BlockForm, { ...props, type: "heroBlock" }),
};

export * from "./block-form-shell";
export * from "./block-config";
