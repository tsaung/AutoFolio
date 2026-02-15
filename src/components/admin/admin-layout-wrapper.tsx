"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { cn } from "@/lib/utils";

interface AdminLayoutWrapperProps {
  children: React.ReactNode;
  sidebar: React.ReactNode; // We can pass the sidebar as a prop or render it inside. Rendering inside is easier for state.
  // Actually, passing AdminSidebar as a component or just importing it is fine.
  // But wait, layout.tsx imports AdminSidebar.
  // Let's just import AdminSidebar here to avoid prop drilling complexity if not needed.
}

export function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
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
    <div
      className={cn(
        "grid fixed inset-0 w-full transition-all duration-300 overflow-hidden",
        isCollapsed ? "lg:grid-cols-[60px_1fr]" : "lg:grid-cols-[280px_1fr]",
      )}
    >
      <div className="hidden border-r bg-muted/40 lg:block dark:bg-zinc-800/40 overflow-y-auto">
        <AdminSidebar collapsed={isCollapsed} onToggle={toggleSidebar} />
      </div>
      <div className="flex flex-col h-full overflow-hidden">{children}</div>
    </div>
  );
}
