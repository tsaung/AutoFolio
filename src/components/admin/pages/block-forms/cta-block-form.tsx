"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function CtaBlockForm({
  block,
  onChange,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  block: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (key: string, data: any) => void;
}) {
  const handleFieldChange = (field: string, value: string) => {
    onChange(block._key, { ...block, [field]: value });
  };

  const handleButtonChange = (field: string, value: string) => {
    const newButton = { ...(block.button || {}), [field]: value };
    onChange(block._key, { ...block, button: newButton });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <Label htmlFor={`heading-${block._key}`}>Heading</Label>
        <Input
          id={`heading-${block._key}`}
          value={block.heading || ""}
          onChange={(e) => handleFieldChange("heading", e.target.value)}
          placeholder="Enter heading..."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`text-${block._key}`}>Supporting Text</Label>
        <Textarea
          id={`text-${block._key}`}
          value={block.text || ""}
          onChange={(e) => handleFieldChange("text", e.target.value)}
          placeholder="Enter supporting text..."
          className="min-h-[80px]"
        />
      </div>

      <div className="border rounded-md p-4 space-y-4 bg-muted/20">
        <h4 className="text-sm font-semibold mb-2">Button Settings</h4>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`btn-label-${block._key}`}>Button Label</Label>
            <Input
              id={`btn-label-${block._key}`}
              value={block.button?.label || ""}
              onChange={(e) => handleButtonChange("label", e.target.value)}
              placeholder="e.g., Get Started"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`btn-url-${block._key}`}>Button URL</Label>
            <Input
              id={`btn-url-${block._key}`}
              value={block.button?.url || ""}
              onChange={(e) => handleButtonChange("url", e.target.value)}
              placeholder="e.g., /contact"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
