"use client";

import { useForm, useFieldArray } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import { SanityImageUpload } from "@/components/admin/sanity-image-upload";
import { Trash2, PlusCircle } from "lucide-react";

import { BlockFormShell, type BlockFormProps } from "./block-form-shell";

export const heroBlockSchema = z.object({
  name: z.string().min(1, "Name is required"),
  headline: z.string().min(1, "Headline is required"),
  subheadline: z.string().optional(),
  backgroundImage: z.any().optional(),
  buttons: z
    .array(
      z.object({
        label: z.string().min(1, "Label is required"),
        url: z.string().min(1, "URL is required"),
        style: z.enum(["primary", "secondary", "outline"]),
      })
    )
    .max(3, "Maximum of 3 buttons allowed")
    .optional(),
});

export function HeroBlockForm({ initialData, blockId }: BlockFormProps) {
  const form = useForm<z.infer<typeof heroBlockSchema>>({
    resolver: zodResolver(heroBlockSchema),
    defaultValues: initialData || {
      name: "",
      headline: "",
      subheadline: "",
      backgroundImage: null,
      buttons: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "buttons",
  });

  return (
    <BlockFormShell type="heroBlock" blockId={blockId} form={form} schema={heroBlockSchema}>
      {(form) => (
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="headline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Headline</FormLabel>
                <FormControl>
                  <Input placeholder="Welcome to my site" {...field} />
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
                  <Textarea placeholder="A brief description about what you do." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="backgroundImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <SanityImageUpload
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Buttons (Max 3)</h4>
              {fields.length < 3 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ label: "", url: "", style: "primary" })}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Button
                </Button>
              )}
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto] gap-4 items-end bg-muted/30 p-4 rounded-md border">
                <FormField
                  control={form.control}
                  name={`buttons.${index}.label`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Label</FormLabel>
                      <FormControl>
                        <Input placeholder="Get Started" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`buttons.${index}.url`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">URL</FormLabel>
                      <FormControl>
                        <Input placeholder="/contact" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`buttons.${index}.style`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Style</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          <option value="primary">Primary</option>
                          <option value="secondary">Secondary</option>
                          <option value="outline">Outline</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-muted-foreground hover:text-destructive shrink-0"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {fields.length === 0 && (
              <p className="text-sm text-muted-foreground italic text-center py-4 border border-dashed rounded-md">
                No buttons added yet.
              </p>
            )}
          </div>
        </div>
      )}
    </BlockFormShell>
  );
}
