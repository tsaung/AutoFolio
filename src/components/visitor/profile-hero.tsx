import { Database } from "@/types/database";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface ProfileHeroProps {
  profile: Profile | null;
}

export function ProfileHero({ profile }: ProfileHeroProps) {
  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 text-center p-8">
        <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden border-4 border-muted">
          <img
            src="/avatar.jpg"
            alt="Default Profile"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Welcome to BotFolio</h2>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Please set up your profile to activate your personal AI assistant.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/login">Set up Profile</Link>
        </Button>
      </div>
    );
  }

  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AI";

  return (
    <div className="flex flex-col items-center justify-center space-y-4 text-center pb-8 pt-4">
      <Avatar className="h-20 w-20 border-2 border-primary/20">
        <AvatarImage
          src={profile.avatar_url || "/avatar.jpg"}
          alt={profile.name || "Avatar"}
          className="object-cover"
        />
        <AvatarFallback className="bg-muted">
          <Bot className="w-8 h-8 opacity-50" />
        </AvatarFallback>
      </Avatar>

      <div className="space-y-1">
        {profile.profession && (
          <p className="text-lg font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-2 duration-500">
            {profile.profession}
          </p>
        )}
      </div>

      {profile.welcome_message && (
        <p className="text-muted-foreground max-w-[600px] text-base leading-relaxed">
          {profile.welcome_message
            .replace("{name}", profile.name || "")
            .replace("{profession}", profile.profession || "")
            .replace("{experience}", String(profile.experience || ""))
            .replace("{field}", profile.field || "")}
        </p>
      )}
    </div>
  );
}
