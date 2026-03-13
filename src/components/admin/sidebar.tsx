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
  Globe,
  Menu,
  FileText,
  LayoutTemplate,
  PanelLeftClose,
  PanelLeftOpen,
  Folder,
  Briefcase,
  Code,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarGroups = [
  {
    heading: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
      },
      {
        title: "View Site",
        href: "/",
        icon: Globe,
      },
    ],
  },
  {
    heading: "Content",
    items: [
      {
        title: "Pages",
        href: "/admin/pages",
        icon: FileText,
      },
      {
        title: "Blocks Library",
        href: "/admin/blocks",
        icon: LayoutTemplate,
      },
      {
        title: "Navigation",
        href: "/admin/navigation",
        icon: Menu,
      },
    ],
  },
  {
    heading: "Collections",
    items: [
      {
        title: "Projects",
        href: "/admin/projects",
        icon: Folder,
      },
      {
        title: "Experiences",
        href: "/admin/experiences",
        icon: Briefcase,
      },
      {
        title: "Skills",
        href: "/admin/skills",
        icon: Code,
      },
    ],
  },
  {
    heading: "System",
    items: [
      {
        title: "Knowledge Base",
        href: "/admin/knowledge",
        icon: Database,
      },
      {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
      },
    ],
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
        "flex h-full flex-col gap-2 bg-muted/40 transition-all duration-300 overflow-x-hidden",
        className,
      )}
    >
      <div className="flex-1 pt-4 pb-4 overflow-y-auto">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {sidebarGroups.map((group, groupIndex) => (
            <div key={group.heading} className="mb-4 last:mb-0">
              {collapsed ? (
                groupIndex !== 0 && (
                  <div className="mx-2 mb-2 h-px bg-border" aria-hidden="true" />
                )
              ) : (
                <h4 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                  {group.heading}
                </h4>
              )}
              <div className="grid gap-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  const isExternal = item.href === "/";
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary whitespace-nowrap overflow-hidden",
                        isActive
                          ? "bg-muted text-primary"
                          : "text-muted-foreground hover:bg-muted/50",
                        collapsed && "justify-center px-2",
                      )}
                      title={collapsed ? item.title : undefined}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && item.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {onToggle && (
        <div className="mt-auto border-t p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className={cn(
              "h-9 w-full transition-all hover:bg-muted duration-200",
              collapsed ? "justify-center" : "justify-start px-3 gap-3",
            )}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4 shrink-0" />
            ) : (
              <>
                <PanelLeftClose className="h-4 w-4 shrink-0" />
                <span className="text-xs font-medium whitespace-nowrap">
                  Collapse
                </span>
              </>
            )}
          </Button>
        </div>
      )}
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
