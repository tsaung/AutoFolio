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
import { Textarea } from "@/components/ui/textarea";

import { BlockFormShell, type BlockFormProps } from "./block-form-shell";

export const richTextBlockSchema = z.object({
  name: z.string().min(1, "Name is required"),
  content: z.string().min(1, "Content is required"),
});

export function RichTextBlockForm({ initialData, blockId }: BlockFormProps) {
  const form = useForm<z.infer<typeof richTextBlockSchema>>({
    resolver: zodResolver(richTextBlockSchema),
    defaultValues: initialData || {
      name: "",
      content: "",
    },
  });

  return (
    <BlockFormShell type="richTextBlock" blockId={blockId} form={form} schema={richTextBlockSchema}>
      {(form) => (
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your rich text content here..."
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </BlockFormShell>
  );
}
