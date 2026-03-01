"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { MessageCircle, X } from "lucide-react";
import dynamic from "next/dynamic";
import { Database } from "@/types/database";
import { BotConfig } from "@/lib/actions/bot-config";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

const ChatInterface = dynamic(
  () =>
    import("@/components/chat/chat-interface").then((mod) => mod.ChatInterface),
  { ssr: false },
);

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface VisitorLayoutWrapperProps {
  children: React.ReactNode;
  profile: Profile | null;
  botConfig: BotConfig | null;
}

export function VisitorLayoutWrapper({
  children,
  profile,
  botConfig,
}: VisitorLayoutWrapperProps) {
  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
    const mql = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mql.matches);

    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  if (!isMounted) return <>{children}</>;

  return (
    <div className="flex w-full h-screen overflow-hidden bg-background">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col pt-0">
        {children}
      </main>

      {/* Desktop Sidebar - Pure Flex Box */}
      <aside
        className={cn(
          "hidden md:flex flex-col h-full bg-background border-l transition-[width] duration-300 ease-in-out shrink-0 overflow-hidden",
          resolvedTheme === "dark" ? "light" : "dark",
          open ? "w-[400px] lg:w-[448px] border-l" : "w-0 border-l-0",
        )}
      >
        <div className="w-[400px] lg:w-[448px] h-full flex flex-col relative bg-background text-foreground">
          {open && (
            <ChatInterface
              profile={profile}
              botConfig={botConfig}
              onClose={() => setOpen(false)}
            />
          )}
        </div>
      </aside>

      {/* Mobile Sheet (Overlay) - Only rendered physically below md break */}
      {!isDesktop && (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent
            side="right"
            className={cn(
              "w-full h-full p-0 sm:max-w-md border-l shadow-2xl bg-background",
              resolvedTheme === "dark" ? "light" : "dark",
            )}
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <div className="flex h-full flex-col bg-background text-foreground">
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
      )}

      {/* Floating Action Button (FAB) */}
      {!open && (
        <Button
          size="icon"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl z-50 animate-in fade-in zoom-in duration-300 hover:scale-110 transition-all active:scale-95 bg-primary hover:bg-primary/90 border-none group flex items-center justify-center p-0"
        >
          <MessageCircle className="h-6 w-6 text-primary-foreground group-hover:rotate-12 transition-transform" />
          <span className="sr-only">Chat with AI</span>
        </Button>
      )}
    </div>
  );
}
