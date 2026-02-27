"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { MessageCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { Database } from "@/types/database";
import { BotConfig } from "@/lib/actions/bot-config";

const ChatInterface = dynamic(
  () =>
    import("@/components/chat/chat-interface").then((mod) => mod.ChatInterface),
  { ssr: false },
);

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface FloatingChatProps {
  profile: Profile | null;
  botConfig: BotConfig | null;
}

export function FloatingChat({ profile, botConfig }: FloatingChatProps) {
  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl z-50 animate-in fade-in zoom-in duration-300 hover:scale-110 transition-all active:scale-95 bg-primary hover:bg-primary/90 border-none group"
        >
          <MessageCircle className="h-6 w-6 text-primary-foreground group-hover:rotate-12 transition-transform" />
          <span className="sr-only">Chat with AI</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="w-full h-full p-0 border-none shadow-none sm:max-w-none origin-bottom"
        // Hide default close button as we have one in the header
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex h-full flex-col">
          {/* Hidden Title for Accessibility */}
          <SheetTitle className="sr-only">
            Chat with {profile?.name || "AI"}
          </SheetTitle>

          <div className="flex-1 overflow-hidden relative">
            {open && (
              <ChatInterface
                profile={profile}
                botConfig={botConfig}
                onClose={() => setOpen(false)}
              />
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
