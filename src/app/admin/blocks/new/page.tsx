import { type ReactNode } from "react";
import Link from "next/link";
import { LayoutTemplate, MonitorPlay, Component } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const BLOCK_TYPES = [
  {
    type: "heroBlock",
    title: "Hero Block",
    description: "A prominent section typically used at the top of a page, featuring a headline, subheadline, background image, and call-to-action buttons.",
    icon: MonitorPlay,
  },
  {
    type: "ctaBlock",
    title: "Call to Action",
    description: "A focused section designed to drive users towards a specific goal, with a bold heading, supporting text, and a primary button.",
    icon: Component,
  },
];

export default function NewBlockPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Create New Block</h2>
          <p className="text-muted-foreground">
            Choose the type of reusable block you want to create.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/admin/blocks">
            <Button variant="outline">Cancel</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pt-6">
        {BLOCK_TYPES.map((block) => (
          <Card key={block.type} className="relative flex flex-col hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-md text-primary">
                  <block.icon className="w-5 h-5" />
                </div>
                <CardTitle className="text-xl">{block.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <CardDescription className="text-sm flex-1 pb-6">
                {block.description}
              </CardDescription>
              <Link href={`/admin/blocks/new/${block.type}`} className="w-full mt-auto">
                <Button className="w-full">
                  Create {block.title}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
