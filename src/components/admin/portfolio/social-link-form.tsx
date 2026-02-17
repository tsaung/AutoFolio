"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ArrowLeft } from "lucide-react";
import { Database } from "@/types/database";
import { createSocialLink, updateSocialLink } from "@/lib/actions/social-links";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type SocialLink = Database["public"]["Tables"]["social_links"]["Row"];

const socialLinkSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  url: z.string().url("Must be a valid URL"),
});

type SocialLinkFormValues = z.infer<typeof socialLinkSchema>;

interface SocialLinkFormProps {
  initialData?: SocialLink;
  onSuccess?: () => void;
  isDialog?: boolean;
}

const COMMON_PLATFORMS = [
  "GitHub",
  "LinkedIn",
  "Twitter (X)",
  "Instagram",
  "YouTube",
  "Facebook",
  "Website",
  "Email",
  "Other",
];

export function SocialLinkForm({
  initialData,
  onSuccess,
  isDialog = false,
}: SocialLinkFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SocialLinkFormValues>({
    resolver: zodResolver(socialLinkSchema),
    defaultValues: {
      platform: initialData?.platform ?? "",
      url: initialData?.url ?? "",
    },
  });

  async function onSubmit(data: SocialLinkFormValues) {
    setIsSubmitting(true);
    try {
      if (initialData) {
        await updateSocialLink(initialData.id, data);
        toast.success("Social link updated successfully");
      } else {
        await createSocialLink({
          ...data,
          sort_order: 0,
        });
        toast.success("Social link created successfully");
      }

      if (onSuccess) {
        onSuccess();
        router.refresh();
      } else {
        router.push("/portfolio/social-links");
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to submit social link:", error);
      toast.error("Failed to save social link");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {!isDialog && (
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {initialData ? "Edit Social Link" : "New Social Link"}
          </h1>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {COMMON_PLATFORMS.map((platform) => (
                        <SelectItem key={platform} value={platform}>
                          {platform}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Link" : "Create Link"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
