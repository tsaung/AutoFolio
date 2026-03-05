"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateSiteSettings } from "@/lib/actions/site-settings";
import { Plus, Trash } from "lucide-react";

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
  navigation: z.array(z.object({
    label: z.string().min(1, "Label is required"),
    link: z.array(z.any()).optional() // Using any for complex referenced object, real production would validate strictly or use an ID
  })).optional(),
  footer: z.object({
    copyrightText: z.string().optional(),
    socialLinks: z.array(z.object({
      platform: z.string().min(1, "Platform name is required"),
      url: z.string().url("Must be a valid URL"),
      icon: z.string().optional()
    })).optional()
  }).optional()
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
      navigation: initialData?.navigation || [],
      footer: initialData?.footer || { copyrightText: "", socialLinks: [] },
    },
  });

  const { fields: navFields, append: appendNav, remove: removeNav } = useFieldArray({
    control: form.control,
    name: "navigation"
  });

  const { fields: socialFields, append: appendSocial, remove: removeSocial } = useFieldArray({
    control: form.control,
    name: "footer.socialLinks"
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

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-medium">Navigation Links</h4>
              <p className="text-sm text-muted-foreground">Manage the main menu navigational links.</p>
            </div>
          </div>
          <div className="space-y-4">
            {navFields.map((field, index) => (
              <div key={field.id} className="flex gap-4 items-end">
                <FormField
                  control={form.control}
                  name={`navigation.${index}.label`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className={index !== 0 ? "sr-only" : ""}>Label</FormLabel>
                      <FormControl>
                        <Input placeholder="Home" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="icon" 
                  onClick={() => removeNav(index)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => appendNav({ label: "", link: [] })}
            >
              <Plus className="w-4 h-4 mr-2" /> Add Navigation Link
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium">Footer Code</h4>
          <FormField
            control={form.control}
            name="footer.copyrightText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Copyright Text</FormLabel>
                <FormControl>
                  <Input placeholder="© 2026 Your Name. All rights reserved." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4 pt-4">
            <h5 className="text-sm font-medium">Social Links</h5>
            {socialFields.map((field, index) => (
              <div key={field.id} className="flex gap-4 items-end">
                <FormField
                  control={form.control}
                  name={`footer.socialLinks.${index}.platform`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className={index !== 0 ? "sr-only" : ""}>Platform</FormLabel>
                      <FormControl>
                        <Input placeholder="GitHub" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`footer.socialLinks.${index}.url`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className={index !== 0 ? "sr-only" : ""}>URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://github.com/yourusername" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`footer.socialLinks.${index}.icon`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className={index !== 0 ? "sr-only" : ""}>Icon (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="github" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="icon" 
                  onClick={() => removeSocial(index)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => appendSocial({ platform: "", url: "", icon: "" })}
            >
              <Plus className="w-4 h-4 mr-2" /> Add Social Link
            </Button>
          </div>
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </Form>
  );
}
