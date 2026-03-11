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

export const testimonialBlockSchema = z.object({
  name: z.string().min(1, "Name is required"),
  headline: z.string().optional(),
  testimonials: z
    .array(
      z.object({
        quote: z.string().min(1, "Quote is required"),
        author: z.string().min(1, "Author name is required"),
        role: z.string().optional(),
        avatar: z.any().optional(),
      })
    )
    .min(1, "At least one testimonial is required"),
});

export function TestimonialBlockForm({ initialData, blockId, mode, onCreated }: BlockFormProps) {
  const form = useForm<z.infer<typeof testimonialBlockSchema>>({
    resolver: zodResolver(testimonialBlockSchema),
    defaultValues: initialData || {
      name: "",
      headline: "",
      testimonials: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "testimonials",
  });

  return (
    <BlockFormShell type="testimonialBlock" blockId={blockId} mode={mode} onCreated={onCreated} form={form} schema={testimonialBlockSchema}>
      {(form) => (
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="headline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Headline</FormLabel>
                <FormControl>
                  <Input placeholder="What people are saying" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Testimonials</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ quote: "", author: "", role: "", avatar: null })}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Testimonial
              </Button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-[1fr_3fr_auto] gap-4 items-start bg-muted/30 p-4 rounded-md border">
                <FormField
                  control={form.control}
                  name={`testimonials.${index}.avatar`}
                  render={({ field: avatarField }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Avatar</FormLabel>
                      <FormControl>
                        <SanityImageUpload
                          value={avatarField.value}
                          onChange={avatarField.onChange}
                          className="h-32 w-32 rounded-full mx-auto"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name={`testimonials.${index}.quote`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Quote</FormLabel>
                        <FormControl>
                          <Textarea placeholder="This service is amazing!" rows={3} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`testimonials.${index}.author`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Author Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Jane Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`testimonials.${index}.role`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Role / Company (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="CEO at Acme" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 mt-6 text-muted-foreground hover:text-destructive shrink-0"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {fields.length === 0 && (
              <p className="text-sm text-muted-foreground italic text-center py-8 border border-dashed rounded-md">
                No testimonials added yet. Click "Add Testimonial" to start.
              </p>
            )}
          </div>
        </div>
      )}
    </BlockFormShell>
  );
}
