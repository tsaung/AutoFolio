"use client";

import { useState, useEffect } from "react";
import { fetchSanityReferences } from "@/lib/actions/blocks";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, GripVertical, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SanityReference {
  _type: "reference";
  _ref: string;
  _key: string;
}

interface SanityDocument {
  _id: string;
  _type: string;
  title?: string;
  name?: string;
  slug?: { current: string };
}

interface SanityReferencePickerProps {
  type: string; // The Sanity document type to fetch (e.g., 'project', 'experience')
  value: SanityReference[]; // The array of references currently selected
  onChange: (value: SanityReference[]) => void;
  className?: string;
}

function SortableReferenceItem({
  reference,
  document,
  onRemove,
}: {
  reference: SanityReference;
  document?: SanityDocument;
  onRemove: (key: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: reference._key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const displayName = document?.title || document?.name || "Unknown Document";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center justify-between p-3 mb-2 bg-background border rounded-md group",
        isDragging && "opacity-50 border-primary"
      )}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <button
          type="button"
          className="cursor-grab hover:text-primary active:cursor-grabbing text-muted-foreground/50 group-hover:text-muted-foreground transition-colors"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <span className="text-sm font-medium truncate">{displayName}</span>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
        onClick={() => onRemove(reference._key)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function SanityReferencePicker({
  type,
  value = [],
  onChange,
  className,
}: SanityReferencePickerProps) {
  const [documents, setDocuments] = useState<SanityDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Use dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    async function loadDocuments() {
      setIsLoading(true);
      const res = await fetchSanityReferences(type);
      if (res.success && res.documents) {
        setDocuments(res.documents);
      } else {
        toast.error(`Failed to load ${type}s`);
      }
      setIsLoading(false);
    }
    loadDocuments();
  }, [type]);

  const handleToggle = (docId: string, checked: boolean) => {
    if (checked) {
      // Add reference
      const newRef: SanityReference = {
        _type: "reference",
        _ref: docId,
        _key: crypto.randomUUID(), // Sanity arrays need a unique _key
      };
      onChange([...(value || []), newRef]);
    } else {
      // Remove reference
      onChange((value || []).filter((ref) => ref._ref !== docId));
    }
  };

  const handleRemove = (keyToRemove: string) => {
    onChange((value || []).filter((ref) => ref._key !== keyToRemove));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = value.findIndex((ref) => ref._key === active.id);
      const newIndex = value.findIndex((ref) => ref._key === over.id);

      onChange(arrayMove(value, oldIndex, newIndex));
    }
  };

  if (isLoading) {
    return (
      <div className={cn("flex flex-col items-center justify-center p-8 border rounded-md text-muted-foreground", className)}>
        <Loader2 className="h-6 w-6 animate-spin mb-2" />
        <p className="text-sm">Loading {type}s...</p>
      </div>
    );
  }

  // Selected document keys for quick lookup
  const selectedRefs = new Set((value || []).map((ref) => ref._ref));

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-6", className)}>
      {/* Selection Column */}
      <div className="flex flex-col space-y-3">
        <h4 className="text-sm font-medium">Available {type}s</h4>
        <ScrollArea className="h-[300px] border rounded-md p-4">
          {documents.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No {type}s found.
            </p>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc._id} className="flex items-start space-x-3">
                  <Checkbox
                    id={`doc-${doc._id}`}
                    checked={selectedRefs.has(doc._id)}
                    onCheckedChange={(checked) => handleToggle(doc._id, checked as boolean)}
                  />
                  <div className="space-y-1 leading-none">
                    <label
                      htmlFor={`doc-${doc._id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {doc.title || doc.name || "Untitled"}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Reorder/Selected Column */}
      <div className="flex flex-col space-y-3">
        <h4 className="text-sm font-medium">Selected (Drag to reorder)</h4>
        <div className="bg-muted/30 h-[300px] border rounded-md p-4 overflow-y-auto">
          {!value || value.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-sm text-muted-foreground text-center">
                No items selected.<br />Check items on the left to add them.
              </p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={value.map((v) => v._key)}
                strategy={verticalListSortingStrategy}
              >
                {value.map((ref) => {
                  const doc = documents.find((d) => d._id === ref._ref);
                  return (
                    <SortableReferenceItem
                      key={ref._key}
                      reference={ref}
                      document={doc}
                      onRemove={handleRemove}
                    />
                  );
                })}
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>
    </div>
  );
}
