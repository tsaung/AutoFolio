"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { MessageCircle, X } from "lucide-react";
import { ChatInterface } from "@/components/chat/chat-interface";
import { useChat } from "@ai-sdk/react";
import { Database } from "@/types/database";
import { BotConfig } from "@/lib/actions/bot-config";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface FloatingChatProps {
  profile: Profile | null;
  botConfig: BotConfig | null;
}

export function FloatingChat({ profile, botConfig }: FloatingChatProps) {
  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    append,
    reload,
    setInput,
  } = useChat({
    // Updated useChat with Message type
    api: "/api/chat",
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 animate-in fade-in zoom-in duration-300 hover:scale-110 transition-transform"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="sr-only">Chat with AI</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full h-full p-0 border-none shadow-none sm:max-w-none"
        // Hide default close button as we have one in the header
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex h-full flex-col">
          {/* Hidden Title for Accessibility */}
          <SheetTitle className="sr-only">
            Chat with {profile?.name || "AI"}
          </SheetTitle>

          <div className="flex-1 overflow-hidden relative">
            <ChatInterface
              profile={profile}
              botConfig={botConfig}
              messages={messages}
              input={input || ""}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              stop={stop}
              append={append}
              reload={reload}
              setInput={setInput}
              onClose={() => setOpen(false)}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
