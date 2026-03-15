"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateSiteSettings } from "@/lib/actions/site-settings";
import { Plus, Trash, Check } from "lucide-react";
import { THEMES } from "@/lib/themes";
import { SanityImageUpload } from "@/components/admin/sanity-image-upload";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const siteSettingsSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  logo: z.any().optional(),
  brandColors: z.object({
    themePreset: z.string().optional(),
    primary: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex form").optional().or(z.literal("")),
    secondary: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex form").optional().or(z.literal("")),
    accent: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex form").optional().or(z.literal("")),
  }).optional(),
  mainNavigation: z.string().optional(),
  footerNavigation: z.string().optional(),
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

const PREDEFINED_PLATFORMS = [
  "GitHub",
  "LinkedIn",
  "Twitter",
  "X",
  "Email",
  "Website",
];

export function SiteSettingsForm({ initialData, availableNavigations = [] }: { initialData: any, availableNavigations?: any[] }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  // Parse default brand colors or set fallback
  const defaultColors = initialData?.brandColors || {
    themePreset: "zinc",
    primary: "#000000",
    secondary: "#666666",
    accent: "#0000ff",
  };
  if (initialData?.brandColors && !initialData.brandColors.themePreset) {
    defaultColors.themePreset = "custom";
  }

  const form = useForm<SiteSettingsFormValues>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      siteName: initialData?.siteName || "",
      logo: initialData?.logo || undefined,
      brandColors: defaultColors,
      mainNavigation: initialData?.mainNavigation?._ref || "",
      footerNavigation: initialData?.footerNavigation?._ref || "",
      footer: initialData?.footer || { copyrightText: "", socialLinks: [] },
    },
  });

  const { fields: socialFields, append: appendSocial, remove: removeSocial } = useFieldArray({
    control: form.control,
    name: "footer.socialLinks"
  });

  const [isSocialDialogOpen, setIsSocialDialogOpen] = useState(false);
  const [newSocialPlatform, setNewSocialPlatform] = useState("");
  const [newSocialUrl, setNewSocialUrl] = useState("");

  const handleAddSocial = () => {
    if (!newSocialPlatform || !newSocialUrl) {
      toast.error("Please provide both a platform and a URL.");
      return;
    }
    try {
      if (newSocialPlatform !== "Email" && !newSocialUrl.startsWith("mailto:")) {
        new URL(newSocialUrl);
      }
    } catch {
      toast.error("Please provide a valid URL.");
      return;
    }

    appendSocial({ platform: newSocialPlatform, url: newSocialUrl, icon: "" });
    setNewSocialPlatform("");
    setNewSocialUrl("");
    setIsSocialDialogOpen(false);
  };

  const themePreset = form.watch("brandColors.themePreset");

  async function onSubmit(data: SiteSettingsFormValues) {
    setIsPending(true);
    try {
      // Map mainNavigation and footerNavigation string values to Sanity reference objects
      const submitData = {
        ...data,
        mainNavigation: data.mainNavigation
          ? { _type: "reference", _ref: data.mainNavigation }
          : undefined,
        footerNavigation: data.footerNavigation
          ? { _type: "reference", _ref: data.footerNavigation }
          : undefined,
      };
      const result = await updateSiteSettings(submitData);
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Site Logo</FormLabel>
                <FormControl>
                  <SanityImageUpload
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  Upload a logo to display in the header and navigation.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium">Brand Colors</h4>
          <FormField
            control={form.control}
            name="brandColors.themePreset"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Theme Preset</FormLabel>
                <FormControl>
                  <div className="flex flex-wrap gap-2">
                    {THEMES.map((theme) => (
                      <div
                        key={theme.name}
                        onClick={() => field.onChange(theme.name)}
                        className={`flex flex-col items-center gap-2 cursor-pointer p-2 rounded-md transition-all ${
                          field.value === theme.name
                            ? "ring-2 ring-primary bg-accent/50"
                            : "hover:bg-accent/50"
                        }`}
                      >
                        <div
                          className="w-10 h-10 rounded-full border shadow-sm flex items-center justify-center"
                          style={{ backgroundColor: theme.light.activeColor }}
                        >
                          {field.value === theme.name && <Check className="w-5 h-5 text-white mix-blend-difference" />}
                        </div>
                        <span className="text-xs font-medium">{theme.label}</span>
                      </div>
                    ))}
                    <div
                      onClick={() => field.onChange("custom")}
                      className={`flex flex-col items-center gap-2 cursor-pointer p-2 rounded-md transition-all ${
                        field.value === "custom"
                          ? "ring-2 ring-primary bg-accent/50"
                          : "hover:bg-accent/50"
                      }`}
                    >
                      <div className="w-10 h-10 border shadow-sm rounded-full flex items-center justify-center bg-gradient-to-br from-red-500 via-green-500 to-blue-500">
                        {field.value === "custom" && <Check className="w-5 h-5 text-white" />}
                      </div>
                      <span className="text-xs font-medium">Custom</span>
                    </div>
                  </div>
                </FormControl>
                <FormDescription>
                  Select a predefined Shadcn theme, or choose Custom to manually set hexadecimal colors.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {themePreset === "custom" && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="brandColors.primary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Color (Hex)</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input type="color" className="w-12 h-10 p-1" {...field} value={field.value || ""} />
                        <Input placeholder="#000000" {...field} value={field.value || ""} />
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
                        <Input type="color" className="w-12 h-10 p-1" {...field} value={field.value || ""} />
                        <Input placeholder="#666666" {...field} value={field.value || ""} />
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
                        <Input type="color" className="w-12 h-10 p-1" {...field} value={field.value || ""} />
                        <Input placeholder="#0000ff" {...field} value={field.value || ""} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium">Navigation Menus</h4>
          <p className="text-sm text-muted-foreground">
            Select the navigation menus to use for the header and footer.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="mainNavigation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Main Navigation</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select main menu" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableNavigations.map((nav) => (
                        <SelectItem key={nav._id} value={nav._id}>
                          {nav.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    This menu appears in the site header.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="footerNavigation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Footer Navigation</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select footer menu" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableNavigations.map((nav) => (
                        <SelectItem key={nav._id} value={nav._id}>
                          {nav.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    This menu appears in the site footer.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <div className="flex items-center justify-between">
              <h5 className="text-sm font-medium">Social Links</h5>
              <Dialog open={isSocialDialogOpen} onOpenChange={setIsSocialDialogOpen}>
                <DialogTrigger asChild>
                  <Button type="button" variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" /> Add Social Link
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Social Link</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Platform</label>
                      <Select value={newSocialPlatform} onValueChange={setNewSocialPlatform}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent>
                          {PREDEFINED_PLATFORMS.map((platform) => (
                            <SelectItem key={platform} value={platform}>
                              {platform}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">URL</label>
                      <Input
                        placeholder="https://"
                        value={newSocialUrl}
                        onChange={(e) => setNewSocialUrl(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsSocialDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddSocial}>Add Link</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {socialFields.length > 0 ? (
              <div className="grid gap-3">
                {socialFields.map((field, index) => {
                  const currentPlatform = form.watch(`footer.socialLinks.${index}.platform`);
                  const currentUrl = form.watch(`footer.socialLinks.${index}.url`);
                  return (
                    <div
                      key={field.id}
                      className="flex items-center justify-between p-3 border rounded-md bg-card"
                    >
                      <div className="flex flex-col overflow-hidden">
                        <span className="font-medium text-sm">{currentPlatform}</span>
                        <span className="text-xs text-muted-foreground truncate max-w-[250px] sm:max-w-md">
                          {currentUrl}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                        onClick={() => removeSocial(index)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No social links added yet.</p>
            )}
          </div>
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </Form>
  );
}
