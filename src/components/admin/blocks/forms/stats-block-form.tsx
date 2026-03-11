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
import { Card } from "@/components/ui/card";

import { BlockFormShell, type BlockFormProps } from "./block-form-shell";

export const statsBlockSchema = z.object({
  name: z.string().min(1, "Name is required"),
  heading: z.string().optional(),
  items: z.array(z.object({
    label: z.string().min(1, "Label is required"),
    value: z.string().min(1, "Value is required"),
    suffix: z.string().optional(),
  })).min(1, "At least one stat is required"),
});

export function StatsBlockForm({ initialData, blockId }: BlockFormProps) {
  const form = useForm<z.infer<typeof statsBlockSchema>>({
    resolver: zodResolver(statsBlockSchema),
    defaultValues: initialData || {
      name: "",
      heading: "",
      items: [{ label: "", value: "", suffix: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  return (
    <BlockFormShell type="statsBlock" blockId={blockId} form={form} schema={statsBlockSchema}>
      {(form) => (
        <>
          <FormField
            control={form.control}
            name="heading"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Heading (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Our Impact in Numbers" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-sm">Stats Items</h4>
                <p className="text-xs text-muted-foreground">Add key metrics to display.</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ label: "", value: "", suffix: "" })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Stat
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-8">
                    <FormField
                      control={form.control}
                      name={`items.${index}.label`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Label</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Happy Customers" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${index}.value`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Value</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 10" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${index}.suffix`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Suffix (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. k+, %" {...field} />
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
