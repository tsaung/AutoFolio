import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  Heading,
  Select,
  Stack,
  Text,
  TextArea,
  TextInput,
  ToastProvider,
  useToast,
} from "@sanity/ui";
import { useClient } from "sanity";
import {
  getAdminBotConfig,
  updateAdminBotConfig,
} from "@/lib/actions/admin-bot-config";

export function BotSettingsTool() {
  const client = useClient({ apiVersion: "2023-01-01" });
  const token = client.withConfig({}).config().token; // Get current auth token

  if (!token) {
    return (
      <Container width={1} padding={4}>
        <Card padding={4} radius={2} shadow={1}>
          <Stack space={4}>
            <Heading as="h2" size={3}>
              Bot Settings Configuration
            </Heading>
            <Text>Please wait... authenticating with Sanity Studio.</Text>
          </Stack>
        </Card>
      </Container>
    );
  }

  return (
    <ToastProvider>
      <BotSettingsForm token={token} />
    </ToastProvider>
  );
}

function BotSettingsForm({ token }: { token: string }) {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [model, setModel] = useState("google/gemini-2.0-flash-001");
  const [provider, setProvider] = useState("openrouter");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [predefinedPromptsText, setPredefinedPromptsText] = useState("");

  const loadConfig = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const config = await getAdminBotConfig(token);
      if (config) {
        setModel(config.model || "google/gemini-2.0-flash-001");
        setProvider(config.provider || "openrouter");
        setSystemPrompt(config.system_prompt || "");

        let initialPrompts = "";
        try {
          if (Array.isArray(config.predefined_prompts)) {
            initialPrompts = config.predefined_prompts
              .map((p: any) => p.text || p)
              .join("\n");
          }
        } catch (e) {
          console.error("Failed to parse predefined prompts", e);
        }
        setPredefinedPromptsText(initialPrompts);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load config.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const promptsArray = predefinedPromptsText
        .split("\n")
        .map((p: string) => p.trim())
        .filter((p: string) => p.length > 0)
        .map((text: string) => ({
          text,
          label: text.length > 30 ? text.substring(0, 30) + "..." : text,
        }));

      await updateAdminBotConfig(token, {
        model,
        provider,
        system_prompt: systemPrompt,
        predefined_prompts: promptsArray as any, // casting to bypass complex jsonb types for now
      });

      toast.push({
        status: "success",
        title: "Saved successfully",
        description: "Bot settings have been updated.",
      });
    } catch (err: any) {
      setError(err.message || "Failed to save configuration.");
      toast.push({
        status: "error",
        title: "Failed to save",
        description: err.message || "An unknown error occurred.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container width={1} padding={4}>
        <Text>Loading configuration...</Text>
      </Container>
    );
  }

  return (
    <Container width={1} padding={4}>
      <Card padding={4} radius={2} shadow={1}>
        <Stack space={5}>
          <Heading as="h2" size={3}>
            Public Bot Settings
          </Heading>

          {error && (
            <Card padding={3} tone="critical" radius={2}>
              <Text>{error}</Text>
            </Card>
          )}

          <Stack space={3}>
            <Heading as="h3" size={1}>
              AI Provider
            </Heading>
            <Select
              value={provider}
              onChange={(e: any) => setProvider(e.target.value)}
            >
              <option value="openrouter">OpenRouter (Multiple Models)</option>
              <option value="google">Google AI Studio</option>
            </Select>
          </Stack>

          <Stack space={3}>
            <Heading as="h3" size={1}>
              Model Name
            </Heading>
            <TextInput
              value={model}
              onChange={(e: any) => setModel(e.target.value)}
              placeholder="e.g. google/gemini-2.0-flash-001"
            />
          </Stack>

          <Stack space={3}>
            <Heading as="h3" size={1}>
              System Prompt / Identity
            </Heading>
            <TextArea
              value={systemPrompt}
              onChange={(e: any) => setSystemPrompt(e.target.value)}
              rows={8}
              placeholder="You are an AI assistant for..."
            />
          </Stack>

          <Stack space={3}>
            <Heading as="h3" size={1}>
              Suggested Prompts
            </Heading>
            <Text size={1} muted>
              Enter one prompt per line. These appear as clickable suggestions.
            </Text>
            <TextArea
              value={predefinedPromptsText}
              onChange={(e: any) => setPredefinedPromptsText(e.target.value)}
              rows={5}
              placeholder="What services do you offer?\nTell me about your experience."
            />
          </Stack>

          <Box paddingTop={2}>
            <Flex justify="flex-end" gap={3}>
              <Button
                text="Reload"
                mode="ghost"
                onClick={loadConfig}
                disabled={saving}
              />
              <Button
                text="Save Settings"
                tone="primary"
                onClick={handleSave}
                disabled={saving || loading}
                loading={saving}
              />
            </Flex>
          </Box>
        </Stack>
      </Card>
    </Container>
  );
}
