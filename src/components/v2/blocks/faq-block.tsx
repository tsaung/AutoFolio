import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type FaqItem = {
  _key: string;
  question: string;
  answer: string;
};

export type FaqBlockData = {
  _type: "faqBlock";
  _key: string;
  name: string;
  items: FaqItem[];
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function FaqBlock({ data }: { data: FaqBlockData }) {
  if (!data.items || data.items.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto max-w-4xl px-6 py-16">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
          Frequently Asked Questions
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Find answers to common questions about our services.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {data.items.map((item, index) => (
          <AccordionItem key={item._key || index} value={`item-${index}`}>
            <AccordionTrigger className="text-left py-4 text-lg font-medium hover:text-primary transition-colors">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-base text-muted-foreground leading-relaxed">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
