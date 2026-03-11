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
import { Button } from "@/components/ui/button";
import { SanityImageUpload } from "@/components/admin/sanity-image-upload";
import { Trash2, PlusCircle } from "lucide-react";

import { BlockFormShell, type BlockFormProps } from "./block-form-shell";

export const logoCloudBlockSchema = z.object({
  name: z.string().min(1, "Name is required"),
  headline: z.string().optional(),
  logos: z
    .array(
      z.object({
        name: z.string().min(1, "Logo name is required"),
        image: z.any().optional(),
        url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
      })
    )
    .min(1, "At least one logo is required"),
});

export function LogoCloudBlockForm({ initialData, blockId }: BlockFormProps) {
  const form = useForm<z.infer<typeof logoCloudBlockSchema>>({
    resolver: zodResolver(logoCloudBlockSchema),
    defaultValues: initialData || {
      name: "",
      headline: "",
      logos: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "logos",
  });

  return (
    <BlockFormShell type="logoCloudBlock" blockId={blockId} form={form} schema={logoCloudBlockSchema}>
      {(form) => (
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="headline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Headline</FormLabel>
                <FormControl>
                  <Input placeholder="Trusted by amazing companies" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Logos</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ name: "", image: null, url: "" })}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Logo
              </Button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-4 items-start bg-muted/30 p-4 rounded-md border">
                <FormField
                  control={form.control}
                  name={`logos.${index}.image`}
                  render={({ field: imageField }) => (
                    <FormItem>
                      <FormControl>
                        <SanityImageUpload
                          value={imageField.value}
                          onChange={imageField.onChange}
                          className="h-32"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name={`logos.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Corp" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`logos.${index}.url`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">URL (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://acmecorp.com" {...field} />
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
                No logos added yet. Click "Add Logo" to start.
              </p>
            )}
          </div>
        </div>
      )}
    </BlockFormShell>
  );
}
