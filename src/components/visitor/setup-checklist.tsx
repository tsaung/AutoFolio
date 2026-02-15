import { Database } from "@/types/database";
import { CheckCircle2, Circle, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface SetupChecklistProps {
  profile: Profile | null;
  hasAnyUser: boolean;
}

export function SetupChecklist({ profile, hasAnyUser }: SetupChecklistProps) {
  const steps = [
    {
      title: "Create Owner Account",
      description: "Create the first user in Supabase to claim ownership.",
      href: "/login",
      cta: "Create User",
      isComplete: hasAnyUser,
    },
    {
      title: "Setup Profile",
      description: "Add your name, profession, and bio details.",
      href: "/settings/profile",
      cta: "Setup Profile",
      isComplete: !!profile,
    },
  ];

  const completedSteps = steps.filter((step) => step.isComplete).length;
  const progress = Math.round((completedSteps / steps.length) * 100);

  return (
    <div className="flex flex-col h-[100dvh] max-w-4xl mx-auto border-x bg-background overflow-hidden">
      <header className="p-4 border-b bg-card flex items-center justify-between shrink-0 z-10">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          BotFolio
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center">
        <Card className="border-primary/20 bg-primary/5 max-w-lg w-full">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>
                  Complete these steps to launch your AI assistant.
                </CardDescription>
              </div>
              <div className="text-sm font-medium text-primary">
                {progress}% Complete
              </div>
            </div>
            {/* Simple progress bar */}
            <div className="mt-2 h-2 w-full rounded-full bg-primary/10">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${
                  step.isComplete
                    ? "bg-background/50 border-primary/20"
                    : "bg-background border-muted"
                }`}
              >
                <div className="flex items-center gap-3">
                  {step.isComplete ? (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <div
                      className={`font-medium ${
                        step.isComplete
                          ? "text-muted-foreground line-through"
                          : ""
                      }`}
                    >
                      {step.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {step.description}
                    </div>
                  </div>
                </div>

                {!step.isComplete && (
                  <Button asChild size="sm" variant="outline" className="gap-1">
                    <Link href={step.href}>
                      {step.cta} <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
