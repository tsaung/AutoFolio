"use client";

import React, { CSSProperties } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TreeItem } from "./types";
import { SanityPage, SanityNavigationItem } from "@/types/sanity-types";
import { GripVertical, Trash2, Link as LinkIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SortableTreeItemProps {
  id: string;
  item: TreeItem;
  depth: number;
  availablePages: SanityPage[];
  onRemove: () => void;
  onUpdate: (item: Partial<SanityNavigationItem>) => void;
  clone?: boolean;
}

export function SortableTreeItem({
  id,
  item,
  depth,
  availablePages,
  onRemove,
  onUpdate,
  clone,
}: SortableTreeItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    paddingLeft: clone ? 0 : `${depth * 24}px`,
    opacity: isDragging ? 0.5 : 1,
  };

  const currentLink = item.item.link?.[0];
  const isExternal = currentLink?._type === "externalLink";

  const handleTypeChange = (value: "page" | "url") => {
    if (value === "page") {
      onUpdate({ link: [{ _type: "reference", _ref: "", _key: `link-${Math.random()}` }] });
    } else {
      onUpdate({ link: [{ _type: "externalLink", url: "https://", _key: `link-${Math.random()}` }] });
    }
  };

  const handlePageSelect = (pageId: string) => {
    onUpdate({ link: [{ _type: "reference", _ref: pageId, _key: `link-${Math.random()}` }] });
  };

  const handleUrlChange = (url: string) => {
    onUpdate({ link: [{ _type: "externalLink", url, _key: `link-${Math.random()}` }] });
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 mb-2 ${
        clone ? "pointer-events-none z-50 shadow-lg bg-card border" : ""
      }`}
    >
      <div className="flex-1 flex items-center gap-2 p-2 bg-card border rounded-md shadow-sm">
        <button
          className="p-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <Input
          value={item.item.label}
          onChange={(e) => onUpdate({ label: e.target.value })}
          placeholder="Navigation Label"
          className="flex-1 h-8"
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-2">
              <LinkIcon className="h-4 w-4" />
              {currentLink ? (isExternal ? "External URL" : "Page Ref") : "Add Link"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="end">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Link Type</label>
                <Select
                  value={isExternal ? "url" : "page"}
                  onValueChange={handleTypeChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="page">Internal Page</SelectItem>
                    <SelectItem value="url">External URL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isExternal ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium">URL</label>
                  <Input
                    value={(currentLink as any)?.url || ""}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Page</label>
                  <Select
                    value={(currentLink as any)?._ref || ""}
                    onValueChange={handlePageSelect}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a page..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availablePages.map((page) => (
                        <SelectItem key={page._id} value={page._id}>
                          {page.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive"
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </li>
  );
}
