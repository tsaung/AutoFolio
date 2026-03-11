"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { BlockFormShell, type BlockFormProps } from "./block-form-shell";

export const embedBlockSchema = z.object({
  name: z.string().min(1, "Name is required"),
  embedType: z.enum(["youtube", "vimeo", "custom"]),
  url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  code: z.string().optional(),
}).refine(data => {
  if (data.embedType === "custom") {
    return !!data.code;
  } else {
    return !!data.url;
  }
}, {
  message: "Either URL or Custom Code is required based on the Embed Type",
  path: ["url"], // attach error to url field generally, form handles display
});

export function EmbedBlockForm({ initialData, blockId }: BlockFormProps) {
  const form = useForm<z.infer<typeof embedBlockSchema>>({
    resolver: zodResolver(embedBlockSchema),
    defaultValues: initialData || {
      name: "",
      embedType: "youtube",
      url: "",
      code: "",
    },
  });

  const embedType = form.watch("embedType");

  return (
    <BlockFormShell type="embedBlock" blockId={blockId} form={form} schema={embedBlockSchema}>
      {(form) => (
        <>
          <FormField
            control={form.control}
            name="embedType"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Embed Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="youtube" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        YouTube URL
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="vimeo" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Vimeo URL
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="custom" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Custom HTML / Iframe
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {embedType !== "custom" && (
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.youtube.com/watch?v=..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Paste the full URL to the {embedType === "youtube" ? "YouTube" : "Vimeo"} video.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {embedType === "custom" && (
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom Code</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="<iframe src='...' ></iframe>"
                      className="min-h-[150px] font-mono"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Paste raw HTML or iframe code here.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </>
      )}
    </BlockFormShell>
  );
}
