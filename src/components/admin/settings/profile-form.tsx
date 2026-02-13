"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";

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
import { updateProfile } from "@/lib/actions/profile";
import { Database } from "@/types/database";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  profession: z.string().min(2, {
    message: "Profession must be at least 2 characters.",
  }),
  experience: z.coerce.number().min(0, {
    message: "Years of experience must be a non-negative number.",
  }),
  field: z.string().min(2, {
    message: "Field/Industry must be at least 2 characters.",
  }),
  welcomeMessage: z.string().max(300, {
    message: "Welcome message must not be longer than 300 characters.",
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type ProfileData = Database["public"]["Tables"]["profiles"]["Row"] & {
  email?: string;
};

interface ProfileFormProps {
  initialData?: ProfileData;
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const defaultValues = {
    name: initialData?.name || "",
    email: initialData?.email || "",
    profession: initialData?.profession || "",
    experience: initialData?.experience || 0,
    field: initialData?.field || "",
    welcomeMessage:
      initialData?.welcome_message ||
      "I'm {name}, a {profession} with over {experience} years of experience in {field}. This is my personal AI assistant—feel free to ask it anything about my work or background.",
  };

  const form = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  async function onSubmit(data: ProfileFormValues) {
    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await updateProfile({
        name: data.name,
        profession: data.profession,
        experience: data.experience,
        field: data.field,
        welcome_message: data.welcomeMessage,
      });
      setSuccessMessage("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your Name" {...field} />
              </FormControl>
              <FormDescription>
                This is the name that will be displayed in the portfolio and
                used by the bot.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input disabled value={defaultValues.email} />
          </FormControl>
          <FormDescription>
            Your email address is managed by your authentication provider.
          </FormDescription>
        </FormItem>
        <FormField
          control={form.control}
          name="profession"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profession / Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Fullstack Developer" {...field} />
              </FormControl>
              <FormDescription>Your professional title.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Years of Experience</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g. 5"
                    {...field}
                    value={field.value as number}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="field"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Field / Industry</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Software Engineering" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="welcomeMessage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Welcome Message Template</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Hi, I'm {name}..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                You can use placeholders like {"{name}"}, {"{profession}"},
                {"{experience}"}, and {"{field}"}.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {successMessage && (
          <p className="text-sm text-green-600 dark:text-green-400">
            {successMessage}
          </p>
        )}
        {errorMessage && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {errorMessage}
          </p>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Profile"}
        </Button>
      </form>
    </Form>
  );
}
