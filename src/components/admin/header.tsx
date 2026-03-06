import Link from "next/link";
import { LogoutButton } from "./logout-button";
import { MobileNav } from "./mobile-nav";
import { ModeToggle } from "@/components/mode-toggle";

interface AdminHeaderProps {
  siteName?: string;
}

export function AdminHeader({ siteName }: AdminHeaderProps) {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6 lg:h-[60px] lg:px-8 justify-between shrink-0">
      <div className="flex items-center gap-4 w-full">
        <div className="flex items-center gap-2">
          <MobileNav />
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/admin"
              className="flex items-center gap-2 font-semibold overflow-hidden whitespace-nowrap min-w-[120px]"
            >
              <span className="text-lg">{siteName || "BotFolio Admin"}</span>
            </Link>
          </div>
        </div>
        <div className="w-full flex-1">
          {/* Search or Breadcrumbs could go here */}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ModeToggle />
        <LogoutButton />
      </div>
    </header>
  );
}
