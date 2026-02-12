"use client";

import { useState } from "react";
import { Plus, Search, FileText, Sparkles, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type KnowledgeSource = "user" | "ai";
type KnowledgeType = "bio" | "project" | "experience" | "other";
type KnowledgeStatus = "approved" | "review" | "draft";

interface KnowledgeFragment {
  id: string;
  title: string;
  source: KnowledgeSource;
  type: KnowledgeType;
  status: KnowledgeStatus;
  lastUpdated: string;
}

const mockData: KnowledgeFragment[] = [
  {
    id: "1",
    title: "Professional Bio (Short)",
    source: "user",
    type: "bio",
    status: "approved",
    lastUpdated: "2023-10-26",
  },
  {
    id: "2",
    title: "Project: BotFolio Overview",
    source: "user",
    type: "project",
    status: "approved",
    lastUpdated: "2023-10-27",
  },
  {
    id: "3",
    title: "Experience: Senior Engineer at TechCorp",
    source: "ai",
    type: "experience",
    status: "review",
    lastUpdated: "2023-10-28",
  },
  {
    id: "4",
    title: "Derived Skillset: React & Next.js",
    source: "ai",
    type: "other",
    status: "approved",
    lastUpdated: "2023-10-28",
  },
];

export default function KnowledgeBasePage() {
  const [activeTab, setActiveTab] = useState<"all" | "user" | "ai">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = mockData.filter((item) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "user" && item.source === "user") ||
      (activeTab === "ai" && item.source === "ai");

    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Knowledge Base</h1>
          <p className="text-muted-foreground">
            Manage the data source for your portfolio AI.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create New
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              <TabButton
                active={activeTab === "all"}
                onClick={() => setActiveTab("all")}
                label="All Documents"
              />
              <TabButton
                active={activeTab === "user"}
                onClick={() => setActiveTab("user")}
                label="My Content"
                icon={<PenLine className="mr-2 h-4 w-4" />}
              />
              <TabButton
                active={activeTab === "ai"}
                onClick={() => setActiveTab("ai")}
                label="AI Generated"
                icon={<Sparkles className="mr-2 h-4 w-4" />}
              />
            </div>
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search documents..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr className="border-b">
                  <th className="h-10 px-4 font-medium">Title</th>
                  <th className="h-10 px-4 font-medium">Source</th>
                  <th className="h-10 px-4 font-medium">Type</th>
                  <th className="h-10 px-4 font-medium">Status</th>
                  <th className="h-10 px-4 font-medium">Last Updated</th>
                  <th className="h-10 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No documents found.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b last:border-0 hover:bg-muted/50"
                    >
                      <td className="p-4 font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          {item.title}
                        </div>
                      </td>
                      <td className="p-4">
                        <SourceBadge source={item.source} />
                      </td>
                      <td className="p-4 capitalize">{item.type}</td>
                      <td className="p-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {item.lastUpdated}
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      size="sm"
      onClick={onClick}
      className={cn(
        "h-8 rounded-full",
        active && "bg-muted font-medium text-foreground",
      )}
    >
      {icon}
      {label}
    </Button>
  );
}

function SourceBadge({ source }: { source: KnowledgeSource }) {
  if (source === "user") {
    return (
      <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
        <PenLine className="mr-1 h-3 w-3" />
        User
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700 dark:border-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
      <Sparkles className="mr-1 h-3 w-3" />
      AI
    </span>
  );
}

function StatusBadge({ status }: { status: KnowledgeStatus }) {
  const styles = {
    approved:
      "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400",
    review:
      "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    draft:
      "border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-400",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        styles[status],
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
