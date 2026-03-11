"use client";

import { useTransition } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SanityImageUpload } from "@/components/admin/sanity-image-upload";
import { createBlock, updateBlock } from "@/lib/actions/blocks";
import { type SanityHeroBlock, type SanityCtaBlock } from "@/types/sanity-types";

// Schema for CTA Block
const ctaSchema = z.object({
  name: z.string().min(1, "Name is required"),
  heading: z.string().min(1, "Heading is required"),
  text: z.string().optional(),
  button: z.object({
    label: z.string().min(1, "Button label is required"),
    url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  }).optional(),
});

// Schema for Hero Block
const heroSchema = z.object({
  name: z.string().min(1, "Name is required"),
  headline: z.string().min(1, "Headline is required"),
  subheadline: z.string().optional(),
  backgroundImage: z.any().optional(),
  buttons: z.array(z.object({
    label: z.string().min(1, "Label is required"),
    url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    style: z.enum(["primary", "secondary", "outline"]),
  })).max(3, "Maximum 3 buttons allowed"),
});

export function BlockForm({
  type,
  initialData,
  blockId,
}: {
  type: "heroBlock" | "ctaBlock";
  initialData?: any;
  blockId?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isHero = type === "heroBlock";
  const schema = isHero ? heroSchema : ctaSchema;

  const defaultValues = initialData || (isHero ? {
    name: "",
    headline: "",
    subheadline: "",
    buttons: [],
    backgroundImage: null,
  } : {
    name: "",
    heading: "",
    text: "",
    button: { label: "", url: "" },
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema as any),
    defaultValues: defaultValues as any,
  });

  // Specifically for Hero buttons array
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "buttons" as any,
  });

  function onSubmit(data: z.infer<typeof schema>) {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        formData.append("type", type);
        if (blockId) formData.append("id", blockId);

        const result = blockId
          ? await updateBlock(formData)
          : await createBlock(formData);

        if (result?.error) {
          toast.error(result.error);
          return;
        }

        toast.success(`Block ${blockId ? "updated" : "created"} successfully`);
        router.push("/admin/blocks");
        router.refresh();
      } catch (error) {
        toast.error("An unexpected error occurred");
      }
    });
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 max-w-4xl mx-auto">
      <div className="flex items-center space-x-4 mb-8">
        <Link href="/admin/blocks">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {blockId ? "Edit" : "Create"} {isHero ? "Hero Block" : "CTA Block"}
          </h2>
          <p className="text-muted-foreground">
            {blockId ? "Update your existing global block." : "Configure the settings for your new block."}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Internal Details</CardTitle>
              <CardDescription>Only visible in the admin dashboard to help you organize your blocks.</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Main Home Hero" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
              <CardDescription>The actual content that will be displayed on the website.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isHero ? (
                <>
                  <FormField
                    control={form.control}
                    name="headline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Headline</FormLabel>
                        <FormControl>
                          <Input placeholder="Build your amazing portfolio..." {...field} />
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
                          <Textarea placeholder="A brief description supporting the headline." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="backgroundImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Background Image (Optional)</FormLabel>
                        <FormControl>
                          <SanityImageUpload
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-sm">Buttons</h4>
                        <p className="text-xs text-muted-foreground">Add up to 3 call-to-action buttons.</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append({ label: "", url: "", style: "primary" })}
                        disabled={fields.length >= 3}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Button
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
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-8">
                            <FormField
                              control={form.control}
                              name={`buttons.${index}.label`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs">Label</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Click me" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`buttons.${index}.url`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs">URL</FormLabel>
                                  <FormControl>
                                    <Input placeholder="https://" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`buttons.${index}.style`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs">Style</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select style" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="primary">Primary</SelectItem>
                                      <SelectItem value="secondary">Secondary</SelectItem>
                                      <SelectItem value="outline">Outline</SelectItem>
                                    </SelectContent>
                                  </Select>
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
              ) : (
                <>
                  <FormField
                    control={form.control}
                    name="heading"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Heading</FormLabel>
                        <FormControl>
                          <Input placeholder="Ready to get started?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supporting Text</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Join thousands of happy users." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4 pt-4 border-t">
                    <h4 className="font-medium text-sm">Button Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="button.label"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Label</FormLabel>
                            <FormControl>
                              <Input placeholder="Sign Up Now" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="button.url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Link href="/admin/blocks">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {blockId ? "Save Changes" : "Create Block"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
