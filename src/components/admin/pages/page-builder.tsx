"use client";

import { useState, useTransition } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { updatePageBlocks } from "@/lib/actions/pages";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  GripVertical,
  Plus,
  Trash2,
  Loader2,
  Maximize2,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BLOCK_CONFIG } from "@/components/admin/blocks/forms/block-config";
import { BlockPickerDialog } from "./block-picker-dialog";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A block reference as stored in local state (includes display metadata). */
type BlockRef = {
  _key: string;
  _ref: string;
  _type: "reference";
  /** Display-only: block name from Sanity */
  blockName: string;
  /** Display-only: the Sanity _type of the referenced block document */
  blockType: string;
};

// ---------------------------------------------------------------------------
// Sortable Block Card
// ---------------------------------------------------------------------------

function SortableBlockCard({
  id,
  block,
  onRemove,
}: {
  id: string;
  block: BlockRef;
  onRemove: (key: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const config = BLOCK_CONFIG[block.blockType];
  const Icon = config?.icon;
  const typeLabel = config?.title ?? block.blockType;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center gap-3 rounded-lg border bg-card text-card-foreground shadow-sm p-3 mb-2",
        isDragging && "opacity-50 z-50 scale-[1.02] shadow-md border-primary"
      )}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing hover:text-primary transition-colors text-muted-foreground shrink-0"
      >
        <GripVertical className="h-5 w-5" />
      </div>

      {/* Icon */}
      {Icon && (
        <div className="p-1.5 bg-primary/10 rounded-md text-primary shrink-0">
          <Icon className="h-4 w-4" />
        </div>
      )}

      {/* Name & type */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{block.blockName}</p>
        <p className="text-xs text-muted-foreground">{typeLabel}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
          <Link
            href={`/admin/blocks/${block._ref}/edit`}
            title="Edit block in library"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
          onClick={() => onRemove(id)}
          title="Remove from page"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Builder Component
// ---------------------------------------------------------------------------

export function PageBuilder({
  pageId,
  initialBlocks,
  slug,
}: {
  pageId: string;
  initialBlocks: BlockRef[];
  slug: string;
}) {
  const [blocks, setBlocks] = useState<BlockRef[]>(initialBlocks);
  const [isPending, startTransition] = useTransition();
  const [isSaved, setIsSaved] = useState(true);
  const [previewKey, setPreviewKey] = useState(Date.now());
  const [pickerOpen, setPickerOpen] = useState(false);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((i) => i._key === active.id);
        const newIndex = items.findIndex((i) => i._key === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        setIsSaved(false);
        return newItems;
      });
    }
  };

  const addBlockRef = (ref: BlockRef) => {
    setBlocks((prev) => [...prev, ref]);
    setIsSaved(false);
  };

  const removeBlock = (key: string) => {
    setBlocks(blocks.filter((b) => b._key !== key));
    setIsSaved(false);
  };

  const handleSave = () => {
    startTransition(async () => {
      try {
        // Strip display-only metadata; send only Sanity reference fields
        const refs = blocks.map((b) => ({
          _key: b._key,
          _type: "reference" as const,
          _ref: b._ref,
        }));
        await updatePageBlocks(pageId, refs);
        setIsSaved(true);
        setPreviewKey(Date.now());
      } catch (error) {
        console.error("Failed to save blocks", error);
      }
    });
  };

  const basePreviewUrl = `/${slug === "home" ? "" : slug}`;
  const previewUrl = `${basePreviewUrl}?preview=true&t=${previewKey}`;

  return (
    <div className="flex h-[calc(100vh-140px)] w-full relative">
      {/* Left Pane: Builder */}
      <div className="flex w-1/2 flex-col border-r bg-muted/10 h-full overflow-hidden shrink-0">
        <div className="flex items-center justify-between border-b p-4 bg-background">
          <h2 className="text-sm font-semibold">Blocks Layout</h2>
          <Button size="sm" onClick={handleSave} disabled={isSaved || isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSaved ? "Saved" : "Save Changes"}
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="mx-auto max-w-lg">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={blocks.map((b) => b._key)}
                strategy={verticalListSortingStrategy}
              >
                {blocks.map((block) => (
                  <SortableBlockCard
                    key={block._key}
                    id={block._key}
                    block={block}
                    onRemove={removeBlock}
                  />
                ))}
              </SortableContext>
            </DndContext>

            {blocks.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed rounded-lg mb-4 text-muted-foreground text-sm">
                No blocks added yet. Click the button below to add blocks from
                your library.
              </div>
            )}

            <div className="pt-4 border-t mt-4">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setPickerOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add from Library
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Right Pane: Live Preview */}
      <div className="flex w-1/2 flex-col h-full bg-background shrink-0 relative">
        <div className="flex items-center justify-between border-b p-4 text-sm text-muted-foreground shrink-0 h-[61px]">
          <span>Live Preview</span>
          <div className="flex items-center gap-2">
            {!isSaved && (
              <span className="text-[10px] text-amber-500 font-medium">
                Save to refresh preview
              </span>
            )}
            <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
              <a href={basePreviewUrl} target="_blank" rel="noreferrer">
                <Maximize2 className="h-3 w-3" />
              </a>
            </Button>
          </div>
        </div>
        <div className="flex-1 w-full relative bg-zinc-100 overflow-hidden">
          <iframe
            key={previewKey}
            src={previewUrl}
            className="w-full h-full border-none"
            title="Live Preview"
          />
        </div>
      </div>

      {/* Block Picker Dialog */}
      <BlockPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={addBlockRef}
        existingRefs={blocks.map((b) => b._ref)}
      />
    </div>
  );
}
