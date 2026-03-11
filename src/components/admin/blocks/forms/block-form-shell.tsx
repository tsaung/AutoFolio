"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { UseFormReturn } from "react-hook-form";
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import * as z from "zod";

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createBlock, updateBlock } from "@/lib/actions/blocks";
import { BLOCK_CONFIG } from "./block-config";

export interface BlockFormProps {
  type: string;
  initialData?: any;
  blockId?: string;
  /** Render mode: "page" = full-page layout, "inline" = compact for dialogs */
  mode?: "page" | "inline";
  /** Called when a block is successfully created in inline mode */
  onCreated?: (result: { id: string; name: string }) => void;
}

interface BlockFormShellProps {
  type: string;
  blockId?: string;
  form: UseFormReturn<any>;
  schema: z.ZodType<any>;
  children: (form: UseFormReturn<any>) => React.ReactNode;
  /** Render mode: "page" = full-page layout, "inline" = compact for dialogs */
  mode?: "page" | "inline";
  /** Called when a block is successfully created in inline mode */
  onCreated?: (result: { id: string; name: string }) => void;
}

export function BlockFormShell({
  type,
  blockId,
  form,
  schema,
  children,
  mode = "page",
  onCreated,
}: BlockFormShellProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const config = BLOCK_CONFIG[type];
  const title = config ? config.title : "Block";

  function onSubmit(data: any) {
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

        if (mode === "inline" && onCreated && result && "id" in result) {
          toast.success(`${title} created and added to page`);
          onCreated({ id: result.id as string, name: data.name || title });
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

  // ── Inline mode: compact form without page chrome ──────────────────
  if (mode === "inline") {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reference Name</FormLabel>
                <FormControl>
                  <Input placeholder={`e.g., Main ${title}`} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4 pt-2 border-t">
            {children(form)}
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={isPending} size="sm">
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Create & Add
            </Button>
          </div>
        </form>
      </Form>
    );
  }

  // ── Page mode: full-page layout with chrome ────────────────────────
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
            {blockId ? "Edit" : "Create"} {title}
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
              {children(form)}
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
