"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { BlockFormShell, type BlockFormProps } from "./block-form-shell";

export const ctaBlockSchema = z.object({
  name: z.string().min(1, "Name is required"),
  heading: z.string().min(1, "Heading is required"),
  text: z.string().optional(),
  button: z.object({
    label: z.string().min(1, "Button label is required"),
    url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  }).optional(),
});

export function CtaBlockForm({ initialData, blockId, mode, onCreated }: BlockFormProps) {
  const form = useForm<z.infer<typeof ctaBlockSchema>>({
    resolver: zodResolver(ctaBlockSchema),
    defaultValues: initialData || {
      name: "",
      heading: "",
      text: "",
      button: { label: "", url: "" },
    },
  });

  return (
    <BlockFormShell type="ctaBlock" blockId={blockId} mode={mode} onCreated={onCreated} form={form} schema={ctaBlockSchema}>
      {(form) => (
        <>
          <FormField
            control={form.control}
            name="heading"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Heading</FormLabel>
                <FormControl>
                  <Input placeholder="Ready to get started?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Supporting Text</FormLabel>
                <FormControl>
                  <Textarea placeholder="Join thousands of happy users." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-medium text-sm">Button Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="button.label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Label</FormLabel>
                    <FormControl>
                      <Input placeholder="Sign Up Now" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="button.url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </>
      )}
    </BlockFormShell>
  );
}
