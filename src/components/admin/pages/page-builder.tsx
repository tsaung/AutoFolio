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
import { GripVertical, Plus, Trash2, Loader2, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

// Supported block types
const BLOCK_TYPES = [
  { type: "heroBlock", label: "Hero Block" },
  { type: "richTextBlock", label: "Rich Text" },
  { type: "ctaBlock", label: "Call To Action" },
];

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

// ---------------------------------------------------------------------------
// Sortable Block Item Component
// ---------------------------------------------------------------------------
function SortableBlockItem({
  id,
  block,
  onRemove,
  onChange,
}: {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  block: any;
  onRemove: (key: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (key: string, data: any) => void;
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

  const blockTypeLabel = BLOCK_TYPES.find(t => t.type === block._type)?.label || block._type;

  // Render raw JSON for early MVP. We can refine to specialized forms later.
  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const parsed = JSON.parse(e.target.value);
      // Ensure we don't accidentally drop crucial Sanity identity keys
      onChange(id, { ...parsed, _key: id, _type: block._type });
    } catch {
      // Ignore parse errors while typing
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative flex flex-col gap-2 rounded-lg border bg-card text-card-foreground shadow-sm mb-4",
        isDragging && "opacity-50 z-50 scale-[1.02] shadow-md border-primary"
      )}
    >
      <div className="flex items-center justify-between border-b bg-muted/50 px-3 py-2 cursor-pointer rounded-t-lg">
        <div className="flex items-center gap-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing hover:text-primary transition-colors text-muted-foreground"
          >
            <GripVertical className="h-5 w-5" />
          </div>
          <span className="text-sm font-semibold">{blockTypeLabel}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
          onClick={() => onRemove(id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-4">
         <Textarea
            className="font-mono text-xs w-full min-h-[100px]"
            defaultValue={JSON.stringify(block, null, 2)}
            onChange={handleJsonChange}
         />
         <p className="text-[10px] text-muted-foreground mt-1">
           Edit block JSON directly. Advanced form fields coming soon.
         </p>
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialBlocks: any[];
  slug: string;
}) {
  const [blocks, setBlocks] = useState(initialBlocks);
  const [isPending, startTransition] = useTransition();
  const [isSaved, setIsSaved] = useState(true);

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

  const addBlock = (type: string) => {
    const newKey = generateId();
    const newBlock = { _type: type, _key: newKey };
    setBlocks([...blocks, newBlock]);
    setIsSaved(false);
  };

  const removeBlock = (key: string) => {
    setBlocks(blocks.filter((b) => b._key !== key));
    setIsSaved(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateBlock = (key: string, data: any) => {
    setBlocks(blocks.map(b => b._key === key ? data : b));
    setIsSaved(false);
  };

  const handleSave = () => {
    startTransition(async () => {
      try {
        await updatePageBlocks(pageId, blocks);
        setIsSaved(true);
      } catch (error) {
        console.error("Failed to save blocks", error);
      }
    });
  };

  const previewUrl = `/${slug === 'home' ? '' : slug}`;

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
                  <SortableBlockItem
                    key={block._key}
                    id={block._key}
                    block={block}
                    onRemove={removeBlock}
                    onChange={updateBlock}
                  />
                ))}
              </SortableContext>
            </DndContext>

            {blocks.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed rounded-lg mb-4 text-muted-foreground text-sm">
                No blocks added yet. Use the buttons below to start building your page.
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-4 border-t mt-4">
              {BLOCK_TYPES.map((bt) => (
                <Button
                  key={bt.type}
                  variant="outline"
                  size="sm"
                  onClick={() => addBlock(bt.type)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add {bt.label}
                </Button>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Right Pane: Live Preview */}
      <div className="flex w-1/2 flex-col h-full bg-background shrink-0 relative">
        <div className="flex items-center justify-between border-b p-4 text-sm text-muted-foreground shrink-0 h-[61px]">
          <span>Live Preview</span>
          <div className="flex items-center gap-2">
             {/* Dev reload hint */}
            {!isSaved && <span className="text-[10px] text-amber-500 font-medium">Save to refresh preview</span>}
            <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                <a href={previewUrl} target="_blank" rel="noreferrer">
                    <Maximize2 className="h-3 w-3" />
                </a>
            </Button>
          </div>
        </div>
        <div className="flex-1 w-full relative bg-zinc-100 overflow-hidden">
             {/* Use key on iframe to force unmount/remount on save to fetch fresh server data immediately */}
             <iframe
                key={isSaved ? 'saved' : 'dirty'}
                src={previewUrl}
                className="w-full h-full border-none"
                title="Live Preview"
             />
        </div>
      </div>
    </div>
  );
}
