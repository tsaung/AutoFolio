"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { createDocument, updateDocument } from "@/lib/actions/knowledge";
import { Database } from "@/types/database";

type KnowledgeDocument =
  Database["public"]["Tables"]["knowledge_documents"]["Row"];

const documentFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  content: z.string().min(10, "Content must be at least 10 characters."),
});

type DocumentFormValues = z.infer<typeof documentFormSchema>;

interface DocumentFormProps {
  document?: KnowledgeDocument | null;
}

export function DocumentForm({ document }: DocumentFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isEditing = !!document;

  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      title: document?.title ?? "",
      content: document?.content ?? "",
    },
  });

  async function onSubmit(data: DocumentFormValues) {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (isEditing && document) {
        await updateDocument(document.id, data);
      } else {
        await createDocument(data);
      }
      router.push("/knowledge");
    } catch (error) {
      console.error(error);
      setErrorMessage(
        isEditing
          ? "Failed to update document. Please try again."
          : "Failed to create document. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/knowledge")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditing ? "Edit Document" : "Create Document"}
          </h1>
          <p className="text-muted-foreground">
            {isEditing
              ? "Update the content of this knowledge document."
              : "Add a new knowledge document for the AI to reference."}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Professional Bio, Project Overview, Work Experience"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A descriptive name for this knowledge fragment.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste or write the knowledge content here... You can paste your CV, project descriptions, skills, experience details — anything the AI should know about you."
                        className="min-h-[400px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The AI will use this content to answer visitor questions.
                      Plain text works best.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {errorMessage && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errorMessage}
                </p>
              )}

              <div className="flex items-center gap-3">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? isEditing
                      ? "Saving..."
                      : "Creating..."
                    : isEditing
                      ? "Save Changes"
                      : "Create Document"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/knowledge")}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
