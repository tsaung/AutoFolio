"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Settings,
  Database,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Knowledge Base",
    href: "/knowledge",
    icon: Database,
  },

  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

interface SidebarContentProps {
  className?: string;
  collapsed?: boolean;
  onToggle?: () => void;
}

export function SidebarContent({
  className,
  collapsed,
  onToggle,
}: SidebarContentProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "flex h-full flex-col gap-2 bg-muted/40 transition-all duration-300",
        className,
      )}
    >
      <div
        className={cn(
          "flex h-14 items-center px-4 lg:h-[60px] lg:px-6",
          collapsed ? "justify-center" : "justify-between",
        )}
      >
        {!collapsed && (
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-semibold overflow-hidden whitespace-nowrap"
          >
            <span className="">BotFolio Admin</span>
          </Link>
        )}
        {onToggle && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-8 w-8 ml-auto"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                  isActive ? "bg-muted text-primary" : "text-muted-foreground",
                  collapsed && "justify-center px-2",
                )}
                title={collapsed ? item.title : undefined}
              >
                <item.icon className="h-4 w-4" />
                {!collapsed && item.title}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

interface AdminSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  return (
    <SidebarContent
      collapsed={collapsed}
      onToggle={onToggle}
      className="hidden h-full border-r lg:flex"
    />
  );
}
