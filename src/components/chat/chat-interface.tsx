"use client";

import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect, useRef, useState } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";

import { ProfileHero } from "@/components/visitor/profile-hero";
import { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface ChatInterfaceProps {
  profile?: Profile | null;
  botConfig?: Database["public"]["Tables"]["bot_configs"]["Row"] | null;
}

export function ChatInterface({ profile, botConfig }: ChatInterfaceProps) {
  const { messages, status, sendMessage } = useChat();
  // Manual state management for input
  const [input, setInput] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handlePromptClick = async (prompt: string) => {
    await sendMessage({ text: prompt });
  };

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const value = input;
    setInput("");
    await sendMessage({ text: value });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const prompts = (botConfig?.predefined_prompts as string[]) || [
    "Tell me about your experience",
    "What are your skills?",
    "Show me your projects",
    "Contact info",
  ];

  return (
    <div className="flex flex-col h-[100dvh] max-w-4xl mx-auto border-x bg-background overflow-hidden">
      <header className="p-4 border-b bg-card flex items-center justify-between shrink-0 z-10 relative">
        <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 md:left-auto">
          {profile ? (
            <div className="flex flex-col justify-center h-full">
              <h1 className="text-lg font-bold tracking-tight">
                {profile.name}
              </h1>
            </div>
          ) : (
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              BotFolio
            </h1>
          )}
        </div>
        <div className="ml-auto">
          <ModeToggle />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 min-h-0 flex flex-col">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
            <ProfileHero profile={profile || null} />

            {profile && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4 w-full max-w-lg">
                {prompts.map((prompt) => (
                  <button
                    key={prompt}
                    className="p-3 text-sm border rounded-lg hover:bg-muted/50 transition-colors text-left"
                    onClick={() => handlePromptClick(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          messages.map((m: any) => (
            <div
              key={m.id}
              className={cn(
                "flex gap-3 max-w-[80%]",
                m.role === "user" ? "ml-auto flex-row-reverse" : "",
              )}
            >
              <Avatar className="w-8 h-8 mt-1 shrink-0">
                {m.role === "user" ? (
                  <>
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </>
                ) : (
                  <>
                    <AvatarImage src="/bot-avatar.png" />
                    <AvatarFallback className="bg-muted">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </>
                )}
              </Avatar>
              <div
                className={cn(
                  "rounded-lg px-3 py-2 text-sm",
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground",
                )}
              >
                <div className="prose dark:prose-invert prose-sm break-words">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      pre: ({ ...props }) => (
                        <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                          <pre {...props} />
                        </div>
                      ),
                      code: ({ ...props }) => (
                        <code className="bg-black/10 rounded px-1" {...props} />
                      ),
                    }}
                  >
                    {/* Handle both string content and parts */}
                    {typeof m.content === "string"
                      ? m.content
                      : m.parts?.map((p: any) => p.text).join("") || ""}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))
        )}
        {status !== "ready" && status !== "error" && (
          <div className="flex justify-start">
            <div className="max-w-[80%] bg-muted rounded-lg px-4 py-2">
              <div className="flex items-center space-x-1">
                <div
                  className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t bg-background shrink-0">
        <form
          onSubmit={onSubmit}
          className="relative flex items-end w-full p-2 rounded-md border border-input bg-transparent shadow-xs focus-within:ring-1 focus-within:ring-ring dark:bg-input/30"
        >
          <TextareaAutosize
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            minRows={1}
            maxRows={4}
            className="flex-1 min-h-[44px] w-full resize-none border-0 bg-transparent p-2 placeholder:text-muted-foreground focus:ring-0 focus:outline-none md:text-sm"
          />
          <Button
            type="submit"
            size="icon"
            disabled={status !== "ready" || !input.trim()}
            aria-label="Send message"
            data-testid="submit-button"
            className="mb-1 mr-1 shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
