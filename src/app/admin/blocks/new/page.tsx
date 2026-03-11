import { type ReactNode } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BLOCK_CONFIG } from "@/components/admin/blocks/forms/block-config";

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
        {Object.entries(BLOCK_CONFIG)
          .filter(([_, config]) => config.category === "simple" || config.category === "medium")
          .map(([type, config]) => (
            <Card key={type} className="relative flex flex-col hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-md text-primary">
                    <config.icon className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-xl">{config.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <CardDescription className="text-sm flex-1 pb-6">
                  {config.description}
                </CardDescription>
                <Link href={`/admin/blocks/new/${type}`} className="w-full mt-auto">
                  <Button className="w-full">
                    Create {config.title}
                  </Button>
                </Link>
              </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}
