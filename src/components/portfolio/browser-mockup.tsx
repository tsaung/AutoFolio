"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BrowserMockupProps {
  children: ReactNode;
  className?: string;
  url?: string;
}

export function BrowserMockup({
  children,
  className,
  url,
}: BrowserMockupProps) {
  return (
    <motion.div
      className={cn(
        "relative w-full flex flex-col rounded-md overflow-hidden border border-border/50 bg-background shadow-md",
        className,
      )}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Browser Chrome Header */}
      <div className="flex items-center px-3 py-2 bg-muted/40 border-b border-border/40 gap-3 max-h-[32px]">
        {/* Traffic Lights */}
        <div className="flex gap-1.5 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
        </div>

        {/* URL Bar (Optional) */}
        {url && (
          <div className="mx-auto bg-background/50 border border-border/50 rounded-sm px-2 py-0.5 text-[10px] text-muted-foreground flex-1 max-w-[200px] text-center truncate">
            {url}
          </div>
        )}
      </div>

      {/* Browser Body */}
      <div className="relative flex-1 bg-muted/10 overflow-hidden">
        {children}
      </div>
    </motion.div>
  );
}
