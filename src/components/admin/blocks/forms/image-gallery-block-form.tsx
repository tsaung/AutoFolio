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

export const imageGalleryBlockSchema = z.object({
  name: z.string().min(1, "Name is required"),
  headline: z.string().optional(),
  subheadline: z.string().optional(),
  layout: z.enum(["grid", "masonry", "carousel"]),
  images: z
    .array(
      z.object({
        asset: z.any().optional(),
        _type: z.literal("image"),
        alt: z.string().optional(),
        caption: z.string().optional(),
      })
    )
    .min(1, "At least one image is required"),
});

export function ImageGalleryBlockForm({ initialData, blockId, mode, onCreated }: BlockFormProps) {
  const form = useForm<z.infer<typeof imageGalleryBlockSchema>>({
    resolver: zodResolver(imageGalleryBlockSchema),
    defaultValues: initialData || {
      name: "",
      headline: "",
      subheadline: "",
      layout: "grid",
      images: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "images",
  });

  return (
    <BlockFormShell type="imageGalleryBlock" blockId={blockId} mode={mode} onCreated={onCreated} form={form} schema={imageGalleryBlockSchema}>
      {(form) => (
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="headline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Headline</FormLabel>
                <FormControl>
                  <Input placeholder="Gallery" {...field} />
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
                  <Textarea placeholder="A few photos of my work." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="layout"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Layout Style</FormLabel>
                <FormControl>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                  >
                    <option value="grid">Grid</option>
                    <option value="masonry">Masonry</option>
                    <option value="carousel">Carousel</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Images</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ asset: null, _type: "image", alt: "", caption: "" })}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Image
              </Button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-4 items-start bg-muted/30 p-4 rounded-md border">
                <FormField
                  control={form.control}
                  name={`images.${index}`}
                  render={({ field: imageField }) => (
                    <FormItem>
                      <FormControl>
                        <SanityImageUpload
                          value={imageField.value?.asset ? imageField.value : null}
                          onChange={(val) => imageField.onChange({ ...imageField.value, ...val })}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name={`images.${index}.alt`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Alt Text</FormLabel>
                        <FormControl>
                          <Input placeholder="Describe the image for SEO/Accessibility" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`images.${index}.caption`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Caption</FormLabel>
                        <FormControl>
                          <Input placeholder="Optional image caption" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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
              <p className="text-sm text-muted-foreground italic text-center py-8 border border-dashed rounded-md">
                No images added yet. Click "Add Image" to start.
              </p>
            )}
          </div>
        </div>
      )}
    </BlockFormShell>
  );
}
