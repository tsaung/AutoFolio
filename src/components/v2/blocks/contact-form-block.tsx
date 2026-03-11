"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ContactFormBlockData = {
  _type: "contactFormBlock";
  _key: string;
  name: string;
  headline: string;
  subheadline?: string;
  submitLabel?: string;
  showPhone?: boolean;
  showCompany?: boolean;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ContactFormBlock({ data }: { data: ContactFormBlockData }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // In a real implementation this would call a server action or API route.
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    // Reset success message after 5 seconds
    setTimeout(() => setIsSuccess(false), 5000);
    // Reset form
    (e.target as HTMLFormElement).reset();
  };

  return (
    <section className="container mx-auto px-6 py-20 lg:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
          {data.headline}
        </h2>
        {data.subheadline && (
          <p className="mt-4 text-lg text-muted-foreground">
            {data.subheadline}
          </p>
        )}
      </div>

      <div className="mx-auto mt-12 max-w-xl rounded-2xl bg-card p-6 shadow-sm border border-border sm:p-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" name="firstName" required placeholder="John" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" name="lastName" required placeholder="Doe" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required placeholder="john@example.com" />
          </div>

          {(data.showPhone || data.showCompany) && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {data.showPhone && (
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" />
                </div>
              )}
              {data.showCompany && (
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" name="company" placeholder="Acme Inc." />
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              required
              placeholder="How can we help you?"
              rows={5}
              className="resize-none"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : data.submitLabel || "Send Message"}
          </Button>

          {isSuccess && (
            <div className="rounded-md bg-green-500/10 p-4 text-sm text-green-700 dark:text-green-400 text-center font-medium">
              Thank you! Your message has been sent successfully.
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
