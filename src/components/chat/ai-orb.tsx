"use client";

import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIOrbProps {
  className?: string;
}

export function AIOrb({ className }: AIOrbProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center w-32 h-32 my-4",
        className,
      )}
    >
      <div className="relative flex justify-center items-center -rotate-3">
        {/* Main Primary bubble front and center */}
        <div className="relative text-foreground/80 drop-shadow-sm">
          <MessageSquare
            className="w-20 h-20 fill-muted/50 text-muted-foreground/50"
            strokeWidth={1.5}
          />

          {/* Animated ellipses inside main bubble */}
          <div className="absolute inset-0 flex items-center justify-center gap-1.5 pb-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-foreground/60"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
            />
            <motion.div
              className="w-2 h-2 rounded-full bg-foreground/60"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="w-2 h-2 rounded-full bg-foreground/60"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
