"use client";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { SidebarContent } from "./sidebar";

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col p-0 w-[250px]">
        <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
        <SidebarContent className="w-full border-r-0 bg-background" />
      </SheetContent>
    </Sheet>
  );
}
