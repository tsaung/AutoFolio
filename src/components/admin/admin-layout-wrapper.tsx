"use client";

import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/header";
import { AdminSidebar } from "@/components/admin/sidebar";
import { cn } from "@/lib/utils";

export function AdminLayoutWrapper({
  children,
  siteName,
}: {
  children: React.ReactNode;
  siteName?: string;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem("admin_sidebar_collapsed");
    if (stored) {
      setIsCollapsed(stored === "true");
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("admin_sidebar_collapsed", String(newState));
  };

  // Prevent hydration mismatch by rendering a default state or null until mounted
  // mostly for the initial render match.
  // However, for layout, we want it to be visible.
  // If we don't handle hydration, there might be a flicker or mismatch error.
  // A common trick is to use `suppressHydrationWarning` on the specific element or just wait for mount.
  // Waiting for mount might cause layout shift.
  // Better to default to false and let it snap to true if needed, or just accept the client-side adjustment.

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-background">
      <AdminHeader siteName={siteName} />
      <div className="flex flex-1 overflow-hidden">
        <aside
          className={cn(
            "hidden border-r bg-muted/40 lg:block dark:bg-zinc-800/40 transition-all duration-300 overflow-y-auto overflow-x-hidden",
            isCollapsed ? "w-[60px]" : "w-[280px]",
          )}
        >
          <AdminSidebar collapsed={isCollapsed} onToggle={toggleSidebar} />
        </aside>
        <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
