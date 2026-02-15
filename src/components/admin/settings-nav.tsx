"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { User, Bot, MessageSquare, Cpu } from "lucide-react";

interface SettingsNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    icon: React.ElementType;
  }[];
}

export function SettingsNav({ className, items, ...props }: SettingsNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className,
      )}
      {...props}
    >
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              isActive
                ? "bg-muted hover:bg-muted"
                : "hover:bg-transparent hover:underline",
              "justify-start",
            )}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}

export const settingsNavItems = [
  {
    title: "Profile",
    href: "/settings/profile",
    icon: User,
  },
  {
    title: "Bot Configuration",
    href: "/settings/bot",
    icon: Bot,
  },
];
