"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

import { BlockFormShell, type BlockFormProps } from "./block-form-shell";

export const featureGridBlockSchema = z.object({
  name: z.string().min(1, "Name is required"),
  heading: z.string().optional(),
  subheading: z.string().optional(),
  features: z.array(z.object({
    icon: z.string().optional(),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
  })).min(1, "At least one feature is required"),
});

export function FeatureGridBlockForm({ initialData, blockId }: BlockFormProps) {
  const form = useForm<z.infer<typeof featureGridBlockSchema>>({
    resolver: zodResolver(featureGridBlockSchema),
    defaultValues: initialData || {
      name: "",
      heading: "",
      subheading: "",
      features: [{ icon: "", title: "", description: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "features",
  });

  return (
    <BlockFormShell type="featureGridBlock" blockId={blockId} form={form} schema={featureGridBlockSchema}>
      {(form) => (
        <>
          <FormField
            control={form.control}
            name="heading"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Heading (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Why Choose Us?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subheading"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subheading (Optional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="We offer the best features in the market." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-sm">Features</h4>
                <p className="text-xs text-muted-foreground">Add features to display in the grid.</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ icon: "", title: "", description: "" })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Feature
              </Button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <Card key={field.id} className="p-4 relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 text-destructive opacity-50 hover:opacity-100"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="space-y-4 pr-8">
                    <FormField
                      control={form.control}
                      name={`features.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Lightning Fast" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`features.${index}.icon`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Icon Name (lucide-react, optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Zap, Star" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`features.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Our platform is designed for speed..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </BlockFormShell>
  );
}
