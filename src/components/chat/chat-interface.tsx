"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect, useRef } from "react";
import { Send, Bot, User, Sparkles, X } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import { cn } from "@/lib/utils";
import { Database } from "@/types/database";
import { useChat } from "@ai-sdk/react";
import { AIOrb } from "./ai-orb";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface ChatInterfaceProps {
  profile?: Profile | null;
  botConfig?: Database["public"]["Tables"]["bot_configs"]["Row"] | null;
  onClose?: () => void;
}

export function ChatInterface({
  profile,
  botConfig,
  onClose,
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, status, sendMessage } = useChat();
  const [input, setInput] = useState("");

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handlePromptClick = async (prompt: string) => {
    await sendMessage({ text: prompt });
  };

  const onFormSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!input.trim()) return;
    const value = input;
    setInput("");
    await sendMessage({ text: value });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // We need to trigger form submission
      const form = e.currentTarget.closest("form");
      if (form) form.requestSubmit();
    }
  };

  const prompts = (botConfig?.predefined_prompts as string[]) || [
    "Tell me about your experience",
    "What are your skills?",
    "Show me your projects",
    "Contact info",
  ];

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-hidden relative">
      <header className="px-4 py-2.5 border-b bg-card flex items-center justify-end shrink-0 z-10 relative shadow-sm min-h-[56px]">
        <div className="flex items-center gap-2">
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close chat"
              className="rounded-full h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground transition-all active:scale-95"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 min-h-0 flex flex-col scroll-smooth">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="flex flex-col items-center justify-center space-y-6 max-w-lg mx-auto px-4">
              <AIOrb
                message={
                  profile?.chat_welcome_message
                    ? profile.chat_welcome_message.replace(
                        "{name}",
                        profile.name || "User",
                      )
                    : `Hello! I am ${
                        profile?.name?.split(" ")[0] || "an"
                      } AI assistant. How can I help you today?`
                }
              />

              {profile && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full animate-in slide-in-from-bottom-10 duration-700 delay-150">
                  {prompts.map((prompt) => (
                    <button
                      key={prompt}
                      className="p-3 text-sm font-medium border rounded-xl hover:bg-muted/50 hover:scale-105 transition-all text-left shadow-sm bg-card hover:border-primary/50"
                      onClick={() => handlePromptClick(prompt)}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          messages.map((m: any) => (
            <div
              key={m.id}
              className={cn(
                "flex gap-3 max-w-[85%] md:max-w-[75%]",
                m.role === "user" ? "ml-auto flex-row-reverse" : "",
              )}
            >
              <Avatar className="w-8 h-8 mt-1 shrink-0 border shadow-sm">
                {m.role === "user" ? (
                  <>
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </>
                ) : (
                  <>
                    <AvatarImage src={profile?.avatar_url || "/avatar.jpg"} />
                    <AvatarFallback className="bg-muted">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </>
                )}
              </Avatar>
              <div
                className={cn(
                  "rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                  m.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-muted text-foreground rounded-tl-none border",
                )}
              >
                <div className="prose dark:prose-invert prose-sm break-words max-w-none">
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
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2 bg-muted rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-px w-full" />
      </div>

      <div className="p-4 border-t bg-background/80 backdrop-blur-sm shrink-0">
        <form
          onSubmit={onFormSubmit}
          className="relative flex items-end w-full p-2 rounded-2xl border bg-background shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all"
        >
          <TextareaAutosize
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask ${profile?.name?.split(" ")[0] || "AI"} anything...`}
            minRows={1}
            maxRows={4}
            className="flex-1 min-h-[44px] w-full resize-none border-0 bg-transparent p-2 placeholder:text-muted-foreground focus:ring-0 focus:outline-none md:text-sm"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
            className={cn(
              "mb-1 mr-1 shrink-0 rounded-xl transition-all",
              input.trim()
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground",
            )}
          >
            {isLoading ? (
              <span className="animate-spin">⟳</span>
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
