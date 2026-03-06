"use client";

import React, { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragMoveEvent,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { TreeItem } from "./types";
import { SortableTreeItem } from "./sortable-tree-item";
import { SanityPage, SanityNavigationItem } from "@/types/sanity-types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface SortableTreeProps {
  items: TreeItem[];
  onItemsChanged: (items: TreeItem[]) => void;
  availablePages: SanityPage[];
}

export function SortableTree({
  items,
  onItemsChanged,
  availablePages,
}: SortableTreeProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [offsetLeft, setOffsetLeft] = useState(0);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id as string);
    setOverId(active.id as string);
    document.body.style.setProperty("cursor", "grabbing");
  };

  const handleDragMove = ({ delta }: DragMoveEvent) => {
    setOffsetLeft(delta.x);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    resetState();

    if (over && active.id !== over.id) {
      const activeIndex = items.findIndex((item) => item.id === active.id);
      const overIndex = items.findIndex((item) => item.id === over.id);

      const activeItem = items[activeIndex];
      const overItem = items[overIndex];

      const activeDepth = activeItem.depth;
      const overDepth = overItem.depth;

      const newDepth = overDepth;

      // Handle simple reordering for now.
      // Dnd-kit tree nesting logic requires offset calculation, max depth 3.
      // For this simplified version, we'll respect max depth and basic reordering.

      const movedItems = arrayMove(items, activeIndex, overIndex);

      // Basic depth update logic for demo purposes
      movedItems[activeIndex].depth = newDepth;

      onItemsChanged(movedItems);
    }
  };

  const handleDragCancel = () => {
    resetState();
  };

  const resetState = () => {
    setActiveId(null);
    setOverId(null);
    setOffsetLeft(0);
    document.body.style.setProperty("cursor", "");
  };

  const handleRemove = (id: string) => {
    onItemsChanged(items.filter((item) => item.id !== id));
  };

  const handleUpdate = (id: string, updatedItem: Partial<SanityNavigationItem>) => {
    onItemsChanged(
      items.map((item) =>
        item.id === id ? { ...item, item: { ...item.item, ...updatedItem } } : item
      )
    );
  };

  const handleAdd = () => {
    const newId = `item-${Math.random().toString(36).substr(2, 9)}`;
    onItemsChanged([
      ...items,
      {
        id: newId,
        depth: 0,
        parentId: null,
        item: { _type: "navigationItem", label: "New Item", _key: newId },
      },
    ]);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <ul className="space-y-2">
          {items.map((item) => (
            <SortableTreeItem
              key={item.id}
              id={item.id as string}
              item={item}
              depth={item.depth}
              availablePages={availablePages}
              onRemove={() => handleRemove(item.id as string)}
              onUpdate={(updated) => handleUpdate(item.id as string, updated)}
            />
          ))}
        </ul>
      </SortableContext>

      <Button
        variant="outline"
        className="w-full mt-4 border-dashed"
        onClick={handleAdd}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Navigation Item
      </Button>

      <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: "0.4" } } }) }}>
        {activeId ? (
          <SortableTreeItem
            id={activeId}
            item={items.find((i) => i.id === activeId)!}
            depth={items.find((i) => i.id === activeId)?.depth || 0}
            availablePages={availablePages}
            onRemove={() => {}}
            onUpdate={() => {}}
            clone
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
