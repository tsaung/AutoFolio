"use client";

import { Database } from "@/types/database";
import { Github, Linkedin, Twitter, ExternalLink, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type SocialLink = Database["public"]["Tables"]["social_links"]["Row"];

interface VisitorFooterProps {
  profile: Profile | null;
  socialLinks: SocialLink[];
}

export function VisitorFooter({ profile, socialLinks }: VisitorFooterProps) {
  const currentYear = new Date().getFullYear();

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "github":
        return <Github className="w-7 h-7" />;
      case "linkedin":
        return <Linkedin className="w-7 h-7" />;
      case "twitter":
      case "x":
        return <Twitter className="w-7 h-7" />;
      case "email":
        return <Mail className="w-7 h-7" />;
      default:
        return <ExternalLink className="w-7 h-7" />;
    }
  };

  return (
    <footer className="border-t bg-muted/30 py-12">
      <div className="container mx-auto px-4 flex flex-col items-center space-y-8">
        {/* Social Links */}
        {socialLinks.length > 0 && (
          <div className="flex items-center gap-6">
            {socialLinks.map((link) => (
              <Button
                key={link.id}
                variant="ghost"
                size="icon"
                asChild
                className="rounded-full w-12 h-12 text-primary hover:bg-primary/10 hover:scale-110 transition-all"
              >
                <Link href={link.url} target="_blank" rel="noopener noreferrer">
                  {getSocialIcon(link.platform)}
                  <span className="sr-only">{link.platform}</span>
                </Link>
              </Button>
            ))}
          </div>
        )}

        {/* Brand/Copyright */}
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} {profile?.name || "Portfolio"}
          </p>
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            Built with{" "}
            <Link
              href="https://github.com/tsaung/botfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              BotFolio
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
