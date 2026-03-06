"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function HeroBlockForm({
  block,
  onChange,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  block: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (key: string, data: any) => void;
}) {
  const handleChange = (field: string, value: string) => {
    onChange(block._key, { ...block, [field]: value });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <Label htmlFor={`headline-${block._key}`}>Headline</Label>
        <Input
          id={`headline-${block._key}`}
          value={block.headline || ""}
          onChange={(e) => handleChange("headline", e.target.value)}
          placeholder="Enter headline..."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`subheadline-${block._key}`}>Subheadline</Label>
        <Textarea
          id={`subheadline-${block._key}`}
          value={block.subheadline || ""}
          onChange={(e) => handleChange("subheadline", e.target.value)}
          placeholder="Enter subheadline..."
          className="min-h-[80px]"
        />
      </div>
      <div className="text-xs text-muted-foreground mt-2 border-t pt-2">
        Note: Advanced fields like background images and buttons are currently
        only editable via the JSON fallback.
      </div>
    </div>
  );
}
