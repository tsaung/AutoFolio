"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";

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
import { updateBotConfig } from "@/lib/actions/bot-config";
import { Database } from "@/types/database";
import {
  SearchableSelect,
  type SearchableSelectOption,
} from "@/components/searchable-select";
import type { OpenRouterModel } from "@/app/api/models/route";

const botConfigFormSchema = z.object({
  systemPrompt: z.string().min(10, {
    message: "System prompt must be at least 10 characters.",
  }),
  model: z.string().min(1, {
    message: "Please select a model.",
  }),
  provider: z.string().min(1, {
    message: "Please select a provider.",
  }),
  predefinedPrompts: z.array(z.string()).max(4, {
    message: "You can only have up to 4 predefined prompts.",
  }),
});

type BotConfigFormValues = z.infer<typeof botConfigFormSchema>;
type BotConfigData = Database["public"]["Tables"]["bot_configs"]["Row"];

interface BotConfigFormProps {
  initialData?: BotConfigData | null;
  type: "public_agent" | "admin_agent";
}

// Fallback models shown while loading or if fetch fails
const FALLBACK_MODELS: OpenRouterModel[] = [
  {
    id: "google/gemini-2.0-flash-001",
    name: "Gemini 2.0 Flash",
    context_length: 1048576,
    pricing: { prompt: "0", completion: "0" },
  },
  {
    id: "openai/gpt-4o-mini",
    name: "GPT-4o Mini",
    context_length: 128000,
    pricing: { prompt: "0.00000015", completion: "0.0000006" },
  },
  {
    id: "anthropic/claude-3-haiku",
    name: "Claude 3 Haiku",
    context_length: 200000,
    pricing: { prompt: "0.00000025", completion: "0.00000125" },
  },
];

function formatContextLength(length: number): string {
  if (length >= 1_000_000) return `${(length / 1_000_000).toFixed(0)}M`;
  if (length >= 1_000) return `${(length / 1_000).toFixed(0)}K`;
  return `${length}`;
}

export function BotConfigForm({ initialData, type }: BotConfigFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [models, setModels] = useState<OpenRouterModel[]>(FALLBACK_MODELS);
  const [modelsLoading, setModelsLoading] = useState(true);

  // Fetch available models from OpenRouter
  useEffect(() => {
    async function fetchModels() {
      try {
        const res = await fetch("/api/models");
        if (!res.ok) throw new Error("Failed to fetch models");
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          setModels(json.data);
        }
      } catch (err) {
        console.warn("Using fallback models:", err);
        // Keep fallback models
      } finally {
        setModelsLoading(false);
      }
    }
    fetchModels();
  }, []);

  // Map models to SearchableSelect options
  const modelOptions: SearchableSelectOption[] = models.map((m) => ({
    value: m.id,
    label: m.name,
    description: `${m.id} · ${formatContextLength(m.context_length)} ctx`,
  }));

  const defaultPrompts = (initialData?.predefined_prompts as string[]) || [
    "",
    "",
    "",
    "",
  ];

  const form = useForm<BotConfigFormValues>({
    resolver: zodResolver(botConfigFormSchema),
    defaultValues: {
      systemPrompt: initialData?.system_prompt || "",
      model: initialData?.model || "google/gemini-2.0-flash-001",
      provider: initialData?.provider || "openrouter",
      predefinedPrompts: defaultPrompts,
    },
  });

  async function onSubmit(data: BotConfigFormValues) {
    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      // Filter out empty prompts
      const cleanedPrompts = data.predefinedPrompts.filter(
        (p) => p.trim() !== "",
      );

      await updateBotConfig(type, {
        system_prompt: data.systemPrompt,
        model: data.model,
        provider: data.provider,
        predefined_prompts: cleanedPrompts,
      });
      setSuccessMessage("Bot configuration updated successfully!");
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to update configuration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Model Settings
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider</FormLabel>
                  <Input value="OpenRouter" disabled className="bg-muted" />
                  <input type="hidden" {...field} />
                  <FormDescription>
                    Currently only OpenRouter is supported.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Model</FormLabel>
                  <FormControl>
                    <SearchableSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      options={modelOptions}
                      placeholder="Select a model"
                      searchPlaceholder="Search models..."
                      emptyMessage="No models found."
                      loading={modelsLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Persona
          </h4>
          <FormField
            control={form.control}
            name="systemPrompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>System Prompt</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="You are a helpful portfolio assistant..."
                    className="min-h-[200px] font-mono text-sm"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This serves as the &quot;brain&quot; of your bot. You can use
                  placeholders like {"{name}"}, {"{profession}"},{" "}
                  {"{experience}"}, and {"{field}"} which will be replaced by
                  your profile data.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Predefined Prompts
          </h4>
          <FormDescription>
            Configure the quick reply options that visitors see when they first
            open the chat. Leave empty to remove a prompt.
          </FormDescription>
          {[0, 1, 2, 3].map((index) => (
            <FormField
              key={index}
              control={form.control}
              name={`predefinedPrompts.${index}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Prompt {index + 1}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={`Suggestion ${index + 1} (e.g. Tell me about your experience)`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

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
          {isSubmitting ? "Saving..." : "Save Configuration"}
        </Button>
      </form>
    </Form>
  );
}
