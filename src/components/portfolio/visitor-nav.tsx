"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { ModeToggle } from "@/components/mode-toggle";

export function VisitorNav({
  name,
  avatarUrl,
}: {
  name?: string | null;
  avatarUrl?: string | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // If the 1px sentinel is NO LONGER intersecting (we scrolled past it), set scrolled to true
        setScrolled(!entry.isIntersecting);
      },
      { root: null, rootMargin: "0px", threshold: 0 },
    );

    const sentinel = document.getElementById("nav-sentinel");
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    if (isHome) {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setIsOpen(false);
      }
    }
  };

  const navLinks = [
    { href: isHome ? "#about" : "/#about", label: "About" },
    { href: isHome ? "#projects" : "/#projects", label: "Projects" },
    { href: isHome ? "#experience" : "/#experience", label: "Experience" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-md shadow-sm border-b"
          : "bg-transparent",
      )}
    >
      {/* Sentinel element for IntersectionObserver (placed absolute top so it stays at the top of the DOCUMENT, not the sticky header) */}
      <div
        id="nav-sentinel"
        className="absolute top-0 left-0 w-full h-5 pointer-events-none invisible"
        style={{ top: "-20px" }}
      />

      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-2 hover:opacity-80 transition-all duration-300",
              !scrolled &&
                isHome &&
                "opacity-0 -translate-x-4 pointer-events-none",
            )}
            onClick={(e) => scrollToSection(e, "about")}
          >
            <Avatar className="h-8 w-8">
              <Image
                src={cloudinaryUrl(avatarUrl || "/avatar.jpg", {
                  width: 64,
                  height: 64,
                  crop: "fill",
                  gravity: "face",
                })}
                alt={name || "Profile"}
                fill
                className="object-cover rounded-full"
                sizes="32px"
              />
              <AvatarFallback>
                {name?.slice(0, 2).toUpperCase() || "BF"}
              </AvatarFallback>
            </Avatar>
            <span className="text-lg font-bold tracking-tight">
              {name || "BotFolio"}
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href.replace("#", ""))}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <ModeToggle />

          {/* Mobile Nav Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b shadow-lg p-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href.replace("#", ""))}
              className="text-base font-medium p-2 hover:bg-muted rounded-md transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
