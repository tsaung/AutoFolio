"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ArrowLeft, CalendarIcon } from "lucide-react";
import { createExperience, updateExperience } from "@/lib/actions/sanity-experiences";
import { SanityExperience } from "@/types/sanity-types";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";
import type { PortableTextBlock } from "next-sanity";
import { toPlainText } from "@portabletext/react";

const experienceSchema = z
  .object({
    title: z.string().min(1, "Position is required"),
    company: z.string().min(1, "Company is required"),
    location: z.string().optional(),
    description: z.string().optional(),
    startDate: z.date(),
    endDate: z.date().optional().nullable(),
    isCurrent: z.boolean().default(false).optional(),
  })
  .refine(
    (data) => {
      if (data.isCurrent) return true;
      if (!data.endDate) return false;
      return data.endDate >= data.startDate;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    },
  );

type ExperienceFormValues = z.infer<typeof experienceSchema>;

interface ExperienceFormProps {
  initialData?: SanityExperience;
}

// Very basic plain text to Sanity Block converter for the textarea
function textToBlocks(text: string | null | undefined): PortableTextBlock[] | undefined {
  if (!text) return undefined;
  // Splits by double newline as basic paragraph mapping
  return text.split('\n\n').map(paragraph => ({
    _type: 'block',
    children: [
      {
        _type: 'span',
        text: paragraph,
      }
    ]
  })) as PortableTextBlock[];
}

// Convert PortableText back to plain text for the textarea
function blocksToText(blocks: PortableTextBlock[] | undefined | null): string {
  if (!blocks || !Array.isArray(blocks)) return "";
  return blocks.map(b => b.children?.map((c: any) => c.text).join("")).join("\n\n");
}

export function ExperienceForm({ initialData }: ExperienceFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      company: initialData?.company ?? "",
      location: initialData?.location ?? "",
      description: blocksToText(initialData?.description),
      startDate: initialData?.startDate
        ? new Date(initialData.startDate)
        : undefined,
      endDate: initialData?.endDate
        ? new Date(initialData.endDate)
        : undefined,
      isCurrent: !initialData?.endDate, 
    },
  });

  async function onSubmit(data: ExperienceFormValues) {
    setIsSubmitting(true);
    try {
      const formattedData = {
        title: data.title,
        company: data.company,
        location: data.location || undefined,
        description: textToBlocks(data.description),
        startDate: format(data.startDate, "yyyy-MM-dd"),
        endDate:
          data.isCurrent || !data.endDate
            ? undefined
            : format(data.endDate, "yyyy-MM-dd"),
      };

      if (initialData) {
        await updateExperience(initialData._id, formattedData);
        toast.success("Experience updated successfully");
      } else {
        await createExperience({
          ...formattedData,
          sortOrder: 0,
        });
        toast.success("Experience created successfully");
      }
      router.push("/experiences");
      router.refresh();
    } catch (error) {
      console.error("Failed to submit experience:", error);
      toast.error("Failed to save experience");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Watch isCurrent to disable endDate
  const isCurrent = form.watch("isCurrent");

  return (
    <div className="flex flex-col gap-6">
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
          {initialData ? "Edit Experience" : "New Experience"}
        </h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position / Role</FormLabel>
                  <FormControl>
                    <Input placeholder="Senior Frontend Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder="Company Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="San Francisco, CA (Remote)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-6 md:grid-cols-2 md:col-span-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          captionLayout="dropdown"
                          fromYear={1960}
                          toYear={new Date().getFullYear()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value &&
                                !isCurrent &&
                                "text-muted-foreground",
                            )}
                            disabled={isCurrent}
                          >
                            {isCurrent ? (
                              <span>Present</span>
                            ) : field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          captionLayout="dropdown"
                          fromYear={1960}
                          toYear={new Date().getFullYear()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isCurrent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2 space-y-0 md:col-span-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">
                    I currently work here
                  </FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your responsibilities and achievements..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Markdown is supported.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Experience" : "Create Experience"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
