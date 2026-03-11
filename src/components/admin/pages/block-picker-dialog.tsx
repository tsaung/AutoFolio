"use client";

import { useState, useEffect, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Library, Loader2, Plus, Search } from "lucide-react";
import { fetchBlocks } from "@/lib/actions/blocks";
import { BLOCK_CONFIG } from "@/components/admin/blocks/forms/block-config";
import { BLOCK_FORM_REGISTRY } from "@/components/admin/blocks/forms";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type BlockDocument = {
  _id: string;
  _type: string;
  name?: string;
  _updatedAt: string;
};

type BlockPickerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (block: { _key: string; _ref: string; _type: "reference"; blockName: string; blockType: string }) => void;
  /** Block IDs already on the page (to show a visual hint) */
  existingRefs?: string[];
};

function generateKey(): string {
  return Math.random().toString(36).substring(2, 9);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function BlockPickerDialog({
  open,
  onOpenChange,
  onSelect,
  existingRefs = [],
}: BlockPickerDialogProps) {
  const [blocks, setBlocks] = useState<BlockDocument[]>([]);
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<string>("library");
  // Quick Create state: selected block type for the inline form
  const [quickCreateType, setQuickCreateType] = useState<string | null>(null);

  // Fetch blocks when dialog opens
  useEffect(() => {
    if (!open) return;
    startTransition(async () => {
      const result = await fetchBlocks();
      if (result.blocks) {
        setBlocks(result.blocks as BlockDocument[]);
      }
    });
  }, [open]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setSearch("");
      setActiveTab("library");
      setQuickCreateType(null);
    }
  }, [open]);

  // Group blocks by _type
  const grouped = blocks.reduce<Record<string, BlockDocument[]>>((acc, block) => {
    const type = block._type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(block);
    return acc;
  }, {});

  // Filter by search
  const filteredTypes = Object.entries(grouped).filter(([type, items]) => {
    const config = BLOCK_CONFIG[type];
    const label = config?.title ?? type;
    const matchesType = label.toLowerCase().includes(search.toLowerCase());
    const matchesItem = items.some((b) =>
      (b.name ?? "").toLowerCase().includes(search.toLowerCase())
    );
    return matchesType || matchesItem;
  });

  const handleSelect = (block: BlockDocument) => {
    const config = BLOCK_CONFIG[block._type];
    onSelect({
      _key: generateKey(),
      _ref: block._id,
      _type: "reference",
      blockName: block.name ?? config?.title ?? block._type,
      blockType: block._type,
    });
    onOpenChange(false);
  };

  const handleQuickCreated = (type: string, result: { id: string; name: string }) => {
    const config = BLOCK_CONFIG[type];
    onSelect({
      _key: generateKey(),
      _ref: result.id,
      _type: "reference",
      blockName: result.name || config?.title || type,
      blockType: type,
    });
    onOpenChange(false);
  };

  // Resolve the form component for quick-create
  const QuickCreateForm = quickCreateType ? BLOCK_FORM_REGISTRY[quickCreateType] : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Block</DialogTitle>
          <DialogDescription>
            Pick an existing block or quick-create a new one.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setQuickCreateType(null); }} className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="library" className="gap-1.5">
              <Library className="h-3.5 w-3.5" />
              Library
            </TabsTrigger>
            <TabsTrigger value="quick-create" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              Quick Create
            </TabsTrigger>
          </TabsList>

          {/* ── Library Tab ─────────────────────────────────────────── */}
          <TabsContent value="library" className="flex-1 flex flex-col min-h-0 mt-3">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search blocks…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <ScrollArea className="flex-1 -mx-6 px-6 min-h-0 max-h-[40vh]">
              {isPending ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : filteredTypes.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  {blocks.length === 0
                    ? "No blocks found. Create some in the Block Library or use Quick Create."
                    : "No blocks match your search."}
                </div>
              ) : (
                <div className="space-y-4 pb-2">
                  {filteredTypes.map(([type, items]) => {
                    const config = BLOCK_CONFIG[type];
                    const Icon = config?.icon;
                    const label = config?.title ?? type;

                    const visibleItems = search
                      ? items.filter((b) =>
                          (b.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
                          label.toLowerCase().includes(search.toLowerCase())
                        )
                      : items;

                    if (visibleItems.length === 0) return null;

                    return (
                      <div key={type}>
                        <div className="flex items-center gap-2 mb-2 px-1">
                          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            {label}
                          </span>
                          <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
                            {visibleItems.length}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          {visibleItems.map((block) => {
                            const isUsed = existingRefs.includes(block._id);
                            return (
                              <button
                                key={block._id}
                                type="button"
                                onClick={() => handleSelect(block)}
                                className={cn(
                                  "w-full flex items-center justify-between rounded-md border px-3 py-2 text-sm",
                                  "hover:bg-accent hover:text-accent-foreground transition-colors text-left",
                                  isUsed && "border-primary/30 bg-primary/5"
                                )}
                              >
                                <span className="font-medium truncate">
                                  {block.name ?? "Untitled"}
                                </span>
                                {isUsed && (
                                  <Badge variant="outline" className="text-[10px] h-4 px-1.5 shrink-0 ml-2">
                                    In use
                                  </Badge>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          {/* ── Quick Create Tab ────────────────────────────────────── */}
          <TabsContent value="quick-create" className="flex-1 flex flex-col min-h-0 mt-3">
            <ScrollArea className="flex-1 -mx-6 px-6 min-h-0 max-h-[50vh]">
              {quickCreateType === null ? (
                /* Step 1: Type picker grid */
                <div className="grid grid-cols-2 gap-2 pb-2">
                  {Object.entries(BLOCK_CONFIG).map(([type, config]) => {
                    const Icon = config.icon;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setQuickCreateType(type)}
                        className={cn(
                          "flex flex-col items-start gap-1.5 rounded-lg border p-3 text-left",
                          "hover:bg-accent hover:text-accent-foreground hover:border-primary/50 transition-colors"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <div className="p-1 bg-primary/10 rounded text-primary">
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-sm font-medium">{config.title}</span>
                        </div>
                        <span className="text-[11px] text-muted-foreground leading-tight line-clamp-2">
                          {config.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : QuickCreateForm ? (
                /* Step 2: Inline form for the selected type */
                <div className="pb-2">
                  <div className="flex items-center gap-2 mb-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0"
                      onClick={() => setQuickCreateType(null)}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-2">
                      {BLOCK_CONFIG[quickCreateType]?.icon && (
                        <div className="p-1 bg-primary/10 rounded text-primary">
                          {(() => {
                            const Icon = BLOCK_CONFIG[quickCreateType].icon;
                            return <Icon className="h-3.5 w-3.5" />;
                          })()}
                        </div>
                      )}
                      <span className="text-sm font-semibold">
                        New {BLOCK_CONFIG[quickCreateType]?.title}
                      </span>
                    </div>
                  </div>
                  <QuickCreateForm
                    type={quickCreateType}
                    mode="inline"
                    onCreated={(result) => handleQuickCreated(quickCreateType, result)}
                  />
                </div>
              ) : null}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

