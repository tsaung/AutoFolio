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

export const faqBlockSchema = z.object({
  name: z.string().min(1, "Name is required"),
  heading: z.string().optional(),
  items: z.array(z.object({
    question: z.string().min(1, "Question is required"),
    answer: z.string().min(1, "Answer is required"),
  })).min(1, "At least one FAQ item is required"),
});

export function FaqBlockForm({ initialData, blockId }: BlockFormProps) {
  const form = useForm<z.infer<typeof faqBlockSchema>>({
    resolver: zodResolver(faqBlockSchema),
    defaultValues: initialData || {
      name: "",
      heading: "",
      items: [{ question: "", answer: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  return (
    <BlockFormShell type="faqBlock" blockId={blockId} form={form} schema={faqBlockSchema}>
      {(form) => (
        <>
          <FormField
            control={form.control}
            name="heading"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Heading (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Frequently Asked Questions" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-sm">FAQ Items</h4>
                <p className="text-xs text-muted-foreground">Add questions and answers.</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ question: "", answer: "" })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add FAQ
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
                      name={`items.${index}.question`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Question</FormLabel>
                          <FormControl>
                            <Input placeholder="What is your return policy?" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${index}.answer`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Answer</FormLabel>
                          <FormControl>
                            <Textarea placeholder="You can return any unused item within 30 days..." {...field} />
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
