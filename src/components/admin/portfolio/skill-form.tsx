"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ArrowLeft } from "lucide-react";
import { Database } from "@/types/database";
import { createSkill, updateSkill } from "@/lib/actions/skills";
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
import { SearchableSelect } from "@/components/searchable-select";
import { TECH_OPTIONS } from "@/components/portfolio/tech-icons";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

type Skill = Database["public"]["Tables"]["skills"]["Row"];

const skillSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  proficiency: z.number().min(1).max(5),
});

type SkillFormValues = z.infer<typeof skillSchema>;

interface SkillFormProps {
  initialData?: Skill;
  onSuccess?: () => void;
  isDialog?: boolean;
}

const CATEGORIES = [
  "Frontend",
  "Backend",
  "Database",
  "DevOps",
  "Tools",
  "Design",
  "Other",
];

export function SkillForm({
  initialData,
  onSuccess,
  isDialog = false,
}: SkillFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      category: initialData?.category ?? "",
      proficiency: initialData?.proficiency ?? 3,
    },
  });

  async function onSubmit(data: SkillFormValues) {
    setIsSubmitting(true);
    try {
      if (initialData) {
        await updateSkill(initialData.id, data);
        toast.success("Skill updated successfully");
      } else {
        await createSkill({
          ...data,
          sort_order: 0,
        });
        toast.success("Skill created successfully");
      }

      if (onSuccess) {
        onSuccess();
        router.refresh();
      } else {
        router.push("/skills");
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to submit skill:", error);
      toast.error("Failed to save skill");
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
            {initialData ? "Edit Skill" : "New Skill"}
          </h1>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skill Name</FormLabel>
                  <FormControl>
                    <SearchableSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      options={TECH_OPTIONS}
                      placeholder="Select a tech skill"
                      searchPlaceholder="Search skills..."
                      emptyMessage="No skill found."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
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
              name="proficiency"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <div className="flex items-center justify-between">
                    <FormLabel>Proficiency (Level {field.value})</FormLabel>
                  </div>
                  <FormControl>
                    <Slider
                      min={1}
                      max={5}
                      step={1}
                      defaultValue={[field.value]}
                      onValueChange={(vals) => field.onChange(vals[0])}
                    />
                  </FormControl>
                  <FormDescription>
                    Estimate your skill level from 1 to 5.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Skill" : "Create Skill"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
