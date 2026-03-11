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
import { SanityReferencePicker } from "@/components/admin/sanity-reference-picker";

import { BlockFormShell, type BlockFormProps } from "./block-form-shell";

export const projectGridBlockSchema = z.object({
  name: z.string().min(1, "Name is required"),
  headline: z.string().optional(),
  subheadline: z.string().optional(),
  projects: z
    .array(
      z.object({
        _type: z.literal("reference"),
        _ref: z.string(),
        _key: z.string().optional(),
      })
    )
    .optional(),
});

export function ProjectGridBlockForm({ initialData, blockId }: BlockFormProps) {
  const form = useForm<z.infer<typeof projectGridBlockSchema>>({
    resolver: zodResolver(projectGridBlockSchema),
    defaultValues: initialData || {
      name: "",
      headline: "Selected Projects",
      subheadline: "",
      projects: [],
    },
  });

  return (
    <BlockFormShell type="projectGridBlock" blockId={blockId} form={form} schema={projectGridBlockSchema}>
      {(form) => (
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="headline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Headline</FormLabel>
                <FormControl>
                  <Input placeholder="Selected Projects" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subheadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subheadline</FormLabel>
                <FormControl>
                  <Textarea placeholder="A selection of my recent work." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-medium">Projects</h4>
            <FormField
              control={form.control}
              name="projects"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <SanityReferencePicker
                      type="project"
                      value={field.value as any[]}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      )}
    </BlockFormShell>
  );
}
