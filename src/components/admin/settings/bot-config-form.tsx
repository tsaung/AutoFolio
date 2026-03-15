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
import { updateProfile } from "@/lib/actions/profile";
import { Database } from "@/types/database";
import {
  SearchableSelect,
  type SearchableSelectOption,
} from "@/components/searchable-select";
import type { OpenRouterModel } from "@/app/api/models/route";

const botConfigFormSchema = z.object({
  profession: z.string().min(2, {
    message: "Profession/Role must be at least 2 characters.",
  }),
  experience: z.union([z.string(), z.number()]).transform(val => Number(val) || 0).refine(val => val >= 0, {
    message: "Years of experience must be a non-negative number.",
  }),
  field: z.string().min(2, {
    message: "Field/Industry must be at least 2 characters.",
  }),
  professionalSummary: z.string().min(10, {
    message: "Professional summary must be at least 10 characters.",
  }),
  chatWelcomeMessage: z.string().max(300, {
    message: "Chat welcome message must not be longer than 300 characters.",
  }).optional(),
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
type ProfileData = Database["public"]["Tables"]["profiles"]["Row"];

interface BotConfigFormProps {
  initialData?: BotConfigData | null;
  profileData?: Partial<ProfileData> | null;
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

export function BotConfigForm({ initialData, profileData, type }: BotConfigFormProps) {
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

  const form = useForm({
    resolver: zodResolver(botConfigFormSchema),
    defaultValues: {
      profession: profileData?.profession || "",
      experience: profileData?.experience || 0,
      field: profileData?.field || "",
      professionalSummary: profileData?.professional_summary || "I'm a {profession} with over {experience} years of experience in {field}.",
      chatWelcomeMessage: profileData?.chat_welcome_message || "Hello! I am the AI assistant. How can I help you today?",
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

      // 1. Update bot_configs
      await updateBotConfig(type, {
        system_prompt: data.systemPrompt,
        model: data.model,
        provider: data.provider,
        predefined_prompts: cleanedPrompts,
      });

      // 2. Update profiles table (for persona context without running destructive migrations)
      await updateProfile({
        profession: data.profession,
        experience: Number(data.experience),
        field: data.field,
        professional_summary: data.professionalSummary,
        chat_welcome_message: data.chatWelcomeMessage,
        name: profileData?.name || "Portfolio Owner", // Keep required fields
        welcome_message: profileData?.welcome_message || "", // Keep existing if any
      });

      setSuccessMessage("Bot configuration and persona updated successfully!");
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
            Persona & Identity
          </h4>
          <FormField
            control={form.control}
            name="profession"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role / Industry Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Fullstack Web Development Agency" {...field} />
                </FormControl>
                <FormDescription>The primary role or service provided by the site.</FormDescription>
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
                  <FormLabel>Years Active / Experience</FormLabel>
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
                  <FormLabel>Field / Niche</FormLabel>
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
            name="professionalSummary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Identity / Company Summary</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Brief summary of your professional background or company mission..."
                    className="resize-none h-32"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This summary will be used by the AI to answer general questions about the site when RAG data is not sufficient.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="chatWelcomeMessage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chat Bot Welcome Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Hello! I am the AI assistant. How can I help you today?"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Displayed as the first message when a visitor opens the chat interface.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

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
