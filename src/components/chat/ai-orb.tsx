"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIOrbProps {
  className?: string;
  message?: string;
}

export function AIOrb({
  className,
  message = "Hello! How can I help you today?",
}: AIOrbProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayedText("");
    setIsTyping(true);
    let i = 0;

    // Add a slight delay before typing starts
    const startDelay = setTimeout(() => {
      const typingInterval = setInterval(() => {
        if (i < message.length) {
          setDisplayedText(message.slice(0, i + 1));
          i++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, 35); // Adjust typing speed here

      return () => clearInterval(typingInterval);
    }, 600);

    return () => clearTimeout(startDelay);
  }, [message]);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full max-w-md mx-auto space-y-6",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-5 w-full">
        {/* Chat Bubble with Typing Effect */}
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="relative px-6 py-4 bg-background rounded-2xl shadow-sm border border-border text-center w-full"
        >
          {/* Subtle tail for bubble pointing down */}
          <svg
            className="absolute -bottom-2.5 left-1/2 -ml-2.5 w-5 h-2.5"
            viewBox="0 0 20 10"
            preserveAspectRatio="none"
          >
            {/* Outer border */}
            <path
              stroke="currentColor"
              fill="none"
              strokeWidth="1"
              className="text-border"
              d="M0,0 L10,10 L20,0"
            />
            {/* Inner fill */}
            <path
              fill="currentColor"
              className="text-background"
              d="M1,0 L10,9 L19,0"
            />
          </svg>

          <p className="relative z-10 text-lg font-medium leading-relaxed text-foreground min-h-[28px]">
            {displayedText}
            {isTyping && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                className="inline-block w-1.5 h-5 ml-1 align-middle bg-primary/70 rounded-full"
              />
            )}
          </p>
        </motion.div>

        {/* Android / Bot Avatar */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border-[3px] border-primary/20 shadow-sm"
        >
          <Bot className="w-10 h-10 text-primary" strokeWidth={1.5} />
          {isTyping && (
            <span className="absolute top-0 right-0 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-primary"></span>
            </span>
          )}
        </motion.div>
      </div>
    </div>
  );
}
