import { LogoutButton } from './logout-button'
import { MobileNav } from './mobile-nav'

export function AdminHeader() {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6 lg:h-[60px] lg:px-8 justify-between">
      <div className="flex items-center gap-2 w-full">
        <MobileNav />
        <div className="w-full flex-1">
          {/* Search or Breadcrumbs could go here */}
        </div>
      </div>
      <LogoutButton />
    </header>
  )
}
