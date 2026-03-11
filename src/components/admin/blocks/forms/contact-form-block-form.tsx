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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

import { BlockFormShell, type BlockFormProps } from "./block-form-shell";

export const contactFormBlockSchema = z.object({
  name: z.string().min(1, "Name is required"),
  headline: z.string().min(1, "Headline is required"),
  subheadline: z.string().optional(),
  submitLabel: z.string().min(1, "Submit label is required"),
  showPhone: z.boolean(),
  showCompany: z.boolean(),
});

export function ContactFormBlockForm({ initialData, blockId }: BlockFormProps) {
  const form = useForm<z.infer<typeof contactFormBlockSchema>>({
    resolver: zodResolver(contactFormBlockSchema),
    defaultValues: initialData || {
      name: "",
      headline: "",
      subheadline: "",
      submitLabel: "Send Message",
      showPhone: false,
      showCompany: false,
    },
  });

  return (
    <BlockFormShell type="contactFormBlock" blockId={blockId} form={form} schema={contactFormBlockSchema}>
      {(form) => (
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="headline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Headline</FormLabel>
                <FormControl>
                  <Input placeholder="Get in touch" {...field} />
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
                  <Textarea placeholder="Fill out the form below." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="submitLabel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Submit Button Label</FormLabel>
                <FormControl>
                  <Input placeholder="Send Message" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-medium">Form Fields Toggle</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="showPhone"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Phone Number</FormLabel>
                      <FormDescription>
                        Include a field for users to provide their phone number.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="showCompany"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Company</FormLabel>
                      <FormDescription>
                        Include a field for users to provide their company name.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <p className="text-sm text-muted-foreground italic">
              Name, Email, and Message fields are always included by default.
            </p>
          </div>
        </div>
      )}
    </BlockFormShell>
  );
}
