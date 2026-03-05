"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateSiteSettings } from "@/lib/actions/site-settings";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const siteSettingsSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  brandColors: z.object({
    primary: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex form"),
    secondary: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex form"),
    accent: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex form"),
  }).optional(),
});

type SiteSettingsFormValues = z.infer<typeof siteSettingsSchema>;

export function SiteSettingsForm({ initialData }: { initialData: any }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  // Parse default brand colors or set fallback
  const defaultColors = initialData?.brandColors || {
    primary: "#000000",
    secondary: "#666666",
    accent: "#0000ff",
  };

  const form = useForm<SiteSettingsFormValues>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      siteName: initialData?.siteName || "",
      brandColors: defaultColors,
    },
  });

  async function onSubmit(data: SiteSettingsFormValues) {
    setIsPending(true);
    try {
      const result = await updateSiteSettings(data);
      if (result.success) {
        toast.success("Site settings updated successfully.");
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to update site settings.");
      console.error(error);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="siteName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Site Name</FormLabel>
              <FormControl>
                <Input placeholder="My Portfolio" {...field} />
              </FormControl>
              <FormDescription>
                This acts as the default title for the site, and appears in the header.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <h4 className="text-sm font-medium">Brand Colors</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <FormField
              control={form.control}
              name="brandColors.primary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Color (Hex)</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input type="color" className="w-12 h-10 p-1" {...field} />
                      <Input placeholder="#000000" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="brandColors.secondary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secondary Color (Hex)</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input type="color" className="w-12 h-10 p-1" {...field} />
                      <Input placeholder="#666666" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="brandColors.accent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Accent Color (Hex)</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input type="color" className="w-12 h-10 p-1" {...field} />
                      <Input placeholder="#0000ff" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Note: In a full implementation we would add Array Builders for Navigation/Footer here */}

        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </Form>
  );
}
